import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ChiefWardenSidebar from '../../components/ChiefWardenSidebar';
import NotificationBell from '../../components/NotificationBell';
import PastRecordsTable from '../../components/PastRecordsTable';
import { pageVariants, listVariants, itemVariants } from '../../lib/motion';
import { approveCase, getCaseHistory, getCases, getUsers } from '../../services/api';

const AVATAR_STYLES = [
  { avatarBg: 'bg-pink-100', avatarText: 'text-pink-700' },
  { avatarBg: 'bg-indigo-100', avatarText: 'text-indigo-700' },
  { avatarBg: 'bg-emerald-100', avatarText: 'text-emerald-700' },
  { avatarBg: 'bg-cyan-100', avatarText: 'text-cyan-700' },
];

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

function statusMeta(status) {
  if (status === 'Resolved') return { label: 'Resolved', dot: 'bg-emerald-400', action: 'View' };
  if (status === 'Dac Review') return { label: 'Escalated to Chief Warden', dot: 'bg-blue-400', action: 'Review' };
  return { label: status || 'Pending Review', dot: 'bg-purple-400', action: 'Review' };
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function ChiefWardenDashboard() {
  const navigate = useNavigate();
  const hasLoggedResponseRef = useRef(false);
  const [search, setSearch] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [cases, setCases] = useState([]);
  const [statCards, setStatCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [historyRecords, setHistoryRecords] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState('');

  const loadData = async (mounted = true) => {
    try {
      setLoading(true);
      setError('');

      const [casesResponse, usersResponse] = await Promise.all([
        getCases({ role: 'chief_warden', status: 'pending_chief' }),
        getUsers(),
      ]);

      setHistoryLoading(true);
      setHistoryError('');
      try {
        const historyResponse = await getCaseHistory(6);
        const mappedHistory = historyResponse.map((entry) => ({
          id: entry.id,
          token: `#${entry.id}`,
          studentName: entry.student_name || 'Unknown Student',
          offense: toTitleCase(entry.offense_type) || 'N/A',
          status: toTitleCase(entry.status) || 'N/A',
          date: new Date(entry.incident_date ?? entry.created_at).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
        }));
        if (mounted) setHistoryRecords(mappedHistory);
      } catch (historyLoadError) {
        if (mounted) setHistoryError(historyLoadError?.message || 'Failed to fetch history.');
      } finally {
        if (mounted) setHistoryLoading(false);
      }

      if (!hasLoggedResponseRef.current) {
        console.log('ChiefWardenDashboard API response:', { cases: casesResponse, users: usersResponse });
        hasLoggedResponseRef.current = true;
      }

      const usersById = Object.fromEntries(usersResponse.map((user) => [String(user.id), user]));
      const mappedCases = casesResponse.map((entry, index) => {
        const student = usersById[String(entry.student_id)] ?? {};
        const status = toTitleCase(entry.status);
        const meta = statusMeta(status);
        const severity = toTitleCase(entry.severity) || 'Low';
        const name = student.name || 'Unknown Student';
        const style = AVATAR_STYLES[index % AVATAR_STYLES.length];
        return {
          id: String(entry.id),
          caseId: entry.id,
          name,
          dept: student.program ? toTitleCase(student.program) : 'N/A',
          initials: name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
          avatarBg: style.avatarBg,
          avatarText: style.avatarText,
          offense: toTitleCase(entry.offense_type) || 'N/A',
          severity,
          severityClass: severityClass(severity),
          statusDot: meta.dot,
          status: meta.label,
          action: meta.action,
          date: new Date(entry.incident_date ?? entry.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        };
      });

      const total = mappedCases.length;
      const pending = mappedCases.length;
      const escalatedDsw = 0;
      const resolved = 0;

      const cards = [
        { label: 'Total Received Cases', value: String(total), icon: 'folder_shared', gradient: 'from-[#4f46e5] to-[#6366f1]', iconBg: 'bg-white/20' },
        { label: 'Pending Review', value: String(pending), icon: 'pending_actions', gradient: 'from-[#f59e0b] to-[#fbbf24]', iconBg: 'bg-white/20' },
        { label: 'Escalated to DSW', value: String(escalatedDsw), icon: 'gavel', gradient: 'from-[#8b5cf6] to-[#a78bfa]', iconBg: 'bg-white/20' },
        { label: 'Resolved Cases', value: String(resolved), icon: 'check_circle', gradient: 'from-[#10b981] to-[#34d399]', iconBg: 'bg-white/20' },
      ];

      if (mounted) {
        setCases(mappedCases);
        setStatCards(cards);
      }
    } catch (loadError) {
      if (mounted) {
        setError(loadError?.message || 'Failed to fetch dashboard data.');
        setCases([]);
        setStatCards([]);
        setHistoryRecords([]);
        setHistoryLoading(false);
      }
    } finally {
      if (mounted) setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    loadData(mounted);
    return () => {
      mounted = false;
    };
  }, []);

  const onApprove = async (caseId) => {
    try {
      await approveCase(caseId);
      await loadData(true);
    } catch (approveError) {
      setError(approveError?.message || 'Failed to approve case');
    }
  };

  const filtered = cases.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.offense.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
  );

  const selected = selectedCase ? cases.find((c) => c.id === selectedCase) : null;

  return (
    <div className="min-h-screen bg-[#f0f2ff] font-sans antialiased">
      <ChiefWardenSidebar />

      <main className="pt-14 md:pt-0 md:pl-64 flex flex-col min-h-screen">

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
              to="/chief-warden/cases"
              className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">inbox</span>
              Incoming Cases
            </Link>
            <NotificationBell />
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6"
          >

            <motion.div
              variants={itemVariants}
              className="relative bg-gradient-to-r from-[#4f46e5] via-[#5b52e8] to-[#6366f1] rounded-2xl p-6 md:p-8 overflow-hidden text-white"
            >
              <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
              <div className="absolute right-20 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/3" />

              <div className="relative z-10 max-w-lg">
                <p className="text-indigo-200 text-sm font-medium mb-1">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">{getGreeting()}, Chief Warden</h1>
                <p className="text-indigo-200 text-sm leading-relaxed mb-5">
                  You have <span className="text-white font-semibold">{statCards[1]?.value ?? '0'} new cases pending review</span>. <Link to="/chief-warden/cases" className="underline font-semibold">Click to review</Link>
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/chief-warden/cases"
                    className="inline-flex items-center gap-2 bg-white text-[#4f46e5] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-50 transition-colors shadow-md"
                  >
                    <span className="material-symbols-outlined text-[16px]">inbox</span>
                    Review Incoming Cases
                  </Link>
                </div>
              </div>
            </motion.div>

            {loading && <p className="text-[#64748b] text-sm">Loading...</p>}
            {!!error && <p className="text-sm text-red-600">Error: {error}</p>}

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

            <PastRecordsTable
              records={historyRecords}
              loading={historyLoading}
              error={historyError}
              onViewAll={() => navigate('/chief-warden/cases')}
            />

            <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f5f9]">
                <h3 className="text-base font-bold text-[#0f172a]">Recent Incoming Cases</h3>
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
                      {['Token ID', 'Student Name', 'Offense Type', 'Severity', 'Status', 'Date', 'Actions'].map((h, i) => (
                        <th key={h} className={`px-5 py-3 text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider ${i === 6 ? 'text-right' : ''}`}>{h}</th>
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
                        <td className="px-5 py-3.5">
                          <span className="text-sm text-[#64748b]">{row.date}</span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              onApprove(row.caseId);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors bg-[#4f46e5] text-white hover:bg-[#4338ca]"
                          >
                            <span className="material-symbols-outlined text-[13px]">check_circle</span>
                            Approve
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between px-6 py-3.5 bg-[#f8fafc] border-t border-[#f1f5f9]">
                <p className="text-xs text-[#94a3b8]">Showing <span className="font-semibold text-[#334155]">1–{filtered.length}</span> of <span className="font-semibold text-[#334155]">{cases.length}</span> results</p>
                <div className="flex gap-1.5">
                  <button className="px-3 py-1.5 text-xs border border-[#e2e8f0] rounded-lg bg-white text-[#64748b] hover:bg-slate-50 disabled:opacity-50 transition-colors">Previous</button>
                  <button className="px-3 py-1.5 text-xs border border-[#e2e8f0] rounded-lg bg-white text-[#64748b] hover:bg-slate-50 transition-colors">Next</button>
                </div>
              </div>
            </motion.div>

          </motion.div>

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
                      onClick={() => navigate(`/chief-warden/cases/${selected.id}`)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4f46e5] text-white text-sm font-semibold rounded-xl hover:bg-[#4338ca] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">rate_review</span>
                      {selected.action === 'Review' ? 'Review Case' : 'View Details'}
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
