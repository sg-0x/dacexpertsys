import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../../components/Sidebar';
import NotificationBell from '../../components/NotificationBell';
import PastRecordsTable from '../../components/PastRecordsTable';
import { pageVariants, listVariants, itemVariants } from '../../lib/motion';
import { approveCase, getCaseHistory, getCases, getUsers } from '../../services/api';

const AVATAR_STYLES = [
  { avatarBg: 'bg-indigo-100', avatarText: 'text-indigo-700' },
  { avatarBg: 'bg-pink-100', avatarText: 'text-pink-700' },
  { avatarBg: 'bg-cyan-100', avatarText: 'text-cyan-700' },
  { avatarBg: 'bg-emerald-100', avatarText: 'text-emerald-700' },
  { avatarBg: 'bg-amber-100', avatarText: 'text-amber-700' },
];

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
  if (status === 'Pending Dsw') return 'bg-yellow-400';
  if (status === 'Pending Admin') return 'bg-indigo-400';
  if (status === 'Resolved') return 'bg-emerald-400';
  return 'bg-slate-400';
}

export default function DswDashboard() {
  const navigate = useNavigate();
  const hasLoggedResponseRef = useRef(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending_dsw');
  const [severityFilter, setSeverityFilter] = useState('all');

  const [tableCases, setTableCases] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    forwarded: 0,
    resolved: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingCaseId, setProcessingCaseId] = useState(null);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState('');

  const loadDashboard = async ({ tableStatus = statusFilter, skipLoading = false } = {}) => {
    try {
      if (!skipLoading) setLoading(true);
      setError('');

      const statusParam = tableStatus === 'all' ? undefined : tableStatus;
      const [overviewCases, queueCases, usersResponse] = await Promise.all([
        getCases(),
        getCases(statusParam ? { status: statusParam } : {}),
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
        setHistoryRecords(mappedHistory);
      } catch (historyLoadError) {
        setHistoryError(historyLoadError?.message || 'Failed to fetch history.');
      } finally {
        setHistoryLoading(false);
      }

      if (!hasLoggedResponseRef.current) {
        console.log('DswDashboard API response:', { overviewCases, queueCases, usersResponse });
        hasLoggedResponseRef.current = true;
      }

      const usersById = Object.fromEntries(usersResponse.map((user) => [String(user.id), user]));
      const mappedQueue = queueCases.map((entry, index) => {
        const student = usersById[String(entry.student_id)] ?? {};
        const statusKey = String(entry.status || '').toLowerCase();
        const status = toTitleCase(statusKey) || 'Pending Dsw';
        const severity = toTitleCase(entry.severity) || 'Low';
        const style = AVATAR_STYLES[index % AVATAR_STYLES.length];
        const name = student.name || 'Unknown Student';

        return {
          id: `#${entry.id}`,
          caseId: entry.id,
          name,
          initials: name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
          avatarBg: style.avatarBg,
          avatarText: style.avatarText,
          offense: toTitleCase(entry.offense_type) || 'N/A',
          severity,
          severityClass: severityClass(severity),
          status,
          statusKey,
          statusDot: statusDot(status),
          date: new Date(entry.incident_date ?? entry.created_at).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
        };
      });

      const normalizedOverview = overviewCases.map((entry) => String(entry.status || '').toLowerCase());
      setStats({
        total: overviewCases.length,
        pending: normalizedOverview.filter((value) => value === 'pending_dsw').length,
        forwarded: normalizedOverview.filter((value) => value === 'pending_admin').length,
        resolved: normalizedOverview.filter((value) => value === 'resolved').length,
      });

      setTableCases(mappedQueue);
    } catch (loadError) {
      setError(loadError?.message || 'Failed to fetch DSW dashboard data.');
      setTableCases([]);
      setStats({ total: 0, pending: 0, forwarded: 0, resolved: 0 });
      setHistoryRecords([]);
      setHistoryLoading(false);
    } finally {
      if (!skipLoading) setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard({ tableStatus: statusFilter });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleForward = async (caseId) => {
    try {
      setProcessingCaseId(caseId);
      setError('');
      await approveCase(caseId);
      await loadDashboard({ tableStatus: statusFilter, skipLoading: true });
    } catch (approveError) {
      setError(approveError?.message || 'Failed to forward case to Admin');
    } finally {
      setProcessingCaseId(null);
    }
  };

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tableCases.filter((row) => {
      const matchSearch =
        !query ||
        row.name.toLowerCase().includes(query) ||
        row.id.toLowerCase().includes(query);

      const matchSeverity =
        severityFilter === 'all' ||
        row.severity.toLowerCase() === severityFilter;

      return matchSearch && matchSeverity;
    });
  }, [search, severityFilter, tableCases]);

  return (
    <div className="min-h-screen bg-[#f0f2ff] font-sans antialiased">
      <Sidebar />

      <main className="pt-14 md:pt-0 md:pl-64 flex flex-col min-h-screen">
        <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-20 px-4 md:px-6 py-3 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[18px]">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by token or student name..."
              className="w-full pl-9 pr-4 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/30 placeholder:text-[#94a3b8] text-[#0f172a]"
            />
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell />
          </div>
        </header>

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
              <p className="text-indigo-200 text-sm font-medium mb-1">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">{getGreeting()}, DSW</h1>
              <p className="text-indigo-200 text-sm leading-relaxed mb-5">
                You have <span className="text-white font-semibold">{stats.pending} cases pending review</span>
              </p>
              <button
                type="button"
                onClick={() => setStatusFilter('pending_dsw')}
                className="inline-flex items-center gap-2 bg-white text-[#4f46e5] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-50 transition-colors shadow-md"
              >
                <span className="material-symbols-outlined text-[16px]">rate_review</span>
                Review Pending Cases
              </button>
            </div>
          </motion.div>

          {loading ? <p className="text-[#64748b] text-sm">Loading DSW dashboard...</p> : null}
          {!!error ? <p className="text-sm text-red-600">Error: {error}</p> : null}

          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              {
                label: 'Total Cases Received',
                value: String(stats.total),
                icon: 'folder_shared',
                gradient: 'from-[#4f46e5] to-[#6366f1]',
              },
              {
                label: 'Pending Cases',
                value: String(stats.pending),
                icon: 'pending_actions',
                gradient: 'from-[#f59e0b] to-[#fbbf24]',
              },
              {
                label: 'Forwarded to Admin',
                value: String(stats.forwarded),
                icon: 'forward_to_inbox',
                gradient: 'from-[#8b5cf6] to-[#a78bfa]',
              },
              {
                label: 'Resolved Cases',
                value: String(stats.resolved),
                icon: 'check_circle',
                gradient: 'from-[#10b981] to-[#34d399]',
              },
            ].map((card) => (
              <motion.div
                key={card.label}
                variants={itemVariants}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-5 text-white shadow-lg cursor-default`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[20px]">{card.icon}</span>
                </div>
                <p className="text-white/80 text-xs font-medium mb-1">{card.label}</p>
                <h3 className="text-2xl font-bold tracking-tight">{card.value}</h3>
              </motion.div>
            ))}
          </motion.div>

          <PastRecordsTable
            records={historyRecords}
            loading={historyLoading}
            error={historyError}
            onViewAll={() => navigate('/reports')}
          />

          <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 px-6 py-4 border-b border-[#f1f5f9]">
              <h3 className="text-base font-bold text-[#0f172a]">DSW Case Queue</h3>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs font-medium text-[#334155] bg-[#f8fafc] border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#4f46e5]"
                >
                  <option value="pending_dsw">Pending DSW</option>
                  <option value="pending_admin">Pending Admin</option>
                  <option value="resolved">Resolved</option>
                  <option value="all">All Statuses</option>
                </select>

                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs font-medium text-[#334155] bg-[#f8fafc] border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#4f46e5]"
                >
                  <option value="all">All Severity</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#f1f5f9]">
                    {['Token ID', 'Student Name', 'Offense Type', 'Severity', 'Status', 'Date', 'Actions'].map((heading, index) => (
                      <th
                        key={heading}
                        className={`px-5 py-3 text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider ${index === 6 ? 'text-right' : ''}`}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f8fafc]">
                  {!loading && filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-sm text-[#64748b] text-center">
                        {statusFilter === 'pending_dsw' ? 'No cases pending review' : 'No cases found for selected filters'}
                      </td>
                    </tr>
                  ) : null}

                  {filtered.map((row) => (
                    <tr key={row.id} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs text-[#64748b]">{row.id}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`h-8 w-8 rounded-full ${row.avatarBg} flex items-center justify-center ${row.avatarText} text-[11px] font-bold shrink-0`}>
                            {row.initials}
                          </div>
                          <p className="text-sm font-medium text-[#0f172a]">{row.name}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-[#334155]">{row.offense}</td>
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
                      <td className="px-5 py-3.5 text-sm text-[#64748b]">{row.date}</td>
                      <td className="px-5 py-3.5 text-right">
                        {row.statusKey === 'pending_dsw' ? (
                          <button
                            type="button"
                            onClick={() => handleForward(row.caseId)}
                            disabled={processingCaseId === row.caseId}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#4f46e5] text-white text-xs font-semibold rounded-lg hover:bg-[#4338ca] transition-colors disabled:opacity-60"
                          >
                            <span className="material-symbols-outlined text-[13px]">forward</span>
                            {processingCaseId === row.caseId ? 'Forwarding...' : 'Approve & Forward'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => navigate(`/cases/${row.caseId}`)}
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
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}