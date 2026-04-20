import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ChiefWardenSidebar from '../../components/ChiefWardenSidebar';
import { pageVariants, itemVariants } from '../../lib/motion';
import { getCases, getUsers } from '../../services/api';

function toTitleCase(value = '') {
  return String(value)
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value) {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function severityClass(severity) {
  if (severity === 'Critical') return 'bg-red-100 text-red-700';
  if (severity === 'High') return 'bg-orange-100 text-orange-700';
  if (severity === 'Medium') return 'bg-yellow-100 text-yellow-700';
  return 'bg-slate-100 text-slate-600';
}

export default function IncomingCases() {
  const navigate = useNavigate();
  const hasLoggedResponseRef = useRef(false);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError('');

        const [casesResponse, usersResponse] = await Promise.all([getCases(), getUsers()]);

        if (!hasLoggedResponseRef.current) {
          console.log('Chief Warden IncomingCases API response:', { cases: casesResponse, users: usersResponse });
          hasLoggedResponseRef.current = true;
        }

        const usersById = Object.fromEntries(usersResponse.map((user) => [String(user.id), user]));
        const mapped = casesResponse
          .filter((entry) => String(entry.status || '').toLowerCase() === 'dac_review')
          .map((entry) => {
            const student = usersById[String(entry.student_id)] ?? {};
            const severity = toTitleCase(entry.severity);
            return {
              id: String(entry.id),
              studentName: student.name || 'Unknown Student',
              offense: toTitleCase(entry.offense_type) || 'N/A',
              severity,
              severityClass: severityClass(severity),
              status: 'Escalated to Chief Warden',
              statusDot: 'bg-blue-400',
              date: formatDate(entry.incident_date ?? entry.created_at),
            };
          });

        if (mounted) setCases(mapped);
      } catch (loadError) {
        if (mounted) {
          setError(loadError?.message || 'Failed to fetch incoming cases.');
          setCases([]);
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

  const filtered = cases.filter((c) => {
    const matchesSearch =
      c.studentName.toLowerCase().includes(search.toLowerCase()) ||
      c.offense.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = severityFilter === 'All' || c.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const severityOptions = ['All', 'Critical', 'High', 'Medium', 'Low'];

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
        </header>

        <motion.div
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 p-4 md:p-6 space-y-6"
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-[#0f172a] text-2xl md:text-3xl font-bold tracking-tight">Incoming Cases</h1>
            <p className="text-[#64748b] text-sm">Review cases escalated by Wardens requiring your decision.</p>
            {loading && <p className="text-[#64748b] text-sm">Loading...</p>}
            {!!error && <p className="text-sm text-red-600">Error: {error}</p>}
          </div>

          <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f5f9]">
              <h3 className="text-base font-bold text-[#0f172a]">Pending Review</h3>
              <div className="flex gap-2">
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs font-medium text-[#64748b] bg-[#f8fafc] border border-[#e2e8f0] rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {severityOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt === 'All' ? 'All Severity' : opt}</option>
                  ))}
                </select>
                <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#64748b] bg-[#f8fafc] border border-[#e2e8f0] rounded-lg hover:bg-slate-100 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">download</span> Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#f1f5f9]">
                    {['Token ID', 'Student Name', 'Offense', 'Severity', 'Status', 'Date', 'Action'].map((h, i) => (
                      <th key={h} className={`px-5 py-3 text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider ${i === 6 ? 'text-right' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f8fafc]">
                  {filtered.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-[#f8fafc] transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs text-[#64748b]">{row.id}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-medium text-[#0f172a]">{row.studentName}</span>
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
                          onClick={() => navigate(`/chief-warden/cases/${row.id}`)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#4f46e5] text-white text-xs font-semibold rounded-lg hover:bg-[#4338ca] transition-colors"
                        >
                          <span className="material-symbols-outlined text-[13px]">rate_review</span>
                          Review
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
      </main>
    </div>
  );
}
