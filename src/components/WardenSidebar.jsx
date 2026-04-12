import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const mainNavItems = [
  { to: '/warden/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/warden/register', label: 'Register Case', icon: 'edit_document' },
  { to: '/warden/cases', label: 'My Cases', icon: 'folder_open' },
];

function SidebarContent({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const displayName = currentUser?.displayName || currentUser?.email || 'Warden';
  const photoURL = currentUser?.photoURL || null;
  const email = currentUser?.email || '';
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  useEffect(() => {
    if (onClose) onClose();
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 pt-7 pb-6 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0">
          <img src="/favicon.png" alt="DAC Logo" className="w-10 h-10 object-contain" />
        </div>
        <div className="flex-1">
          <h1 className="text-[#0f172a] font-extrabold text-base leading-tight tracking-tight">DAC System</h1>
          <p className="text-[#64748b] text-xs">Warden Portal</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden text-[#94a3b8] hover:text-[#0f172a] transition-colors"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-0.5">
        {mainNavItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#4f46e5] text-white shadow-md shadow-indigo-200/60'
                  : 'text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`material-symbols-outlined text-[20px] transition-colors ${
                    isActive ? 'text-white' : 'text-[#94a3b8] group-hover:text-[#4f46e5]'
                  }`}
                >
                  {icon}
                </span>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}

        <div className="my-3 border-t border-[#f1f5f9]" />

        <NavLink
          to="/warden/notifications"
          className={({ isActive }) =>
            `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              isActive
                ? 'bg-[#4f46e5] text-white shadow-md shadow-indigo-200/60'
                : 'text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`material-symbols-outlined text-[20px] transition-colors ${
                  isActive ? 'text-white' : 'text-[#94a3b8] group-hover:text-[#4f46e5]'
                }`}
              >
                notifications
              </span>
              <span>Notifications</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/warden/profile"
          className={({ isActive }) =>
            `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              isActive
                ? 'bg-[#4f46e5] text-white shadow-md shadow-indigo-200/60'
                : 'text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`material-symbols-outlined text-[20px] transition-colors ${
                  isActive ? 'text-white' : 'text-[#94a3b8] group-hover:text-[#4f46e5]'
                }`}
              >
                person
              </span>
              <span>Profile</span>
            </>
          )}
        </NavLink>
      </nav>

      <div className="mx-4 mb-4 p-3 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] flex items-center gap-3">
        {photoURL ? (
          <img
            src={photoURL}
            alt={displayName}
            referrerPolicy="no-referrer"
            className="h-9 w-9 rounded-xl object-cover shrink-0 shadow-sm"
          />
        ) : (
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#818cf8] flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-white text-xs font-bold">{initials}</span>
          </div>
        )}
        <div className="flex flex-col overflow-hidden flex-1 min-w-0">
          <p className="text-[#0f172a] text-xs font-semibold truncate">{displayName}</p>
          <p className="text-[#94a3b8] text-[10px] truncate">{email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#64748b] hover:bg-red-50 hover:text-red-500 transition-all duration-150 mt-2"
        >
          <span className="material-symbols-outlined text-[20px] text-[#94a3b8] group-hover:text-red-400 transition-colors">
            logout
          </span>
        </button>
      </div>
    </div>
  );
}

export default function WardenSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-[#e2e8f0] flex items-center gap-3 px-4 h-14">
        <button
          onClick={() => setMobileOpen(true)}
          className="text-[#64748b] hover:text-[#4f46e5] transition-colors"
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>
        <div className="flex items-center gap-2.5">
          <div>
            <img src="/favicon.png" alt="DAC Logo" className="w-10 h-10 object-contain" />
          </div>
          <span className="text-[#0f172a] font-extrabold text-sm tracking-tight">DAC System</span>
        </div>
      </header>

      <aside className="hidden md:flex fixed top-0 left-0 w-64 h-screen flex-col z-30 border-r border-[#e8eaf0] bg-white">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`md:hidden fixed top-0 left-0 h-screen w-72 bg-white border-r border-[#e2e8f0] z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </aside>
    </>
  );
}
