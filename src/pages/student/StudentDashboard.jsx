import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSummaryCards from '../../components/student/StudentSummaryCards';
import StudentCasesTable from '../../components/student/StudentCasesTable';
import PastRecordsTable from '../../components/PastRecordsTable';
import { getCaseHistory, getCases } from '../../services/api';

const PENALTY_THRESHOLDS = {
  warning: 25,
  placementBan: 50,
  expulsion: 75,
};

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

export default function StudentDashboard() {
  const navigate = useNavigate();
  const hasLoggedResponseRef = useRef(false);
  const [cases, setCases] = useState([]);
  const [summary, setSummary] = useState({
    totalCases: 0,
    activeCases: 0,
    resolvedCases: 0,
    totalPenaltyPoints: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [historyRecords, setHistoryRecords] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError('');
        const casesResponse = await getCases();

        if (!hasLoggedResponseRef.current) {
          console.log('StudentDashboard API response:', { cases: casesResponse });
          hasLoggedResponseRef.current = true;
        }

        const mappedCases = casesResponse.map((entry) => {
          const status = toTitleCase(entry.status);
          const severity = toTitleCase(entry.severity);
          return {
            token: String(entry.id),
            offenseType: toTitleCase(entry.offense_type) || 'N/A',
            severity,
            severityClass: severity === 'Critical' ? 'bg-red-100 text-red-700' : severity === 'High' ? 'bg-orange-100 text-orange-700' : severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600',
            status,
            statusDot: status === 'Resolved' ? 'bg-emerald-500' : status === 'Dac Review' ? 'bg-purple-500' : status === 'Investigation' ? 'bg-blue-500' : 'bg-yellow-500',
            dateReported: formatDate(entry.incident_date ?? entry.created_at),
          };
        });

        const totalCases = casesResponse.length;
        const activeCases = casesResponse.filter((entry) => String(entry.status || '').toLowerCase() !== 'resolved').length;
        const resolvedCases = casesResponse.filter((entry) => String(entry.status || '').toLowerCase() === 'resolved').length;
        const totalPenaltyPoints = casesResponse.reduce((sum, entry) => sum + Number(entry.penalty_points || 0), 0);

        const activity = mappedCases
          .slice(0, 5)
          .map((entry) => `Case #${entry.token}: ${entry.offenseType} (${entry.status})`);

        if (mounted) {
          setCases(mappedCases);
          setSummary({ totalCases, activeCases, resolvedCases, totalPenaltyPoints });
          setRecentActivity(activity);
        }

        setHistoryLoading(true);
        setHistoryError('');
        try {
          const historyResponse = await getCaseHistory(6);
          const mappedHistory = historyResponse.map((entry) => ({
            id: entry.id,
            token: `#${entry.id}`,
            studentName: entry.student_name || 'You',
            offense: toTitleCase(entry.offense_type) || 'N/A',
            status: toTitleCase(entry.status) || 'N/A',
            date: formatDate(entry.incident_date ?? entry.created_at),
          }));
          if (mounted) setHistoryRecords(mappedHistory);
        } catch (historyLoadError) {
          if (mounted) setHistoryError(historyLoadError?.message || 'Failed to fetch history.');
        } finally {
          if (mounted) setHistoryLoading(false);
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError?.message || 'Failed to fetch student data.');
          setCases([]);
          setRecentActivity([]);
          setSummary({ totalCases: 0, activeCases: 0, resolvedCases: 0, totalPenaltyPoints: 0 });
          setHistoryRecords([]);
          setHistoryLoading(false);
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

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-[#0f172a]">Summary</h3>
        {loading && <p className="text-[#64748b] text-sm">Loading...</p>}
        {!!error && <p className="text-sm text-red-600">Error: {error}</p>}
        <StudentSummaryCards summary={summary} />
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-[#0f172a]">My Cases</h3>
        <StudentCasesTable
          cases={cases}
          onViewCase={(token) => navigate(`/student/cases/${token}`)}
        />
      </section>

      <section className="space-y-4">
        <PastRecordsTable
          records={historyRecords}
          loading={historyLoading}
          error={historyError}
          onViewAll={() => navigate('/student/cases')}
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-[#0f172a]">Penalty Points Summary</h3>
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4f46e5] text-[18px]">policy</span>
            <h3 className="font-semibold text-[#0f172a] text-sm">Threshold Details</h3>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-lg border border-[#e2e8f0] p-4">
              <p className="text-[#94a3b8] text-xs font-medium uppercase tracking-wide mb-1">Total Penalty Points</p>
              <p className="text-[#0f172a] text-2xl font-bold leading-none">{summary.totalPenaltyPoints}</p>
            </div>
            <div className="bg-slate-50 rounded-lg border border-[#e2e8f0] p-4">
              <p className="text-[#94a3b8] text-xs font-medium uppercase tracking-wide mb-1">Warning Threshold</p>
              <p className="text-[#0f172a] text-2xl font-bold leading-none">{PENALTY_THRESHOLDS.warning}</p>
            </div>
            <div className="bg-slate-50 rounded-lg border border-[#e2e8f0] p-4">
              <p className="text-[#94a3b8] text-xs font-medium uppercase tracking-wide mb-1">Placement Ban Threshold</p>
              <p className="text-[#0f172a] text-2xl font-bold leading-none">{PENALTY_THRESHOLDS.placementBan}</p>
            </div>
            <div className="bg-slate-50 rounded-lg border border-[#e2e8f0] p-4">
              <p className="text-[#94a3b8] text-xs font-medium uppercase tracking-wide mb-1">Expulsion Threshold</p>
              <p className="text-[#0f172a] text-2xl font-bold leading-none">{PENALTY_THRESHOLDS.expulsion}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-[#0f172a]">Recent Activity</h3>
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4f46e5] text-[18px]">history</span>
            <h3 className="font-semibold text-[#0f172a] text-sm">Case Updates</h3>
          </div>
          <div className="p-6">
            <ul className="flex flex-col gap-3">
              {recentActivity.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#334155]">
                  <span className="h-1.5 w-1.5 mt-2 rounded-full bg-[#4f46e5] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
