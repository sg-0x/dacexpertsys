import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const adminSubItems = [
  { to: '/admin-settings/rules-weights', label: 'Rules & Weights', icon: 'balance' },
  { to: '/admin-settings/users', label: 'User Management', icon: 'manage_accounts' },
  { to: '/admin-settings/system', label: 'System Config', icon: 'tune' },
];

const mainNavItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/register-case', label: 'Register Case', icon: 'edit_document' },
  { to: '/reports', label: 'Reports', icon: 'bar_chart' },
];

// ── Shared nav content ────────────────────────────────────────────────────────
function SidebarContent({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const isAdminActive = location.pathname.startsWith('/admin-settings');
  const [adminOpen, setAdminOpen] = useState(isAdminActive);

  const displayName = currentUser?.displayName || currentUser?.email || 'User';
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

  // Close mobile drawer on route change
  useEffect(() => {
    if (onClose) onClose();
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col justify-between h-full">

      {/* ── Top: Logo + Nav ── */}
      <div className="p-6 overflow-y-auto flex-1">

        {/* Logo row + mobile close button */}
        <div className="flex items-center gap-3 mb-8">
          <div className="rounded-lg overflow-hidden flex items-center justify-center shrink-0">
            <img src="./logo.png" alt="DAC Logo" className="w-10 h-10 object-contain" />
          </div>
          <div className="flex-1">
            <h1 className="text-[#0f172a] font-bold text-lg leading-tight">DAC System</h1>
            <p className="text-[#64748b] text-xs font-medium">Admin</p>
          </div>
          {/* Close button — only visible on mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden text-[#64748b] hover:text-[#0f172a] transition-colors"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1">

          {/* Main nav items */}
          {mainNavItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive
                  ? 'bg-[#1f3a89]/10 text-[#1f3a89]'
                  : 'text-[#64748b] hover:bg-slate-50 hover:text-[#0f172a]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-[#1f3a89]' : 'text-[#64748b]'}`}>
                    {icon}
                  </span>
                  <span className="text-sm">{label}</span>
                </>
              )}
            </NavLink>
          ))}

          {/* Admin Settings — collapsible */}
          <div>
            <button
              onClick={() => setAdminOpen((v) => !v)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isAdminActive
                ? 'bg-[#1f3a89]/10 text-[#1f3a89]'
                : 'text-[#64748b] hover:bg-slate-50 hover:text-[#0f172a]'
                }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isAdminActive ? 'text-[#1f3a89]' : 'text-[#64748b]'}`}>
                settings
              </span>
              <span className="text-sm flex-1 text-left">Admin Settings</span>
              <span className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${adminOpen ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>

            {/* Sub-menu */}
            <div
              className={`overflow-hidden transition-all duration-200 ${adminOpen ? 'max-h-48 opacity-100 mt-1' : 'max-h-0 opacity-0'
                }`}
            >
              <div className="ml-3 pl-3 border-l-2 border-[#e2e8f0] flex flex-col gap-0.5">
                {adminSubItems.map(({ to, label, icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${isActive
                        ? 'bg-[#1f3a89]/10 text-[#1f3a89] font-semibold'
                        : 'text-[#64748b] hover:bg-slate-50 hover:text-[#0f172a]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className={`material-symbols-outlined text-[17px] ${isActive ? 'text-[#1f3a89]' : 'text-[#94a3b8]'}`}>
                          {icon}
                        </span>
                        {label}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

        </nav>
      </div>

      {/* ── Bottom: User ── */}
      <div className="p-6 border-t border-[#e2e8f0]">
        <div className="flex items-center gap-3">
          {photoURL ? (
            <img
              src={photoURL}
              alt={displayName}
              referrerPolicy="no-referrer"
              className="h-10 w-10 rounded-full border-2 border-white shadow-sm shrink-0 object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-[#1f3a89] flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
          )}

          <div className="flex flex-col overflow-hidden flex-1">
            <p className="text-[#0f172a] text-sm font-semibold truncate">{displayName}</p>
            <p className="text-[#64748b] text-xs truncate">{email}</p>
          </div>

          <button
            onClick={handleLogout}
            className="ml-auto text-[#64748b] hover:text-[#ef4444] transition-colors shrink-0"
            title="Logout"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main exported Sidebar ─────────────────────────────────────────────────────
export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Mobile top bar (hamburger) ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-[#e2e8f0] flex items-center gap-3 px-4 h-14">
        <button
          onClick={() => setMobileOpen(true)}
          className="text-[#64748b] hover:text-[#1f3a89] transition-colors"
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined text-[26px]">menu</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center shrink-0">
            <img src="./logo.png" alt="DAC Logo" className="w-7 h-7 object-contain" />
          </div>
          <span className="text-[#0f172a] font-bold text-base">DAC System</span>
        </div>
      </header>

      {/* ── Desktop fixed sidebar ── */}
      <aside className="hidden md:flex fixed top-0 left-0 w-64 h-screen bg-white border-r border-[#e2e8f0] flex-col z-30">
        <SidebarContent />
      </aside>

      {/* ── Mobile drawer backdrop ── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer panel ── */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-screen w-72 bg-white border-r border-[#e2e8f0] z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </aside>
    </>
  );
}