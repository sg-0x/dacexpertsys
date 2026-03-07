import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const adminSubItems = [
  { to: '/admin-settings/rules-weights', label: 'Rules & Weights',  icon: 'balance'       },
  { to: '/admin-settings/users',         label: 'User Management',  icon: 'manage_accounts' },
  { to: '/admin-settings/system',        label: 'System Config',    icon: 'tune'           },
];

const mainNavItems = [
  { to: '/dashboard',     label: 'Dashboard',     icon: 'dashboard'    },
  { to: '/register-case', label: 'Register Case', icon: 'edit_document' },
  { to: '/reports',       label: 'Reports',       icon: 'bar_chart'    },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const isAdminActive = location.pathname.startsWith('/admin-settings');
  const [adminOpen, setAdminOpen] = useState(isAdminActive);

  // Derive display values from the logged-in Google user
  const displayName = currentUser?.displayName || currentUser?.email || 'User';
  const photoURL    = currentUser?.photoURL || null;
  const email       = currentUser?.email || '';
  // Initials fallback: take first letter of each word in the display name
  const initials    = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside className="w-64 bg-white border-r border-[#e2e8f0] flex flex-col justify-between h-screen shrink-0">

      {/* ── Top: Logo + Nav ── */}
      <div className="p-6 overflow-y-auto flex-1">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-[#1f3a89]/10 rounded-lg p-2 flex items-center justify-center text-[#1f3a89]">
            <span className="material-symbols-outlined text-3xl">local_police</span>
          </div>
          <div>
            <h1 className="text-[#0f172a] font-bold text-lg leading-tight">DAC System</h1>
            <p className="text-[#64748b] text-xs font-medium">University Admin</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1">

          {/* Main nav items */}
          {mainNavItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                isAdminActive
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
              className={`overflow-hidden transition-all duration-200 ${
                adminOpen ? 'max-h-48 opacity-100 mt-1' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="ml-3 pl-3 border-l-2 border-[#e2e8f0] flex flex-col gap-0.5">
                {adminSubItems.map(({ to, label, icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
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
          {/* Avatar: real photo or initials fallback */}
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
    </aside>
  );
}