import { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

// ─── Data ─────────────────────────────────────────────────────────────────────
const stats = [
  {
    label: 'Total Cases',
    value: '1,248',
    change: '5%',
    trendIcon: 'trending_up',
    trendColor: 'text-emerald-500',
    trendBg: 'bg-emerald-500/10',
    bgIcon: 'folder_shared',
    bgIconColor: 'text-[#1f3a89]',
  },
  {
    label: 'Pending DAC Cases',
    value: '45',
    change: '12%',
    trendIcon: 'trending_flat',
    trendColor: 'text-amber-500',
    trendBg: 'bg-amber-500/10',
    bgIcon: 'pending_actions',
    bgIconColor: 'text-amber-500',
  },
  {
    label: 'High Severity',
    value: '12',
    change: '2%',
    trendIcon: 'trending_up',
    trendColor: 'text-red-500',
    trendBg: 'bg-red-500/10',
    bgIcon: 'gavel',
    bgIconColor: 'text-red-500',
  },
  {
    label: 'Resolved Cases',
    value: '890',
    change: '8%',
    trendIcon: 'trending_up',
    trendColor: 'text-emerald-500',
    trendBg: 'bg-emerald-500/10',
    bgIcon: 'check_circle',
    bgIconColor: 'text-emerald-500',
  },
];

const CASES = [
  {
    id: '#2024-001',
    name: 'John Doe',
    dept: 'Comp Sci',
    initials: 'JD',
    avatarBg: 'bg-indigo-100',
    avatarText: 'text-indigo-700',
    offense: 'Plagiarism',
    severity: 'Critical',
    severityClass: 'bg-red-100 text-red-800',
    statusDot: 'bg-yellow-500',
    status: 'Pending Review',
    action: 'Manage',
    actionClass: 'text-[#1f3a89] hover:text-[#3b5dc9]',
  },
  {
    id: '#2024-002',
    name: 'Jane Smith',
    dept: 'Arts & Humanities',
    initials: 'JS',
    avatarBg: 'bg-pink-100',
    avatarText: 'text-pink-700',
    offense: 'Vandalism',
    severity: 'High',
    severityClass: 'bg-orange-100 text-orange-800',
    statusDot: 'bg-blue-500',
    status: 'Investigation',
    action: 'Manage',
    actionClass: 'text-[#1f3a89] hover:text-[#3b5dc9]',
  },
  {
    id: '#2024-003',
    name: 'Robert Brown',
    dept: 'Engineering',
    initials: 'RB',
    avatarBg: 'bg-emerald-100',
    avatarText: 'text-emerald-700',
    offense: 'Attendance',
    severity: 'Low',
    severityClass: 'bg-slate-100 text-slate-700',
    statusDot: 'bg-green-500',
    status: 'Resolved',
    action: 'View Details',
    actionClass: 'text-[#64748b] hover:text-[#1f3a89]',
  },
  {
    id: '#2024-004',
    name: 'Emily White',
    dept: 'Law',
    initials: 'EW',
    avatarBg: 'bg-cyan-100',
    avatarText: 'text-cyan-700',
    offense: 'Exam Malpractice',
    severity: 'Critical',
    severityClass: 'bg-red-100 text-red-800',
    statusDot: 'bg-purple-500',
    status: 'DAC Review',
    action: 'Manage',
    actionClass: 'text-[#1f3a89] hover:text-[#3b5dc9]',
  },
  {
    id: '#2024-005',
    name: 'Michael Green',
    dept: 'Business',
    initials: 'MG',
    avatarBg: 'bg-amber-100',
    avatarText: 'text-amber-700',
    offense: 'Disruption',
    severity: 'Medium',
    severityClass: 'bg-yellow-100 text-yellow-800',
    statusDot: 'bg-green-500',
    status: 'Resolved',
    action: 'View Details',
    actionClass: 'text-[#64748b] hover:text-[#1f3a89]',
  },
];

export default function Dashboard() {
  const [search, setSearch] = useState('');

  const filtered = CASES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.offense.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#f9f9fb] font-sans antialiased overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#f9f9fb]">

        {/* ── Header ── */}
        <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-[#0f172a] tracking-tight">Overview</h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b] text-[20px]">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cases, students..."
                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#1f3a89]/20 w-64 placeholder:text-[#64748b]/70 text-[#0f172a] transition-shadow outline-none"
              />
            </div>

            {/* Bell */}
            <button className="relative text-[#64748b] hover:text-[#1f3a89] transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-[#ef4444] border border-white" />
            </button>

            {/* New Case */}
            <Link
              to="/register-case"
              className="bg-[#1f3a89] hover:bg-[#3b5dc9] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm shadow-[#1f3a89]/30"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>New Case</span>
            </Link>
          </div>
        </header>

        {/* ── Page Content ── */}
        <div className="p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto w-full">

          {/* ── Stats Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className="flex flex-col gap-1 relative z-10">
                  <span className="text-[#64748b] text-sm font-medium">{s.label}</span>
                  <div className="flex items-end gap-2">
                    <h3 className="text-3xl font-bold text-[#0f172a] tracking-tight">{s.value}</h3>
                    <span className={`${s.trendColor} ${s.trendBg} text-xs font-medium px-1.5 py-0.5 rounded flex items-center mb-1`}>
                      <span className="material-symbols-outlined text-[14px] mr-0.5">{s.trendIcon}</span>
                      {s.change}
                    </span>
                  </div>
                </div>
                {/* Background icon */}
                <div className="absolute right-[-10px] top-[-10px] opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className={`material-symbols-outlined text-[100px] ${s.bgIconColor}`}>{s.bgIcon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Table Section ── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#0f172a]">Recent Disciplinary Cases</h3>
              <div className="flex gap-2">
                <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#64748b] bg-white border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">filter_list</span>
                  Filter
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#64748b] bg-white border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Export
                </button>
              </div>
            </div>

            {/* Table card */}
            <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-[#e2e8f0]">
                      {[
                        { label: 'Token ID', cls: 'w-32 text-left' },
                        { label: 'Student Name', cls: 'text-left' },
                        { label: 'Offense Type', cls: 'text-left' },
                        { label: 'Severity', cls: 'text-left' },
                        { label: 'Status', cls: 'text-left' },
                        { label: 'Actions', cls: 'text-right' },
                      ].map(({ label, cls }) => (
                        <th
                          key={label}
                          className={`px-6 py-4 text-xs font-semibold text-[#64748b] uppercase tracking-wider ${cls}`}
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#e2e8f0] bg-white">
                    {filtered.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">

                        {/* Token ID */}
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm text-[#64748b]">{row.id}</span>
                        </td>

                        {/* Student */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-full ${row.avatarBg} flex items-center justify-center ${row.avatarText} text-xs font-bold shrink-0`}>
                              {row.initials}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-[#0f172a]">{row.name}</div>
                              <div className="text-xs text-[#64748b]">{row.dept}</div>
                            </div>
                          </div>
                        </td>

                        {/* Offense */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-[#0f172a]">{row.offense}</span>
                        </td>

                        {/* Severity */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.severityClass}`}>
                            {row.severity}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`h-1.5 w-1.5 rounded-full ${row.statusDot}`} />
                            <span className="text-sm text-[#0f172a]">{row.status}</span>
                          </div>
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 text-right">
                          <button className={`font-medium text-sm transition-colors ${row.actionClass}`}>
                            {row.action}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-[#e2e8f0]">
                <div className="text-sm text-[#64748b]">
                  Showing{' '}
                  <span className="font-medium text-[#0f172a]">1</span>
                  {' '}to{' '}
                  <span className="font-medium text-[#0f172a]">5</span>
                  {' '}of{' '}
                  <span className="font-medium text-[#0f172a]">1,248</span>
                  {' '}results
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm border border-[#e2e8f0] rounded-md bg-white text-[#64748b] hover:bg-slate-50 disabled:opacity-50 transition-colors">
                    Previous
                  </button>
                  <button className="px-3 py-1 text-sm border border-[#e2e8f0] rounded-md bg-white text-[#64748b] hover:bg-slate-50 transition-colors">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}