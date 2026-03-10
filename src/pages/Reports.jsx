import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { pageVariants, listVariants, itemVariants } from '../lib/motion';

// ── Icons ───────────────────────────────────────────────────────────────────
const ScalesIcon = () => (
  <svg width="27" height="28.5" viewBox="0 0 27 28.5" fill="none">
    <line x1="13.5" y1="2" x2="13.5" y2="26.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <line x1="2" y1="8" x2="25" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <path d="M2 8 L6 18 Q2 18 6 18" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    <path d="M2 18 Q4 13 6 18" stroke="white" strokeWidth="1.6" fill="rgba(255,255,255,0.2)" strokeLinecap="round" />
    <path d="M21 8 L25 18" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M21 18 Q23 13 25 18" stroke="white" strokeWidth="1.6" fill="rgba(255,255,255,0.2)" strokeLinecap="round" />
    <line x1="9" y1="26.5" x2="18" y2="26.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="7.5" cy="7.5" r="6.5" stroke="white" strokeWidth="1.3" />
    <path d="M4.5 7.5l2 2 4-4" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EditIcon = () => (
  <svg width="13.5" height="13.5" viewBox="0 0 14 14" fill="none">
    <path d="M1 13h12" stroke="#64748b" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M10.5 1.5l2 2-8 8H2.5v-2l8-8z" stroke="#64748b" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M6 1v7M3 5.5l3 3 3-3" stroke="#64748b" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1 10.5h10" stroke="#64748b" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const BackIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M7.5 1.5l-5 4.5 5 4.5" stroke="#64748b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 6h9" stroke="#64748b" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const GridIcon = () => (
  <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
    <rect x="1" y="1" width="7" height="7" rx="1" stroke="#1f3a89" strokeWidth="1.4" />
    <rect x="12" y="1" width="7" height="7" rx="1" stroke="#1f3a89" strokeWidth="1.4" />
    <rect x="1" y="10" width="7" height="7" rx="1" stroke="#1f3a89" strokeWidth="1.4" />
    <rect x="12" y="10" width="7" height="7" rx="1" stroke="#1f3a89" strokeWidth="1.4" />
  </svg>
);

const WarningIcon = () => (
  <svg width="22" height="19" viewBox="0 0 22 19" fill="none">
    <path d="M11 1L1 17h20L11 1z" stroke="#f97316" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M11 8v4" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="11" cy="14.5" r="0.75" fill="#f97316" />
  </svg>
);

const ExclamationIcon = () => (
  <svg width="4" height="18" viewBox="0 0 4 18" fill="none">
    <path d="M2 1v11" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="2" cy="16" r="1.5" fill="#ef4444" />
  </svg>
);

const InfoCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8.5" stroke="#3b82f6" strokeWidth="1.4" />
    <path d="M10 9v5" stroke="#3b82f6" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="10" cy="6.5" r="0.8" fill="#3b82f6" />
  </svg>
);

const UpTrendIcon = () => (
  <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
    <path d="M1 11L7 5L11 9L19 1" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="19" height="20" viewBox="0 0 19 20" fill="none">
    <path d="M9.5 1L1 5v6c0 4.42 3.72 8.57 8.5 9.5C14.28 19.57 18 15.42 18 11V5L9.5 1z" stroke="#22c55e" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M6 10l2.5 2.5 4.5-5" stroke="#22c55e" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="5" height="8" viewBox="0 0 5 8" fill="none">
    <path d="M1 1l3 3-3 3" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Severity Gauge ─────────────────────────────────────────────────────────
function SeverityGauge({ score = 85 }) {
  // SVG arc gauge — semicircle
  const r = 44;
  const cx = 50, cy = 52;
  const circumference = Math.PI * r; // half circle
  const progress = (score / 100) * circumference;

  // Color: 0-40 green, 41-70 orange, 71-100 red
  const color = score >= 71 ? '#ef4444' : score >= 41 ? '#f97316' : '#22c55e';

  return (
    <div className="flex flex-col items-center py-2">
      <svg width="100" height="60" viewBox="0 0 100 60">
        {/* Background arc */}
        <path
          d={`M 6 52 A ${r} ${r} 0 0 1 94 52`}
          fill="none" stroke="#f1f5f9" strokeWidth="10" strokeLinecap="round"
        />
        {/* Progress arc */}
        <path
          d={`M 6 52 A ${r} ${r} 0 0 1 94 52`}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
        {/* Score text */}
        <text x="50" y="46" textAnchor="middle" fontSize="20" fontWeight="700" fill="#0f172a" fontFamily="Inter, sans-serif">
          {score}
        </text>
      </svg>
      <p className="text-[#94a3b8] text-xs mt-1">out of 100</p>
    </div>
  );
}

// ── Contributing factor rows ───────────────────────────────────────────────
const FACTORS = [
  {
    Icon: WarningIcon,
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    title: 'Repeat Offense',
    detail: 'Student has one prior warning for academic misconduct in the previous semester (Case #3012).',
  },
  {
    Icon: ExclamationIcon,
    bg: 'bg-red-50',
    border: 'border-red-100',
    title: 'Evidence Weight',
    detail: 'Turnitin report indicates 45% similarity match, exceeding the threshold for Level 1 offenses.',
  },
  {
    Icon: InfoCircleIcon,
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    title: 'Mitigating Circumstances',
    detail: 'Student self-reported the issue prior to final grading, which reduced the recommended penalty from Expulsion to Suspension.',
  },
];

// ── Main Component ─────────────────────────────────────────────────────────
export default function Reports() {
  return (
    <div className="min-h-screen bg-[#f6f6f8] font-inter">
      <Sidebar />

      <main className="pt-14 md:pt-0 md:pl-64 overflow-y-auto">
        <motion.div
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          className="max-w-[1152px] mx-auto px-4 md:px-8 py-8 md:py-16"
        >

          {/* ── Breadcrumb & Title ──────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
            <div>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-[#94a3b8] mb-3">
                <a href="/dashboard" className="hover:text-[#1f3a89] transition-colors">Cases</a>
                <ChevronRightIcon />
                <a href="/dashboard" className="hover:text-[#1f3a89] transition-colors">Case #4029</a>
                <ChevronRightIcon />
                <span className="text-[#1f3a89] font-medium">Recommendation</span>
              </div>
              <h1 className="text-[#0f172a] text-[32px] font-bold leading-9 mb-2">
                Recommendation Result
              </h1>
              <p className="text-[#64748b] text-lg leading-7">
                Case #4029 - John Doe (Student ID: 2023001)
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-2 shrink-0">
              <button className="flex items-center gap-2 border border-[#e2e8f0] bg-white text-[#64748b] text-sm font-medium px-4 py-2.5 rounded-lg hover:border-[#1f3a89] hover:text-[#1f3a89] transition-colors shadow-sm">
                <BackIcon /> Back to Case
              </button>
              <button className="flex items-center gap-2 border border-[#e2e8f0] bg-white text-[#64748b] text-sm font-medium px-4 py-2.5 rounded-lg hover:border-[#1f3a89] hover:text-[#1f3a89] transition-colors shadow-sm">
                <DownloadIcon /> Download Report
              </button>
            </div>
          </div>

          {/* ── Main Grid ──────────────────────────────────────────────── */}
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col lg:flex-row gap-8 items-start"
          >

            {/* ── Left Column ─────────────────────────────────────────── */}
            <motion.div variants={itemVariants} className="flex-1 min-w-0 flex flex-col gap-6">

              {/* Recommendation Hero Card */}
              <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
                {/* Blue top accent bar */}
                <div className="h-2 bg-[#1f3a89] w-full" />
                <div className="p-8 flex gap-6">
                  {/* Icon circle */}
                  <div className="w-[59px] h-[60px] rounded-xl bg-[#1f3a89] flex items-center justify-center shrink-0">
                    <ScalesIcon />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* <p className="text-[#1f3a89] text-sm font-bold uppercase tracking-widest mb-1">
                      AI Recommendation
                    </p> */}
                    <h2 className="text-[#0f172a] text-2xl font-bold leading-8 mb-4">
                      2-Week Academic Suspension
                    </h2>
                    <p className="text-[#64748b] text-sm leading-6 mb-6 max-w-[611px]">
                      Based on the analysis of the incident report, severity of the offense (Plagiarism - Level 2),
                      and the student's prior disciplinary history, the system recommends a temporary suspension.
                      This aligns with Rule 4.2 of the University Conduct Code.
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button className="flex items-center gap-2 bg-[#1f3a89] text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-[#162d6b] transition-colors shadow-sm">
                        <CheckCircleIcon /> Confirm &amp; Apply
                      </button>
                      <button className="flex items-center gap-2 border border-[#e2e8f0] text-[#64748b] text-sm font-medium px-5 py-2.5 rounded-lg hover:border-[#1f3a89] hover:text-[#1f3a89] transition-colors">
                        <EditIcon /> Modify Action
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contributing Factors */}
              <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-8">
                <h3 className="text-[#0f172a] text-lg font-bold flex items-center gap-3 mb-6">
                  <GridIcon />
                  Contributing Factors
                </h3>
                <div className="flex flex-col gap-4">
                  {FACTORS.map(({ Icon, bg, border, title, detail }) => (
                    <div
                      key={title}
                      className={`flex gap-4 p-4 rounded-xl border ${bg} ${border}`}
                    >
                      <div className="w-[22px] shrink-0 flex items-start justify-center pt-0.5">
                        <Icon />
                      </div>
                      <div>
                        <p className="text-[#0f172a] text-sm font-semibold mb-1">{title}</p>
                        <p className="text-[#64748b] text-sm leading-5">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ── Right Column ────────────────────────────────────────── */}
            <motion.div variants={itemVariants} className="w-full lg:w-[368px] lg:shrink-0 flex flex-col gap-4">

              {/* Severity Score */}
              <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm px-6 py-5">
                <p className="text-[#64748b] text-xs font-semibold uppercase tracking-widest text-center mb-1">
                  Severity Score
                </p>
                <SeverityGauge score={85} />
              </div>

              {/* Risk Level */}
              <div className="bg-white border-l-4 border-[#ef4444] rounded-xl shadow-sm px-6 py-5 border border-[#e2e8f0]">
                <p className="text-[#94a3b8] text-xs font-semibold uppercase tracking-widest mb-2">
                  Risk Level
                </p>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[#ef4444] text-2xl font-bold leading-none">High Risk</span>
                  <UpTrendIcon />
                </div>
                <p className="text-[#94a3b8] text-xs">Requires immediate DAC attention.</p>
              </div>

              {/* AI Confidence */}
              <div className="bg-white border-l-4 border-[#1f3a89] rounded-xl shadow-sm px-6 py-5 border border-[#e2e8f0]">
                <p className="text-[#94a3b8] text-xs font-semibold uppercase tracking-widest mb-2">
                  AI Confidence
                </p>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[#0f172a] text-2xl font-bold leading-none">98%</span>
                  <ShieldIcon />
                </div>
                <p className="text-[#94a3b8] text-xs">High certainty based on rule set v4.2</p>
              </div>

              {/* Triggered Rules */}
              <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm px-6 py-5">
                <p className="text-[#0f172a] text-sm font-bold mb-4">Triggered Rules</p>
                <div className="flex flex-col gap-4">
                  {[
                    { rule: 'Rule #402: Plagiarism', cat: 'Category: Academic Integrity' },
                    { rule: 'Rule #105: Recidivism', cat: 'Category: General Conduct' },
                  ].map(({ rule, cat }) => (
                    <div key={rule}>
                      <a
                        href="#"
                        className="text-[#1f3a89] text-sm font-semibold hover:underline block leading-tight"
                      >
                        {rule}
                      </a>
                      <p className="text-[#94a3b8] text-xs mt-0.5">{cat}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Similar Past Cases */}
              <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm px-6 py-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[#0f172a] text-sm font-bold">Similar Past Cases</p>
                  <button className="text-[#1f3a89] text-xs font-medium hover:underline">View All</button>
                </div>
                <div className="flex flex-col gap-4">
                  {[
                    { id: '#392', name: 'Suspension (1 Week)', sub: '92% Match • 2 months ago', color: 'bg-purple-400' },
                    { id: '#104', name: 'Suspension (2 Weeks)', sub: '88% Match • Last year', color: 'bg-green-500' },
                  ].map(({ id, name, sub, color }) => (
                    <div key={id} className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${color} text-white flex items-center justify-center text-xs font-bold shrink-0`}>
                        {id}
                      </div>
                      <div>
                        <p className="text-[#0f172a] text-sm font-semibold leading-tight">{name}</p>
                        <p className="text-[#94a3b8] text-xs leading-tight">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </div >
  );
}
