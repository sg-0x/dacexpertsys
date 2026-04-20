import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ChiefWardenSidebar from '../../components/ChiefWardenSidebar';
import { pageVariants, listVariants, itemVariants } from '../../lib/motion';
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

function formatTime(value) {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

const DUMMY_CASES = {
  'CW-2024-001': {
    token: 'CW-2024-001',
    status: 'Escalated to Chief Warden',
    statusDot: 'bg-blue-500',
    severity: 'Medium',
    severityClass: 'bg-yellow-100 text-yellow-700',

    student: {
      name: 'Priya Sharma',
      enrollment: '22CS089',
      year: '2nd Year',
      department: 'Computer Science',
      email: 'priya.sharma@university.edu',
      contact: '+91 98765 12345',
      hostel: 'GH-1',
      room: 'G-205',
    },

    incident: {
      token: 'CW-2024-001',
      date: '11 Apr 2026',
      time: '01:15 AM',
      location: 'Girls Hostel - Main Gate',
      offenseType: 'Late Night Entry',
      reportedBy: 'Warden, Girls Hostel',
      description:
        'Student entered hostel premises at 1:15 AM, well past the 11:00 PM curfew. Gate security logged the entry. Student claimed she was attending a college event that ran late, but no official permission slip was presented. This is the second such incident in the past month.',
    },

    evidence: [
      { name: 'Gate_Entry_Log.pdf', size: '890 KB', uploadedAt: '11 Apr 2026' },
      { name: 'CCTV_Footage.mp4', size: '12.4 MB', uploadedAt: '11 Apr 2026' },
    ],

    questionnaire: {
      intoxicated: false,
      cooperated: true,
      repeated: true,
    },

    wardenNotes: 'Student was cooperative but this is a repeated offense. Previous warning was issued on 15 Mar 2026. Recommend escalation for stricter action.',

    timeline: [
      { title: 'Case Reported', date: '11 Apr 2026, 01:30 AM', badge: 'Reported', state: 'completed', note: 'Reported by Warden, Girls Hostel.' },
      { title: 'Investigation Started', date: '11 Apr 2026, 09:00 AM', badge: 'In Progress', state: 'completed', note: 'Evidence collected by Warden.' },
      { title: 'Escalated to Chief Warden', date: '11 Apr 2026, 02:00 PM', badge: 'Active', state: 'active', note: 'Awaiting Chief Warden review and decision.' },
      { title: 'Decision Pending', date: null, badge: 'Pending', state: 'upcoming', note: null },
    ],
  },
  'CW-2024-002': {
    token: 'CW-2024-002',
    status: 'Escalated to Chief Warden',
    statusDot: 'bg-blue-500',
    severity: 'High',
    severityClass: 'bg-orange-100 text-orange-700',

    student: {
      name: 'Vikram Singh',
      enrollment: '21EE056',
      year: '3rd Year',
      department: 'Electrical Engineering',
      email: 'vikram.singh@university.edu',
      contact: '+91 91234 56789',
      hostel: 'BSH',
      room: 'B-412',
    },

    incident: {
      token: 'CW-2024-002',
      date: '11 Apr 2026',
      time: '10:45 PM',
      location: 'Boys Hostel - Corridor B',
      offenseType: 'Smoking in Hostel',
      reportedBy: 'Warden, Boys Hostel',
      description:
        'Student was found smoking in the hostel corridor, violating the strict no-smoking policy. Multiple residents complained about the smoke. Student initially denied but admitted after being shown CCTV footage. This poses a fire hazard and health risk to other residents.',
    },

    evidence: [
      { name: 'CCTV_Evidence.mp4', size: '8.2 MB', uploadedAt: '11 Apr 2026' },
      { name: 'Complaint_Letters.pdf', size: '1.5 MB', uploadedAt: '11 Apr 2026' },
    ],

    questionnaire: {
      intoxicated: false,
      cooperated: false,
      repeated: false,
    },

    wardenNotes: 'Student was initially uncooperative and denied the offense. Only admitted after being confronted with evidence. Recommend strict action due to safety concerns.',

    timeline: [
      { title: 'Case Reported', date: '11 Apr 2026, 11:00 PM', badge: 'Reported', state: 'completed', note: 'Reported by Warden, Boys Hostel.' },
      { title: 'Investigation Started', date: '12 Apr 2026, 09:30 AM', badge: 'In Progress', state: 'completed', note: 'CCTV footage reviewed and complaints collected.' },
      { title: 'Escalated to Chief Warden', date: '12 Apr 2026, 03:00 PM', badge: 'Active', state: 'active', note: 'Awaiting Chief Warden review and decision.' },
      { title: 'Decision Pending', date: null, badge: 'Pending', state: 'upcoming', note: null },
    ],
  },
};

const stateStyles = {
  completed: {
    dot: 'bg-[#4f46e5] border-[#4f46e5]',
    icon: 'check',
    iconColor: 'text-white',
    line: 'bg-[#4f46e5]',
    title: 'text-[#0f172a]',
  },
  active: {
    dot: 'bg-white border-[#4f46e5] border-2',
    icon: 'radio_button_checked',
    iconColor: 'text-[#4f46e5]',
    line: 'bg-[#e2e8f0]',
    title: 'text-[#4f46e5] font-semibold',
  },
  upcoming: {
    dot: 'bg-white border-[#e2e8f0]',
    icon: null,
    iconColor: '',
    line: 'bg-[#e2e8f0]',
    title: 'text-[#94a3b8]',
  },
};

function NotFound({ token, onBack }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <span className="material-symbols-outlined text-[60px] text-[#cbd5e1]">search_off</span>
      <p className="text-[#0f172a] text-lg font-semibold">Case not found</p>
      <p className="text-[#64748b] text-sm">No case with token <span className="font-mono font-semibold">{token}</span> exists.</p>
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

export default function ManageCase() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hasLoggedResponseRef = useRef(false);
  const [notes, setNotes] = useState('');
  const [liveCaseData, setLiveCaseData] = useState(null);
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
          console.log('ChiefWarden ManageCase API response:', { cases: casesResponse, users: usersResponse });
          hasLoggedResponseRef.current = true;
        }

        const matched = casesResponse.find((entry) => String(entry.id) === String(id));
        if (!matched) {
          if (mounted) setLiveCaseData(null);
          return;
        }

        const usersById = Object.fromEntries(usersResponse.map((user) => [String(user.id), user]));
        const student = usersById[String(matched.student_id)] ?? {};
        const reporter = usersById[String(matched.reported_by)] ?? null;
        const status = toTitleCase(matched.status);
        const severity = toTitleCase(matched.severity);

        const mapped = {
          token: String(matched.id),
          status: status || 'Escalated to Chief Warden',
          statusDot: 'bg-blue-500',
          severity: severity || 'Medium',
          severityClass: severity === 'Critical' ? 'bg-red-100 text-red-700' : severity === 'High' ? 'bg-orange-100 text-orange-700' : severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600',
          student: {
            name: student.name || 'Unknown Student',
            enrollment: student.enrollment_no || `ID-${matched.student_id}`,
            year: student.year ? `${student.year} Year` : 'N/A',
            department: student.program ? toTitleCase(student.program) : 'N/A',
            email: student.email || 'N/A',
            contact: student.contact || 'N/A',
            hostel: student.hostel || 'N/A',
            room: student.room || 'N/A',
          },
          incident: {
            token: String(matched.id),
            date: formatDate(matched.incident_date ?? matched.created_at),
            time: formatTime(matched.created_at),
            location: matched.location || 'N/A',
            offenseType: toTitleCase(matched.offense_type) || 'N/A',
            reportedBy: reporter?.name || 'Warden',
            description: matched.description || 'No description available.',
          },
          evidence: [],
          questionnaire: {
            intoxicated: false,
            cooperated: true,
            repeated: false,
          },
          wardenNotes: matched.description || '',
          timeline: [
            { title: 'Case Reported', date: formatDate(matched.created_at), badge: 'Reported', state: 'completed', note: null },
            { title: 'Investigation Started', date: formatDate(matched.created_at), badge: 'In Progress', state: 'completed', note: null },
            { title: 'Escalated to Chief Warden', date: formatDate(matched.created_at), badge: 'Active', state: 'active', note: null },
            { title: 'Decision Pending', date: null, badge: 'Pending', state: 'upcoming', note: null },
          ],
        };

        if (mounted) setLiveCaseData(mapped);
      } catch (loadError) {
        if (mounted) {
          setError(loadError?.message || 'Failed to fetch case details.');
          setLiveCaseData(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, [id]);

  const caseData = liveCaseData;

  const handleEscalateToDSW = () => {
    alert('Case escalated to DSW');
    navigate('/chief-warden/cases');
  };

  const handleIssueWarning = () => {
    alert('Warning issued to student');
    navigate('/chief-warden/cases');
  };

  return (
    <div className="min-h-screen bg-[#f9f9fb] font-sans antialiased">
      <ChiefWardenSidebar />

      <main className="pt-14 md:pt-0 md:pl-64 flex flex-col min-h-screen bg-[#f9f9fb]">
        <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-20 px-4 md:px-6 py-4">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => navigate('/chief-warden/cases')}
              className="flex items-center gap-1.5 text-[#64748b] hover:text-[#4f46e5] transition-colors text-sm font-medium"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span className="hidden sm:inline">Incoming Cases</span>
            </button>

            <span className="text-[#e2e8f0] text-lg hidden sm:block">/</span>

            <span className="font-mono text-sm font-semibold text-[#64748b]">
              {caseData ? caseData.token : id}
            </span>

            {caseData && (
              <>
                <span className="text-[#e2e8f0] text-lg hidden sm:block">/</span>

                <h2 className="text-[#0f172a] text-base font-semibold tracking-tight">
                  {caseData.student.name}
                </h2>

                <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                  <span className={`h-2 w-2 rounded-full ${caseData.statusDot}`} />
                  <span className="text-sm text-[#0f172a]">{caseData.status}</span>
                </div>

                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${caseData.severityClass}`}>
                  {caseData.severity}
                </span>
              </>
            )}
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full">
          {loading && !caseData ? (
            <p className="text-[#64748b] text-sm mb-4">Loading...</p>
          ) : null}
          {!loading && error ? (
            <p className="text-sm text-red-600 mb-4">Error: {error}</p>
          ) : null}
          {!caseData ? (
            <NotFound token={id} onBack={() => navigate('/chief-warden/cases')} />
          ) : (
            <motion.div
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-6"
            >
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col xl:flex-row gap-6 items-start"
              >
                {/* Left column */}
                <div className="flex-1 min-w-0 flex flex-col gap-6">
                  {/* Student Details */}
                  <motion.div variants={itemVariants} className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#4f46e5] text-[18px]">person</span>
                      <h3 className="font-semibold text-[#0f172a] text-sm">Student Details</h3>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-bold shrink-0">
                          {caseData.student.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[#0f172a] font-semibold text-base leading-tight">{caseData.student.name}</p>
                          <p className="text-[#64748b] text-xs mt-0.5">{caseData.student.enrollment}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                        {[
                          { label: 'Year', value: caseData.student.year },
                          { label: 'Department', value: caseData.student.department },
                          { label: 'Email', value: caseData.student.email },
                          { label: 'Contact', value: caseData.student.contact },
                          { label: 'Hostel', value: caseData.student.hostel },
                          { label: 'Room No.', value: caseData.student.room },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <p className="text-[#94a3b8] text-xs font-medium uppercase tracking-wide mb-0.5">{label}</p>
                            <p className="text-[#0f172a] text-sm font-medium">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Incident Details */}
                  <motion.div variants={itemVariants} className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#4f46e5] text-[18px]">report</span>
                      <h3 className="font-semibold text-[#0f172a] text-sm">Incident Details</h3>
                    </div>
                    <div className="p-6 flex flex-col gap-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                        {[
                          { label: 'Token ID', value: caseData.incident.token, icon: 'tag' },
                          { label: 'Date', value: caseData.incident.date, icon: 'calendar_today' },
                          { label: 'Time', value: caseData.incident.time, icon: 'schedule' },
                          { label: 'Location', value: caseData.incident.location, icon: 'location_on' },
                          { label: 'Offense Type', value: caseData.incident.offenseType, icon: 'gavel' },
                          { label: 'Reported By', value: caseData.incident.reportedBy, icon: 'person_pin' },
                        ].map(({ label, value, icon }) => (
                          <div key={label} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#eef2fb] flex items-center justify-center shrink-0 mt-0.5">
                              <span className="material-symbols-outlined text-[#4f46e5] text-[16px]">{icon}</span>
                            </div>
                            <div>
                              <p className="text-[#94a3b8] text-xs font-medium uppercase tracking-wide mb-0.5">{label}</p>
                              <p className="text-[#0f172a] text-sm font-medium">{value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-[#94a3b8] text-xs font-medium uppercase tracking-wide mb-2">Description</p>
                        <p className="text-[#334155] text-sm leading-6 bg-slate-50 rounded-lg border border-[#e2e8f0] px-4 py-3">
                          {caseData.incident.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Evidence */}
                  <motion.div variants={itemVariants} className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#4f46e5] text-[18px]">attach_file</span>
                      <h3 className="font-semibold text-[#0f172a] text-sm">Evidence</h3>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-col gap-3">
                        {caseData.evidence.map((file, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[#4f46e5] text-[18px]">description</span>
                              </div>
                              <div>
                                <p className="text-[#0f172a] text-sm font-medium">{file.name}</p>
                                <p className="text-[#94a3b8] text-xs">{file.size} • Uploaded {file.uploadedAt}</p>
                              </div>
                            </div>
                            <button className="text-[#4f46e5] hover:text-[#4338ca] transition-colors">
                              <span className="material-symbols-outlined text-[18px]">download</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Questionnaire */}
                  <motion.div variants={itemVariants} className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#4f46e5] text-[18px]">psychology</span>
                      <h3 className="font-semibold text-[#0f172a] text-sm">Questionnaire (Read-Only)</h3>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { label: 'Was the student intoxicated?', value: caseData.questionnaire.intoxicated ? 'Yes' : 'No' },
                          { label: 'Did the student cooperate?', value: caseData.questionnaire.cooperated ? 'Yes' : 'No' },
                          { label: 'Is this a repeated offense?', value: caseData.questionnaire.repeated ? 'Yes' : 'No' },
                        ].map(({ label, value }) => (
                          <div key={label} className="p-4 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                            <p className="text-[#94a3b8] text-xs font-medium uppercase tracking-wide mb-1">{label}</p>
                            <p className="text-[#0f172a] text-base font-semibold">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Warden Notes */}
                  <motion.div variants={itemVariants} className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#4f46e5] text-[18px]">note</span>
                      <h3 className="font-semibold text-[#0f172a] text-sm">Warden Notes</h3>
                    </div>
                    <div className="p-6">
                      <p className="text-[#334155] text-sm leading-6 bg-slate-50 rounded-lg border border-[#e2e8f0] px-4 py-3">
                        {caseData.wardenNotes}
                      </p>
                    </div>
                  </motion.div>

                  {/* Chief Warden Notes */}
                  <motion.div variants={itemVariants} className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#4f46e5] text-[18px]">edit_note</span>
                      <h3 className="font-semibold text-[#0f172a] text-sm">Chief Warden Notes</h3>
                    </div>
                    <div className="p-6">
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        placeholder="Add your notes and decision rationale..."
                        className="w-full bg-white border border-[#e2e8f0] rounded-lg px-4 py-3 text-[#0f172a] text-sm placeholder:text-[#94a3b8] resize-y focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] transition-colors"
                      />
                    </div>
                  </motion.div>

                  {/* Decision Buttons */}
                  <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleEscalateToDSW}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#8b5cf6] text-white text-base font-semibold rounded-xl hover:bg-[#7c3aed] transition-colors shadow-md"
                    >
                      <span className="material-symbols-outlined text-[20px]">gavel</span>
                      Escalate to DSW
                    </button>
                    <button
                      onClick={handleIssueWarning}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] text-white text-base font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-md"
                    >
                      <span className="material-symbols-outlined text-[20px]">warning</span>
                      Issue Warning
                    </button>
                  </motion.div>
                </div>

                {/* Right column - Timeline */}
                <div className="w-full xl:w-[340px] xl:shrink-0">
                  <motion.div variants={itemVariants} className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#4f46e5] text-[18px]">timeline</span>
                      <h3 className="font-semibold text-[#0f172a] text-sm">Case Timeline</h3>
                    </div>
                    <div className="p-6">
                      <ol className="relative">
                        {caseData.timeline.map((event, i) => {
                          const style = stateStyles[event.state] ?? stateStyles.upcoming;
                          const isLast = i === caseData.timeline.length - 1;

                          return (
                            <li key={i} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${style.dot}`}>
                                  {style.icon && (
                                    <span className={`material-symbols-outlined text-[15px] ${style.iconColor}`}>
                                      {style.icon}
                                    </span>
                                  )}
                                </div>
                                {!isLast && (
                                  <div className={`w-0.5 flex-1 min-h-[24px] mt-1 mb-1 rounded-full ${style.line}`} />
                                )}
                              </div>

                              <div className={`pb-6 flex-1 min-w-0 ${isLast ? 'pb-0' : ''}`}>
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <p className={`text-sm leading-tight ${style.title}`}>{event.title}</p>
                                </div>
                                {event.date && (
                                  <p className="text-[#94a3b8] text-xs">{event.date}</p>
                                )}
                                {event.note && (
                                  <p className="text-[#64748b] text-xs mt-1 leading-5">{event.note}</p>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ol>
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
