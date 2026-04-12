import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const subNav = [
  { to: '/admin-settings/rules-weights', label: 'Rules & Weights', icon: 'balance' },
  { to: '/admin-settings/users', label: 'User Management', icon: 'manage_accounts' },
  { to: '/admin-settings/system', label: 'System Config', icon: 'tune' },
];

export default function AdminSettings() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#f9f9fb] font-sans antialiased">
      <Sidebar />

      <main className="pt-14 md:pt-0 md:pl-64 flex flex-col min-h-screen overflow-y-auto">

        {/* Header */}
        <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-20 px-4 md:px-8 py-4">
          <h2 className="text-xl font-semibold text-[#0f172a] tracking-tight">Admin Settings</h2>
          <p className="text-sm text-[#64748b] mt-0.5">Manage system rules, users, and configuration.</p>
        </header>

        {/* Sub-nav tabs */}
        {/* <div className="bg-white border-b border-[#e2e8f0] px-4 md:px-8 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {subNav.map(({ to, label, icon }) => {
              const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
              return (
                <NavLink
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${isActive
                    ? 'border-[#4f46e5] text-[#4f46e5]'
                    : 'border-transparent text-[#64748b] hover:text-[#0f172a] hover:border-[#e2e8f0]'
                    }`}
                >
                  <span className={`material-symbols-outlined text-[18px] ${isActive ? 'text-[#4f46e5]' : 'text-[#94a3b8]'}`}>
                    {icon}
                  </span>
                  {label}
                </NavLink>
              );
            })}
          </div>
        </div> */}

        {/* Page content from child route */}
        <div className="flex-1 p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
