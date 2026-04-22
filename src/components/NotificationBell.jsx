import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications, markNotificationRead } from '../services/api';
import { useAuth } from '../context/AuthContext';

function getCasePathByRole(role, caseId) {
  const normalized = String(role || '').toLowerCase();
  if (normalized === 'warden') return `/warden/cases/${caseId}`;
  if (normalized === 'chief_warden') return `/chief-warden/cases/${caseId}`;
  if (normalized === 'student') return `/student/cases/${caseId}`;
  return `/cases/${caseId}`;
}

export default function NotificationBell() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const containerRef = useRef(null);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.is_read).length,
    [notifications],
  );

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError('');
      const payload = await getNotifications();
      setNotifications(payload || []);
    } catch (fetchError) {
      setError(fetchError?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(fetchItems, 30000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onReadAndOpen = async (item) => {
    try {
      if (!item.is_read) {
        await markNotificationRead(item.id);
        setNotifications((prev) => prev.map((entry) => (
          entry.id === item.id ? { ...entry, is_read: true } : entry
        )));
      }
    } catch {
      // Keep UX responsive even if mark-as-read fails.
    }

    setOpen(false);
    if (item.case_id) {
      navigate(getCasePathByRole(role, item.case_id));
    }
  };

  const onMarkAllRead = async () => {
    const unread = notifications.filter((item) => !item.is_read);
    for (const item of unread) {
      try {
        await markNotificationRead(item.id);
      } catch {
        // Continue trying to mark remaining notifications.
      }
    }
    setNotifications((prev) => prev.map((item) => ({ ...item, is_read: true })));
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((value) => !value)}
        className={`relative p-2 rounded-xl transition-colors ${open ? 'text-[#4f46e5] bg-[#4f46e5]/10' : 'text-[#64748b] hover:bg-slate-100'}`}
      >
        <span className="material-symbols-outlined text-[20px]">notifications</span>
        {unreadCount > 0 ? (
          <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-red-500 border-2 border-white flex items-center justify-center">
            <span className="text-white text-[8px] font-bold">{unreadCount}</span>
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#e2e8f0] rounded-2xl shadow-2xl z-50 overflow-hidden origin-top-right">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#f1f5f9]">
            <div className="flex items-center gap-2">
              <span className="text-[#0f172a] font-semibold text-sm">Notifications</span>
              {unreadCount > 0 ? (
                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
              ) : null}
            </div>
            {unreadCount > 0 ? (
              <button onClick={onMarkAllRead} className="text-[#4f46e5] text-xs font-medium hover:underline">Mark all read</button>
            ) : null}
          </div>

          <div className="max-h-[360px] overflow-y-auto divide-y divide-[#f8fafc]">
            {loading ? (
              <div className="px-4 py-6 text-sm text-[#64748b]">Loading notifications...</div>
            ) : null}
            {!loading && error ? (
              <div className="px-4 py-6 text-sm text-red-600">{error}</div>
            ) : null}
            {!loading && !error && notifications.length === 0 ? (
              <div className="px-4 py-6 text-sm text-[#64748b]">No notifications yet.</div>
            ) : null}

            {!loading && !error && notifications.map((item) => (
              <button
                key={item.id}
                onClick={() => onReadAndOpen(item)}
                className={`w-full text-left px-4 py-3 transition-colors ${item.is_read ? 'bg-white hover:bg-slate-50' : 'bg-indigo-50/60 hover:bg-indigo-50'}`}
              >
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#4f46e5] mt-0.5">notifications</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-snug ${item.is_read ? 'text-[#0f172a] font-medium' : 'text-[#0f172a] font-semibold'}`}>{item.message}</p>
                    <p className="text-[10px] text-[#94a3b8] mt-1">{new Date(item.created_at).toLocaleString()}</p>
                  </div>
                  {!item.is_read ? <span className="h-2 w-2 rounded-full bg-[#4f46e5] shrink-0 mt-1.5" /> : null}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
