import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { pageVariants, listVariants, itemVariants } from '../lib/motion';
import { getCases, getUsers } from '../services/api';

const AVATAR_STYLES = [
  { avatarBg: 'bg-indigo-100', avatarText: 'text-indigo-700' },
  { avatarBg: 'bg-pink-100', avatarText: 'text-pink-700' },
  { avatarBg: 'bg-cyan-100', avatarText: 'text-cyan-700' },
  { avatarBg: 'bg-emerald-100', avatarText: 'text-emerald-700' },
  { avatarBg: 'bg-amber-100', avatarText: 'text-amber-700' },
];

const INITIAL_NOTIFICATIONS = [
  { id: 1, icon: 'gavel',          iconBg: 'bg-red-100',     iconColor: 'text-red-600',     title: 'New High-Severity Case', body: 'Case #DAC-2026-049 flagged as Critical — Exam Malpractice.', time: '2 min ago',  read: false },
  { id: 2, icon: 'pending_actions',iconBg: 'bg-amber-100',   iconColor: 'text-amber-600',   title: 'DAC Review Pending',     body: 'Case #DAC-2026-041 is awaiting committee review.',            time: '18 min ago', read: false },
  { id: 3, icon: 'check_circle',   iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', title: 'Case Resolved',          body: 'Case #DAC-2026-038 marked as resolved by Admin.',             time: '1 hr ago',   read: false },
  { id: 4, icon: 'person_add',     iconBg: 'bg-blue-100',    iconColor: 'text-blue-600',    title: 'New User Registered',    body: 'Faculty member Dr. Sharma joined the system.',                time: '3 hr ago',   read: true  },
  { id: 5, icon: 'rule',           iconBg: 'bg-purple-100',  iconColor: 'text-purple-600',  title: 'Rule Set Updated',       body: 'Disciplinary rule weights updated to v4.3.',                  time: 'Yesterday',  read: true  },
];

// ─── Greeting helper ──────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function toTitleCase(value = '') {
  return String(value)
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function severityClass(severity) {
  if (severity === 'Critical') return 'bg-red-100 text-red-700';
  if (severity === 'High') return 'bg-orange-100 text-orange-700';
  if (severity === 'Medium') return 'bg-yellow-100 text-yellow-700';
  return 'bg-slate-100 text-slate-600';
}

function statusDot(status) {
  if (status === 'Pending Review' || status === 'Pending') return 'bg-yellow-400';
  if (status === 'Investigation') return 'bg-blue-400';
  if (status === 'Dac Review') return 'bg-purple-400';
  if (status === 'Resolved') return 'bg-emerald-400';
  return 'bg-slate-400';
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const hasLoggedResponseRef = useRef(false);
  const [search, setSearch]           = useState('');
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [notifOpen, setNotifOpen]     = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [cases, setCases] = useState([]);
  const [statCards, setStatCards] = useState([]);
  const [newApplicants, setNewApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const notifRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError('');

        const [casesResponse, usersResponse] = await Promise.all([getCases(), getUsers()]);

        if (!hasLoggedResponseRef.current) {
          console.log('Dashboard API response:', { cases: casesResponse, users: usersResponse });
          hasLoggedResponseRef.current = true;
        }

        const usersById = Object.fromEntries(usersResponse.map((user) => [String(user.id), user]));
        const mappedCases = casesResponse.map((entry, index) => {
          const student = usersById[String(entry.student_id)] ?? {};
          const status = toTitleCase(entry.status) || 'Pending Review';
          const severity = toTitleCase(entry.severity) || 'Low';
          const style = AVATAR_STYLES[index % AVATAR_STYLES.length];
          const name = student.name || 'Unknown Student';
          return {
            id: `#${entry.id}`,
            name,
            dept: student.program ? toTitleCase(student.program) : 'N/A',
            initials: name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
            avatarBg: style.avatarBg,
            avatarText: style.avatarText,
            offense: toTitleCase(entry.offense_type) || 'N/A',
            severity,
            severityClass: severityClass(severity),
            statusDot: statusDot(status),
            status,
            action: status === 'Resolved' ? 'View Details' : 'Manage',
          };
        });

        const total = casesResponse.length;
        const pending = casesResponse.filter((entry) => ['pending', 'pending_review', 'dac_review', 'investigation'].includes(String(entry.status || '').toLowerCase())).length;
        const highSeverity = casesResponse.filter((entry) => ['high', 'critical'].includes(String(entry.severity || '').toLowerCase())).length;
        const resolved = casesResponse.filter((entry) => String(entry.status || '').toLowerCase() === 'resolved').length;

        const cards = [
          { label: 'Total Cases', value: String(total), icon: 'folder_shared', gradient: 'from-[#4f46e5] to-[#6366f1]', iconBg: 'bg-white/20' },
          { label: 'Pending DAC Cases', value: String(pending), icon: 'pending_actions', gradient: 'from-[#f59e0b] to-[#fbbf24]', iconBg: 'bg-white/20' },
          { label: 'High Severity', value: String(highSeverity), icon: 'gavel', gradient: 'from-[#ef4444] to-[#f87171]', iconBg: 'bg-white/20' },
          { label: 'Resolved Cases', value: String(resolved), icon: 'check_circle', gradient: 'from-[#10b981] to-[#34d399]', iconBg: 'bg-white/20' },
        ];

        const applicants = mappedCases.slice(0, 5).map((entry) => ({
          name: entry.name,
          role: entry.status,
          initials: entry.initials,
          avatarBg: entry.avatarBg,
          avatarText: entry.avatarText,
        }));

        if (mounted) {
          setCases(mappedCases);
          setStatCards(cards);
          setNewApplicants(applicants);
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError?.message || 'Failed to fetch dashboard data.');
          setCases([]);
          setStatCards([]);
          setNewApplicants([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const markAllRead = () => setNotifications((p) => p.map((n) => ({ ...n, read: true })));
  const markRead    = (id) => setNotifications((p) => p.map((n) => n.id === id ? { ...n, read: true } : n));

  const filtered = cases.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.offense.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
  );

  const selected = selectedCase ? cases.find((c) => c.id === selectedCase) : null;

  return (
    <div className="min-h-screen bg-[#f0f2ff] font-sans antialiased">
      <Sidebar />

      <main className="pt-14 md:pt-0 md:pl-64 flex flex-col min-h-screen">

        {/* ── Top Header ── */}
        <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-20 px-4 md:px-6 py-3 flex items-center justify-between gap-4">

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[18px]">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cases, students..."
              className="w-full pl-9 pr-4 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/30 placeholder:text-[#94a3b8] text-[#0f172a]"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* New Case */}
            <Link
              to="/register-case"
              className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Add New
            </Link>

            {/* Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className={`relative p-2 rounded-xl transition-colors ${notifOpen ? 'text-[#4f46e5] bg-[#4f46e5]/10' : 'text-[#64748b] hover:bg-slate-100'}`}
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center">
                    <span className="text-white text-[8px] font-bold">{unreadCount}</span>
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#e2e8f0] rounded-2xl shadow-2xl z-50 overflow-hidden origin-top-right"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#f1f5f9]">
                      <div className="flex items-center gap-2">
                        <span className="text-[#0f172a] font-semibold text-sm">Notifications</span>
                        {unreadCount > 0 && <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
                      </div>
                      {unreadCount > 0 && <button onClick={markAllRead} className="text-[#4f46e5] text-xs font-medium hover:underline">Mark all read</button>}
                    </div>
                    <div className="max-h-[360px] overflow-y-auto divide-y divide-[#f8fafc]">
                      {notifications.map((n) => (
                        <button key={n.id} onClick={() => markRead(n.id)}
                          className={`w-full text-left flex items-start gap-3 px-4 py-3 transition-colors ${n.read ? 'bg-white hover:bg-slate-50' : 'bg-indigo-50/60 hover:bg-indigo-50'}`}
                        >
                          <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center mt-0.5 ${n.iconBg}`}>
                            <span className={`material-symbols-outlined text-[15px] ${n.iconColor}`}>{n.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm leading-snug ${n.read ? 'text-[#0f172a] font-medium' : 'text-[#0f172a] font-semibold'}`}>{n.title}</p>
                            <p className="text-xs text-[#64748b] mt-0.5 leading-snug">{n.body}</p>
                            <p className="text-[10px] text-[#94a3b8] mt-1">{n.time}</p>
                          </div>
                          {!n.read && <span className="h-2 w-2 rounded-full bg-[#4f46e5] shrink-0 mt-1.5" />}
                        </button>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 border-t border-[#f1f5f9] text-center">
                      <button className="text-[#4f46e5] text-xs font-medium hover:underline">View all notifications</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            {/* <div className="flex items-center gap-2 pl-2 border-l border-[#e2e8f0]">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-[#0f172a] leading-tight">Admin User</p>
                <p className="text-[10px] text-[#64748b]">View profile</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#4f46e5] to-[#818cf8] flex items-center justify-center text-white text-xs font-bold">A</div>
            </div> */}
          </div>
        </header>

        {/* ── Page Body ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── Main Content ── */}
          <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6"
          >

            {/* ── Hero Banner ── */}
            <motion.div
              variants={itemVariants}
              className="relative bg-gradient-to-r from-[#4f46e5] via-[#5b52e8] to-[#6366f1] rounded-2xl p-6 md:p-8 overflow-hidden text-white"
            >
              {/* Decorative circles */}
              <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
              <div className="absolute right-20 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/3" />

              <div className="relative z-10 max-w-lg">
                <p className="text-indigo-200 text-sm font-medium mb-1">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">{getGreeting()}, Admin </h1>
                <p className="text-indigo-200 text-sm leading-relaxed mb-5">
                  You have <span className="text-white font-semibold">{statCards[1]?.value ?? '0'} pending DAC cases</span> and <span className="text-white font-semibold">{statCards[2]?.value ?? '0'} high-severity alerts</span> awaiting your review. Let's get started.
                </p>
                <Link
                  to="/register-case"
                  className="inline-flex items-center gap-2 bg-white text-[#4f46e5] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-50 transition-colors shadow-md"
                >
                  <span className="material-symbols-outlined text-[16px]">add_circle</span>
                  Register New Case
                </Link>
              </div>

              {/* Floating illustration placeholder */}
              {/* <div className="absolute right-6 bottom-0 hidden md:flex items-end">
                <div className="w-28 h-28 bg-white/10 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-[64px] text-white/60">manage_accounts</span>
                </div>
              </div> */}
            </motion.div>

            {loading && <p className="text-[#64748b] text-sm">Loading...</p>}
            {!!error && <p className="text-sm text-red-600">Error: {error}</p>}

            {/* ── Stats Grid ── */}
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {statCards.map((s) => (
                <motion.div
                  key={s.label}
                  variants={itemVariants}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className={`bg-gradient-to-br ${s.gradient} rounded-2xl p-5 text-white shadow-lg cursor-default`}
                >
                  <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center mb-3`}>
                    <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                  </div>
                  <p className="text-white/80 text-xs font-medium mb-1">{s.label}</p>
                  <h3 className="text-2xl font-bold tracking-tight">{s.value}</h3>
                </motion.div>
              ))}
            </motion.div>

            {/* ── Table ── */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f5f9]">
                <h3 className="text-base font-bold text-[#0f172a]">Recent Disciplinary Cases</h3>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#64748b] bg-[#f8fafc] border border-[#e2e8f0] rounded-lg hover:bg-slate-100 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">filter_list</span> Filter
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#64748b] bg-[#f8fafc] border border-[#e2e8f0] rounded-lg hover:bg-slate-100 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">download</span> Export
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#f8fafc] border-b border-[#f1f5f9]">
                      {['Token ID', 'Student Name', 'Offense Type', 'Severity', 'Status', 'Actions'].map((h, i) => (
                        <th key={h} className={`px-5 py-3 text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider ${i === 5 ? 'text-right' : ''}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f8fafc]">
                    {filtered.map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => setSelectedCase(row.id === selectedCase ? null : row.id)}
                        className={`cursor-pointer transition-colors ${selectedCase === row.id ? 'bg-indigo-50' : 'hover:bg-[#f8fafc]'}`}
                      >
                        <td className="px-5 py-3.5">
                          <span className="font-mono text-xs text-[#64748b]">{row.id}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className={`h-8 w-8 rounded-full ${row.avatarBg} flex items-center justify-center ${row.avatarText} text-[11px] font-bold shrink-0`}>
                              {row.initials}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#0f172a]">{row.name}</p>
                              <p className="text-[11px] text-[#94a3b8]">{row.dept}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-sm text-[#334155]">{row.offense}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${row.severityClass}`}>
                            {row.severity}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className={`h-1.5 w-1.5 rounded-full ${row.statusDot}`} />
                            <span className="text-sm text-[#334155]">{row.status}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          {row.action === 'Manage' ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); navigate(`/cases/${row.id.replace('#', '')}`); }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#4f46e5] text-white text-xs font-semibold rounded-lg hover:bg-[#4338ca] transition-colors"
                            >
                              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                              Manage
                            </button>
                          ) : (
                            <button
                              onClick={(e) => { e.stopPropagation(); navigate(`/view-case/${row.id.replace('#', '')}`); }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#f1f5f9] text-[#64748b] text-xs font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[13px]">visibility</span>
                              View
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-3.5 bg-[#f8fafc] border-t border-[#f1f5f9]">
                <p className="text-xs text-[#94a3b8]">Showing <span className="font-semibold text-[#334155]">1–{filtered.length}</span> of <span className="font-semibold text-[#334155]">{cases.length}</span> results</p>
                <div className="flex gap-1.5">
                  <button className="px-3 py-1.5 text-xs border border-[#e2e8f0] rounded-lg bg-white text-[#64748b] hover:bg-slate-50 disabled:opacity-50 transition-colors">Previous</button>
                  <button className="px-3 py-1.5 text-xs border border-[#e2e8f0] rounded-lg bg-white text-[#64748b] hover:bg-slate-50 transition-colors">Next</button>
                </div>
              </div>
            </motion.div>

          </motion.div>

          {/* ── Right Panel ── */}
          <AnimatePresence mode="wait">
            {selected ? (
              /* ── Case Detail Side Panel ── */
              <motion.aside
                key="case-detail"
                initial={{ x: 320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 320, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="hidden xl:flex w-80 shrink-0 border-l border-[#e2e8f0] bg-white flex-col overflow-y-auto"
              >
                {/* Panel Header */}
                <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center justify-between sticky top-0 bg-white z-10">
                  <div>
                    <p className="font-mono text-xs text-[#94a3b8]">{selected.id}</p>
                    <p className="font-bold text-[#0f172a] text-sm mt-0.5">{selected.name}</p>
                  </div>
                  <button onClick={() => setSelectedCase(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-[#64748b] transition-colors">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                <div className="p-5 flex flex-col gap-4">
                  {/* Status & Severity */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${selected.severityClass}`}>
                      {selected.severity}
                    </span>
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100">
                      <span className={`h-1.5 w-1.5 rounded-full ${selected.statusDot}`} />
                      <span className="text-xs font-medium text-[#334155]">{selected.status}</span>
                    </div>
                  </div>

                  {/* Info rows */}
                  <div className="bg-[#f8fafc] rounded-xl p-4 flex flex-col gap-3">
                    {[
                      { label: 'Department', value: selected.dept },
                      { label: 'Offense',    value: selected.offense },
                      { label: 'Status',     value: selected.status },
                      { label: 'Severity',   value: selected.severity },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-center">
                        <span className="text-xs text-[#94a3b8] font-medium">{label}</span>
                        <span className="text-xs font-semibold text-[#334155]">{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Avatar */}
                  <div className="flex items-center gap-3 p-3 bg-[#f8fafc] rounded-xl">
                    <div className={`h-10 w-10 rounded-full ${selected.avatarBg} flex items-center justify-center ${selected.avatarText} text-sm font-bold shrink-0`}>
                      {selected.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0f172a]">{selected.name}</p>
                      <p className="text-xs text-[#94a3b8]">{selected.dept}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 pt-1">
                    {selected.action === 'Manage' ? (
                      <>
                        <button
                          onClick={() => navigate(`/cases/${selected.id.replace('#', '')}`)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4f46e5] text-white text-sm font-semibold rounded-xl hover:bg-[#4338ca] transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">gavel</span>
                          Manage Case
                        </button>
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-xl hover:bg-emerald-100 transition-colors border border-emerald-200">
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          Mark Resolved
                        </button>
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-100 transition-colors border border-red-200">
                          <span className="material-symbols-outlined text-[16px]">cancel</span>
                          Dismiss Case
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => navigate(`/view-case/${selected.id.replace('#', '')}`)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4f46e5] text-white text-sm font-semibold rounded-xl hover:bg-[#4338ca] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              </motion.aside>
            ) : (
              /* ── Default Right Panel ── */
              <motion.aside
                key="default-panel"
                initial={{ x: 320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 320, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="hidden xl:flex w-72 shrink-0 border-l border-[#e2e8f0] bg-white flex-col overflow-y-auto"
              >
                {/* Schedule Calendar Widget */}
                <div className="px-5 py-4 border-b border-[#f1f5f9]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-[#0f172a]">Schedule Calendar</span>
                    <div className="flex items-center gap-1">
                      <button className="p-1 rounded hover:bg-slate-100 text-[#94a3b8]"><span className="material-symbols-outlined text-[14px]">chevron_left</span></button>
                      <button className="p-1 rounded hover:bg-slate-100 text-[#94a3b8]"><span className="material-symbols-outlined text-[14px]">chevron_right</span></button>
                      <span className="text-xs font-semibold text-[#4f46e5] bg-indigo-50 px-2 py-0.5 rounded-lg">
                        {new Date().toLocaleDateString('en-IN', { month: 'short' })}
                      </span>
                    </div>
                  </div>
                  {/* Days strip */}
                  <div className="grid grid-cols-5 gap-1">
                    {Array.from({ length: 5 }, (_, i) => {
                      const d = new Date();
                      d.setDate(d.getDate() - 2 + i);
                      const isToday = i === 2;
                      return (
                        <button key={i} className={`flex flex-col items-center py-2 rounded-xl text-xs transition-colors ${isToday ? 'bg-[#4f46e5] text-white' : 'hover:bg-slate-50 text-[#64748b]'}`}>
                          <span className={`text-[10px] font-medium ${isToday ? 'text-indigo-200' : 'text-[#94a3b8]'}`}>{d.toLocaleDateString('en-IN', { weekday: 'short' }).slice(0, 3)}</span>
                          <span className={`text-sm font-bold mt-0.5 ${isToday ? 'text-white' : 'text-[#0f172a]'}`}>{d.getDate()}</span>
                          {isToday && <span className="h-1 w-1 rounded-full bg-white/60 mt-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Cases list */}
                <div className="px-5 py-4 border-b border-[#f1f5f9]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-[#0f172a]">Today's Cases</span>
                    <button className="text-[10px] font-semibold text-[#4f46e5] bg-indigo-50 px-2 py-0.5 rounded-lg hover:bg-indigo-100 transition-colors">View All</button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {newApplicants.map((a, i) => (
                      <div key={i} className="flex items-center justify-between gap-2 py-1.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`h-8 w-8 rounded-full ${a.avatarBg} flex items-center justify-center ${a.avatarText} text-[11px] font-bold shrink-0`}>
                            {a.initials}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-[#0f172a]">{a.name}</p>
                            <p className="text-[10px] text-[#94a3b8]">{a.role}</p>
                          </div>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center hover:bg-indigo-200 transition-colors">
                            <span className="material-symbols-outlined text-[12px] text-[#4f46e5]">chat_bubble</span>
                          </button>
                          <button className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center hover:bg-indigo-200 transition-colors">
                            <span className="material-symbols-outlined text-[12px] text-[#4f46e5]">call</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                {/* <div className="px-5 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-[#0f172a]">Severity Breakdown</span>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {[
                      { label: 'Critical', count: 2, pct: 40, color: 'bg-red-400' },
                      { label: 'High',     count: 1, pct: 20, color: 'bg-orange-400' },
                      { label: 'Medium',   count: 1, pct: 20, color: 'bg-yellow-400' },
                      { label: 'Low',      count: 1, pct: 20, color: 'bg-emerald-400' },
                    ].map(({ label, count, pct, color }) => (
                      <div key={label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-medium text-[#64748b]">{label}</span>
                          <span className="text-[11px] font-semibold text-[#334155]">{count}</span>
                        </div>
                        <div className="h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                          <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-[#94a3b8] mt-4 text-center">Click a table row to view quick actions →</p>
                </div> */}
              </motion.aside>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}