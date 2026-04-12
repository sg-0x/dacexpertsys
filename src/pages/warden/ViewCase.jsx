import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import WardenSidebar from '../../components/WardenSidebar';
import { pageVariants, listVariants, itemVariants } from '../../lib/motion';

const DUMMY_CASES = {
  'WRD-2024-003': {
    token: 'WRD-2024-003',
    status: 'Resolved (Warning)',
    statusDot: 'bg-emerald-500',
    severity: 'High',
    severityClass: 'bg-orange-100 text-orange-700',

    student: {
      name: 'Amit Patel',
      enrollment: '22EE032',
      year: '2nd Year',
      department: 'Electrical Engineering',
      email: 'amit.patel@university.edu',
      contact: '+91 98123 45678',
      hostel: 'BSH',
      room: 'B-315',
    },

    incident: {
      token: 'WRD-2024-003',
      date: '08 Apr 2026',
      time: '02:15 PM',
      location: 'Block B — Room B-315',
      offenseType: 'Room Damage',
      reportedBy: 'Warden, Block B',
      description:
        'Student caused significant damage to room furniture including broken chair and damaged desk. Incident occurred during an altercation with roommate. Estimated repair cost: ₹8,000. Student admitted fault and agreed to pay for damages.',
    },

    evidence: [
      { name: 'Damage_Photos.jpg', size: '2.4 MB', uploadedAt: '08 Apr 2026' },
      { name: 'Repair_Estimate.pdf', size: '890 KB', uploadedAt: '08 Apr 2026' },
    ],

    timeline: [
      { title: 'Case Reported', date: '08 Apr 2026, 02:30 PM', badge: 'Reported', state: 'completed', note: 'Reported by Warden, Block B.' },
      { title: 'Investigation Started', date: '08 Apr 2026, 03:00 PM', badge: 'In Progress', state: 'completed', note: 'Evidence collected and student interviewed.' },
      { title: 'Warning Issued', date: '09 Apr 2026, 10:00 AM', badge: 'Completed', state: 'completed', note: 'Formal warning issued. Student agreed to pay damages.' },
      { title: 'Case Resolved', date: '09 Apr 2026, 10:15 AM', badge: 'Resolved', state: 'completed', note: 'Case closed with warning. Payment plan established.' },
    ],

    finalStatus: {
      action: 'Warning Issued',
      date: '09 Apr 2026',
      notes: 'Student received formal warning and agreed to pay ₹8,000 for room damages in 3 monthly installments. No further disciplinary action required at this time.',
    },
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

export default function ViewCase() {
  const { id } = useParams();
  const navigate = useNavigate();

  const caseData = DUMMY_CASES[id];

  return (
    <div className="min-h-screen bg-[#f9f9fb] font-sans antialiased">
      <WardenSidebar />

      <main className="pt-14 md:pt-0 md:pl-64 flex flex-col min-h-screen bg-[#f9f9fb]">
        <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-20 px-4 md:px-6 py-4">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => navigate('/warden/cases')}
              className="flex items-center gap-1.5 text-[#64748b] hover:text-[#4f46e5] transition-colors text-sm font-medium"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span className="hidden sm:inline">My Cases</span>
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
          {!caseData ? (
            <NotFound token={id} onBack={() => navigate('/warden/cases')} />
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
                  {/* Case Header */}
                  <motion.div variants={itemVariants} className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[24px]">check_circle</span>
                      </div>
                      <div>
                        <p className="text-emerald-100 text-xs font-medium uppercase tracking-wide">Case Status</p>
                        <h3 className="text-xl font-bold">{caseData.status}</h3>
                      </div>
                    </div>
                    <p className="text-emerald-50 text-sm">This case has been resolved and closed.</p>
                  </motion.div>

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
                </div>

                {/* Right column */}
                <div className="w-full xl:w-[340px] xl:shrink-0 flex flex-col gap-6">
                  {/* Timeline */}
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

                  {/* Final Status */}
                  <motion.div variants={itemVariants} className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#4f46e5] text-[18px]">assignment_turned_in</span>
                      <h3 className="font-semibold text-[#0f172a] text-sm">Final Status</h3>
                    </div>
                    <div className="p-6 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[#94a3b8] text-xs font-medium uppercase tracking-wide">Action Taken</span>
                        <span className="text-[#0f172a] text-sm font-semibold">{caseData.finalStatus.action}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#94a3b8] text-xs font-medium uppercase tracking-wide">Date</span>
                        <span className="text-[#0f172a] text-sm font-semibold">{caseData.finalStatus.date}</span>
                      </div>
                      <div>
                        <p className="text-[#94a3b8] text-xs font-medium uppercase tracking-wide mb-2">Notes</p>
                        <p className="text-[#334155] text-sm leading-6 bg-slate-50 rounded-lg border border-[#e2e8f0] px-4 py-3">
                          {caseData.finalStatus.notes}
                        </p>
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
