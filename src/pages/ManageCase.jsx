import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import StudentDetailsCard from '../components/StudentDetailsCard';
import PreviousOffencesTable from '../components/PreviousOffencesTable';
import IncidentDetailsCard from '../components/IncidentDetailsCard';
import EvidenceCard from '../components/EvidenceCard';
import TimelineCard from '../components/TimelineCard';
import { pageVariants, listVariants, itemVariants } from '../lib/motion';
import { getCases, getUsers } from '../services/api';

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

function formatTime(value) {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function buildTimeline(status) {
  const normalized = String(status || '').toLowerCase();
  return [
    { title: 'Case Reported', date: null, state: 'completed', note: 'Case has been registered in the system.' },
    { title: 'Investigation Started', date: null, state: ['investigation', 'dac_review', 'resolved'].includes(normalized) ? 'completed' : 'upcoming', note: null },
    { title: 'DAC Review', date: null, state: ['dac_review', 'resolved'].includes(normalized) ? 'completed' : 'upcoming', note: null },
    { title: 'Decision Issued', date: null, state: normalized === 'resolved' ? 'completed' : 'upcoming', note: null },
    { title: 'Resolved', date: null, state: normalized === 'resolved' ? 'completed' : 'upcoming', note: null },
  ];
}

// ─── Fallback for unknown tokens ───────────────────────────────────────────────
function NotFound({ token, onBack }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <span className="material-symbols-outlined text-[60px] text-[#cbd5e1]">search_off</span>
      <p className="text-[#0f172a] text-lg font-semibold">Case not found</p>
      <p className="text-[#64748b] text-sm">No case with token <span className="font-mono font-semibold">#{token}</span> exists.</p>
      <button
        onClick={onBack}
        className="mt-2 flex items-center gap-2 bg-[#4f46e5] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#162d6b] transition-colors shadow-sm"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        Back to Dashboard
      </button>
    </div>
  );
}

// ─── Status & severity badge helpers ─────────────────────────────────────────
const statusDotMap = {
  'Pending Review': 'bg-yellow-500',
  Pending:          'bg-yellow-500',
  'Investigation':  'bg-blue-500',
  'DAC Review':     'bg-purple-500',
  'Resolved':       'bg-green-500',
  'Dismissed':      'bg-slate-400',
  Warning:          'bg-amber-500',
};

const severityClassMap = {
  Critical: 'bg-red-100 text-red-800',
  High: 'bg-orange-100 text-orange-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Low: 'bg-slate-100 text-slate-700',
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ManageCase() {
  const { token } = useParams();
  const navigate = useNavigate();
  const hasLoggedResponseRef = useRef(false);
  const [caseData, setCaseData] = useState(null);
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
          console.log('ManageCase API response:', { cases: casesResponse, users: usersResponse });
          hasLoggedResponseRef.current = true;
        }

        const matched = casesResponse.find((entry) => String(entry.id) === String(token));
        if (!matched) {
          if (mounted) setCaseData(null);
          return;
        }

        const usersById = Object.fromEntries(usersResponse.map((user) => [String(user.id), user]));
        const student = usersById[String(matched.student_id)] ?? {};
        const reporter = usersById[String(matched.reported_by)] ?? null;

        const previousOffences = casesResponse
          .filter((entry) => entry.student_id === matched.student_id && entry.id !== matched.id)
          .map((entry) => ({
            date: formatDate(entry.incident_date ?? entry.created_at),
            offenseType: toTitleCase(entry.offense_type) || 'N/A',
            severity: toTitleCase(entry.severity) || 'Low',
            penaltyPoints: entry.penalty_points ?? 0,
            status: toTitleCase(entry.status) || 'Pending',
          }));

        const status = toTitleCase(matched.status) || 'Pending';
        const severity = toTitleCase(matched.severity) || 'Low';

        const mapped = {
          token: `#${matched.id}`,
          status,
          severity,
          severityClass: severityClassMap[severity] ?? 'bg-slate-100 text-slate-700',
          student: {
            name: student.name || 'Unknown Student',
            enrollment: student.enrollment_no || `ID-${matched.student_id}`,
            year: student.year ? `${student.year} Year` : 'N/A',
            department: student.program ? toTitleCase(student.program) : 'N/A',
            email: student.email || 'N/A',
            contact: student.contact || 'N/A',
            hostel: student.hostel || 'N/A',
            room: student.room || 'N/A',
            penaltyPoints: student.total_points ?? matched.penalty_points ?? 0,
          },
          previousOffences,
          incident: {
            token: `#${matched.id}`,
            date: formatDate(matched.incident_date ?? matched.created_at),
            time: formatTime(matched.created_at),
            location: matched.location || 'N/A',
            offenseType: toTitleCase(matched.offense_type) || 'N/A',
            reportedBy: reporter?.name || (matched.reported_by ? `User #${matched.reported_by}` : 'System'),
            description: matched.description || 'No description available.',
          },
          evidence: [],
          timeline: buildTimeline(matched.status),
        };

        if (mounted) setCaseData(mapped);
      } catch (loadError) {
        if (mounted) {
          setError(loadError?.message || 'Failed to fetch case details.');
          setCaseData(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <div className="min-h-screen bg-[#f9f9fb] font-sans antialiased">
      <Sidebar />

      <main className="pt-14 md:pt-0 md:pl-64 flex flex-col min-h-screen bg-[#f9f9fb]">

        {/* ── Header ── */}
        <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-20 px-4 md:px-6 py-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Back button */}
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 text-[#64748b] hover:text-[#4f46e5] transition-colors text-sm font-medium"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            <span className="text-[#e2e8f0] text-lg hidden sm:block">/</span>

            {/* Token */}
            <span className="font-mono text-sm font-semibold text-[#64748b]">
              {caseData ? caseData.token : `#${token}`}
            </span>

            {caseData && (
              <>
                <span className="text-[#e2e8f0] text-lg hidden sm:block">/</span>

                {/* Student name */}
                <h2 className="text-[#0f172a] text-base font-semibold tracking-tight">
                  {caseData.student.name}
                </h2>

                {/* Status badge */}
                <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                  <span className={`h-2 w-2 rounded-full ${statusDotMap[caseData.status] ?? 'bg-slate-400'}`} />
                  <span className="text-sm text-[#0f172a]">{caseData.status}</span>
                </div>

                {/* Severity badge */}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${caseData.severityClass}`}>
                  {caseData.severity}
                </span>
              </>
            )}
          </div>
        </header>

        {/* ── Page body ── */}
        <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full">
          {loading ? (
            <p className="text-[#64748b] text-sm">Loading...</p>
          ) : error ? (
            <p className="text-sm text-red-600">Error: {error}</p>
          ) : !caseData ? (
            <NotFound token={token} onBack={() => navigate('/dashboard')} />
          ) : (
            <motion.div
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-6"
            >
              {/* ── Two-column layout ── */}
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col xl:flex-row gap-6 items-start"
              >
                {/* ── Left column ── */}
                <div className="flex-1 min-w-0 flex flex-col gap-6">
                  <motion.div variants={itemVariants}>
                    <StudentDetailsCard student={caseData.student} />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <IncidentDetailsCard incident={caseData.incident} />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <EvidenceCard files={caseData.evidence} />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <PreviousOffencesTable offences={caseData.previousOffences} />
                  </motion.div>
                </div>

                {/* ── Right column ── */}
                <div className="w-full xl:w-[340px] xl:shrink-0 flex flex-col gap-6">
                  <motion.div variants={itemVariants}>
                    <TimelineCard events={caseData.timeline} />
                  </motion.div>

                  {/* Quick actions card */}
                  <motion.div variants={itemVariants}>
                    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#4f46e5] text-[18px]">bolt</span>
                        <h3 className="font-semibold text-[#0f172a] text-sm">Quick Actions</h3>
                      </div>
                      <div className="p-4 flex flex-col gap-2">
                        {[
                          { label: 'Mark as Resolved',      icon: 'check_circle',     cls: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'          },
                          { label: 'Escalate to DAC',       icon: 'gavel',            cls: 'bg-[#4f46e5] hover:bg-[#162d6b] text-white shadow-sm'              },
                          { label: 'Dismiss Case',          icon: 'cancel',           cls: 'border border-[#e2e8f0] text-red-500 hover:border-red-300 hover:bg-red-50 bg-white' },
                        ].map(({ label, icon, cls }) => (
                          <button
                            key={label}
                            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${cls}`}
                          >
                            <span className="material-symbols-outlined text-[18px]">{icon}</span>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Penalty summary card */}
                  <motion.div variants={itemVariants}>
                    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#4f46e5] text-[18px]">payments</span>
                        <h3 className="font-semibold text-[#0f172a] text-sm">Penalty Summary</h3>
                      </div>
                      <div className="p-5 flex flex-col gap-3">
                        {[
                          { label: 'Offense Level',   value: 'Level 2 — Moderate' },
                          { label: 'Severity Score',  value: '55 / 100' },
                          { label: 'Fine',            value: '₹ 2,500' },
                          { label: 'Penalty Points',  value: '25 pts' },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex items-center justify-between">
                            <span className="text-[#64748b] text-xs font-medium">{label}</span>
                            <span className="text-[#0f172a] text-sm font-semibold">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
