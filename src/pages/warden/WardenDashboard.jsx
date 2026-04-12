import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import WardenSidebar from '../../components/WardenSidebar';
import { pageVariants, listVariants, itemVariants } from '../../lib/motion';

// ─── Data ─────────────────────────────────────────────────────────────────────
const STAT_CARDS = [
  {
    label: 'Total Cases',
    value: '156',
    icon: 'folder_shared',
    gradient: 'from-[#4f46e5] to-[#6366f1]',
    iconBg: 'bg-white/20',
  },
  {
    label: 'Active Cases',
    value: '23',
    icon: 'pending_actions',
    gradient: 'from-[#f59e0b] to-[#fbbf24]',
    iconBg: 'bg-white/20',
  },
  {
    label: 'Escalated Cases',
    value: '8',
    icon: 'gavel',
    gradient: 'from-[#ef4444] to-[#f87171]',
    iconBg: 'bg-white/20',
  },
  {
    label: 'Resolved Cases',
    value: '125',
    icon: 'check_circle',
    gradient: 'from-[#10b981] to-[#34d399]',
    iconBg: 'bg-white/20',
  },
];

const RECENT_CASES = [
  {
    id: 'WRD-2024-001',
    name: 'Rahul Kumar',
    dept: 'Mechanical Engg',
    initials: 'RK',
    avatarBg: 'bg-indigo-100',
    avatarText: 'text-indigo-700',
    offense: 'Noise Complaint',
    severity: 'Low',
    severityClass: 'bg-slate-100 text-slate-600',
    statusDot: 'bg-yellow-400',
    status: 'Investigation',
    action: 'Manage',
  },
  {
    id: 'WRD-2024-002',
    name: 'Priya Sharma',
    dept: 'Computer Science',
    initials: 'PS',
    avatarBg: 'bg-pink-100',
    avatarText: 'text-pink-700',
    offense: 'Late Night Entry',
    severity: 'Medium',
    severityClass: 'bg-yellow-100 text-yellow-700',
    statusDot: 'bg-blue-400',
    status: 'Escalated to Chief Warden',
    action: 'View',
  },
  {
    id: 'WRD-2024-003',
    name: 'Amit Patel',
    dept: 'Electrical Engg',
    initials: 'AP',
    avatarBg: 'bg-emerald-100',
    avatarText: 'text-emerald-700',
    offense: 'Room Damage',
    severity: 'High',
    severityClass: 'bg-orange-100 text-orange-700',
    statusDot: 'bg-emerald-400',
    status: 'Resolved (Warning)',
    action: 'View',
  },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function WardenDashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);

  const filtered = RECENT_CASES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.offense.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
  );

  const selected = selectedCase ? RECENT_CASES.find((c) => c.id === selectedCase) : null;

  return (
    <div className="min-h-screen bg-[#f0f2ff] font-sans antialiased">
      <WardenSidebar />

      <main className="pt-14 md:pt-0 md:pl-64 flex flex-col min-h-screen">

        {/* ── Top Header ── */}
        <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-20 px-4 md:px-6 py-3 flex items-center justify-between gap-4">
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
            <Link
              to="/warden/register"
              className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Register Case
            </Link>
          </div>
        </header>

        {/* ── Page Body ── */}
        <div className="flex flex-1 overflow-hidden">
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
              <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
              <div className="absolute right-20 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/3" />

              <div className="relative z-10 max-w-lg">
                <p className="text-indigo-200 text-sm font-medium mb-1">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">{getGreeting()}, Warden</h1>
                <p className="text-indigo-200 text-sm leading-relaxed mb-5">
                  You have <span className="text-white font-semibold">23 active cases</span> and <span className="text-white font-semibold">8 escalated cases</span> requiring attention.
                </p>
                <Link
                  to="/warden/register"
                  className="inline-flex items-center gap-2 bg-white text-[#4f46e5] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-50 transition-colors shadow-md"
                >
                  <span className="material-symbols-outlined text-[16px]">add_circle</span>
                  Register New Case
                </Link>
              </div>
            </motion.div>

            {/* ── Stats Grid ── */}
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {STAT_CARDS.map((s) => (
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
                <h3 className="text-base font-bold text-[#0f172a]">Recent Cases</h3>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#64748b] bg-[#f8fafc] border border-[#e2e8f0] rounded-lg hover:bg-slate-100 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">filter_list</span> Filter
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
                          <button
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              navigate(row.action === 'Manage' ? `/warden/cases/${row.id}` : `/warden/cases/${row.id}`); 
                            }}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                              row.action === 'Manage' 
                                ? 'bg-[#4f46e5] text-white hover:bg-[#4338ca]' 
                                : 'bg-[#f1f5f9] text-[#64748b] hover:bg-slate-200'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[13px]">{row.action === 'Manage' ? 'open_in_new' : 'visibility'}</span>
                            {row.action}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between px-6 py-3.5 bg-[#f8fafc] border-t border-[#f1f5f9]">
                <p className="text-xs text-[#94a3b8]">Showing <span className="font-semibold text-[#334155]">1–3</span> of <span className="font-semibold text-[#334155]">156</span> results</p>
                <div className="flex gap-1.5">
                  <button className="px-3 py-1.5 text-xs border border-[#e2e8f0] rounded-lg bg-white text-[#64748b] hover:bg-slate-50 disabled:opacity-50 transition-colors">Previous</button>
                  <button className="px-3 py-1.5 text-xs border border-[#e2e8f0] rounded-lg bg-white text-[#64748b] hover:bg-slate-50 transition-colors">Next</button>
                </div>
              </div>
            </motion.div>

          </motion.div>

          {/* ── Right Panel ── */}
          <AnimatePresence mode="wait">
            {selected && (
              <motion.aside
                key="case-detail"
                initial={{ x: 320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 320, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="hidden xl:flex w-80 shrink-0 border-l border-[#e2e8f0] bg-white flex-col overflow-y-auto"
              >
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${selected.severityClass}`}>
                      {selected.severity}
                    </span>
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100">
                      <span className={`h-1.5 w-1.5 rounded-full ${selected.statusDot}`} />
                      <span className="text-xs font-medium text-[#334155]">{selected.status}</span>
                    </div>
                  </div>

                  <div className="bg-[#f8fafc] rounded-xl p-4 flex flex-col gap-3">
                    {[
                      { label: 'Department', value: selected.dept },
                      { label: 'Offense', value: selected.offense },
                      { label: 'Status', value: selected.status },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-center">
                        <span className="text-xs text-[#94a3b8] font-medium">{label}</span>
                        <span className="text-xs font-semibold text-[#334155]">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      onClick={() => navigate(`/warden/cases/${selected.id}`)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4f46e5] text-white text-sm font-semibold rounded-xl hover:bg-[#4338ca] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                      {selected.action === 'Manage' ? 'Manage Case' : 'View Details'}
                    </button>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}
