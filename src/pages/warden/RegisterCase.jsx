import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import WardenSidebar from '../../components/WardenSidebar';

const offenseOptions = [
  'Noise Complaint', 'Late Night Entry', 'Room Damage', 'Unauthorized Guest',
  'Smoking in Hostel', 'Alcohol Possession', 'Harassment', 'Other',
];

const STEPS = ['Student Info', 'Incident Details', 'Evidence', 'Questionnaire', 'Review'];

function ProgressBar({ steps, currentStep }) {
  const percentage = steps.length <= 1 ? 100 : Math.round((currentStep / (steps.length - 1)) * 100);
  const currentLabel = steps[currentStep] ?? steps[steps.length - 1];

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-[#5c56e9] truncate">{currentLabel}</span>
        <span className="text-[#64748b] font-medium whitespace-nowrap ml-2">
          Step {currentStep + 1} of {steps.length}
        </span>
      </div>
      <div className="relative h-5 rounded-full bg-[#e2e8f0] overflow-hidden shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#5c56e9] to-[#3b5fc0] transition-all duration-500 ease-in-out flex items-center justify-end pr-2"
          style={{ width: `${Math.max(percentage, 4)}%` }}
        >
          {percentage >= 12 && (
            <span className="text-white text-xs font-bold leading-none">{percentage}%</span>
          )}
        </div>
        {percentage < 12 && (
          <span
            className="absolute top-1/2 -translate-y-1/2 text-xs font-bold text-[#5c56e9]"
            style={{ left: `calc(${Math.max(percentage, 4)}% + 6px)` }}
          >
            {percentage}%
          </span>
        )}
      </div>
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <span
            key={index}
            className={`text-[10px] font-medium text-center transition-colors duration-300 ${
              index < currentStep
                ? 'text-[#4f46e5]'
                : index === currentStep
                ? 'text-[#4f46e5] font-bold'
                : 'text-[#94a3b8]'
            }`}
            style={{ width: `${100 / steps.length}%` }}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[#334155] text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  'bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2.5 text-[#0f172a] text-base placeholder:text-[#94a3b8] focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] transition-colors';

function StepStudentInfo({ form, set }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-[#4f46e5] text-[18px]">person</span>
        <h2 className="text-[#0f172a] font-bold text-[18px] leading-7">Student Information</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <Field label="Student Name">
          <input
            type="text"
            value={form.studentName}
            onChange={set('studentName')}
            placeholder="e.g. Rahul Kumar"
            className={inputCls}
          />
        </Field>
        <Field label="Enrollment Number">
          <input
            type="text"
            value={form.enrollmentNumber}
            onChange={set('enrollmentNumber')}
            placeholder="e.g. 22ME045"
            className={inputCls}
          />
        </Field>
        <Field label="Department">
          <input
            type="text"
            value={form.department}
            onChange={set('department')}
            placeholder="e.g. Mechanical Engineering"
            className={inputCls}
          />
        </Field>
        <Field label="Year">
          <select
            value={form.year}
            onChange={set('year')}
            className={`${inputCls} appearance-none cursor-pointer`}
          >
            <option value="">Select year...</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </Field>
        <Field label="Hostel">
          <input
            type="text"
            value={form.hostel}
            onChange={set('hostel')}
            placeholder="BSH"
            className={inputCls}
          />
        </Field>
        <Field label="Room Number">
          <input
            type="text"
            value={form.room}
            onChange={set('room')}
            placeholder="e.g. B-214"
            className={inputCls}
          />
        </Field>
      </div>
    </div>
  );
}

function StepIncidentDetails({ form, set }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-[#4f46e5] text-[22px]">report</span>
        <h2 className="text-[#0f172a] font-bold text-[18px] leading-7">Incident Details</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <Field label="Date">
          <input
            type="date"
            value={form.date}
            onChange={set('date')}
            className={inputCls}
          />
        </Field>
        <Field label="Time">
          <input
            type="time"
            value={form.time}
            onChange={set('time')}
            className={inputCls}
          />
        </Field>
      </div>
      <Field label="Location">
        <input
          type="text"
          value={form.location}
          onChange={set('location')}
          placeholder="e.g. Block B - Common Area"
          className={inputCls}
        />
      </Field>
      <Field label="Offense Type">
        <div className="relative">
          <select
            value={form.offenseType}
            onChange={set('offenseType')}
            className={`w-full appearance-none ${inputCls} py-3 cursor-pointer`}
          >
            <option value="" disabled>Select offense category...</option>
            {offenseOptions.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] text-[20px] pointer-events-none">
            expand_more
          </span>
        </div>
      </Field>
      <Field label="Description">
        <textarea
          value={form.description}
          onChange={set('description')}
          rows={5}
          placeholder="Describe the incident in detail..."
          className={`${inputCls} resize-y`}
        />
      </Field>
    </div>
  );
}

function StepEvidence({ dragOver, setDragOver }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-[#4f46e5] text-[20px]">attach_file</span>
        <h2 className="text-[#0f172a] font-bold text-[18px] leading-7">Evidence Upload</h2>
      </div>
      <p className="text-[#64748b] text-sm leading-5">
        Attach any supporting materials — photos, videos, or witness statements.
      </p>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
        className={`h-44 flex flex-col items-center justify-center gap-2 bg-[#f8fafc] border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
          dragOver ? 'border-[#4f46e5] bg-[#f0f4ff]' : 'border-[#cbd5e1]'
        }`}
      >
        <span className="material-symbols-outlined text-[#94a3b8] text-[36px]">upload_file</span>
        <p className="text-sm">
          <span className="font-semibold text-[#4f46e5]">Click to upload</span>
          <span className="text-[#64748b]"> or drag and drop</span>
        </p>
        <p className="text-[#64748b] text-xs">PDF, JPG, PNG or MP4 (MAX. 10MB)</p>
      </div>
    </div>
  );
}

function StepQuestionnaire({ intoxicated, setIntoxicated, cooperated, setCooperated, repeated, setRepeated }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-[#4f46e5] text-[20px]">psychology</span>
        <h2 className="text-[#0f172a] font-bold text-[18px] leading-7">Questionnaire</h2>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-[#0f172a] font-semibold text-base leading-6">Was the student intoxicated?</p>
        <div className="flex gap-4 pt-3">
          {[{ value: true, label: 'Yes' }, { value: false, label: 'No' }].map(({ value, label }) => (
            <label key={String(value)} className="flex-1 cursor-pointer">
              <input type="radio" className="sr-only" checked={intoxicated === value} onChange={() => setIntoxicated(value)} />
              <div className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${intoxicated === value ? 'bg-[#f0f4ff] border-[#4f46e5]' : 'bg-white border-[#e2e4ea]'}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${intoxicated === value ? 'border-[#4f46e5] bg-[#4f46e5]' : 'border-[#cbd5e1]'}`}>
                  {intoxicated === value && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className="text-[#334155] text-base font-medium">{label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-[#0f172a] font-semibold text-base leading-6">Did the student cooperate?</p>
        <div className="inline-flex p-1 bg-[#f6f6f8] rounded-lg gap-1">
          {['Yes', 'No'].map((opt) => {
            const val = opt === 'Yes';
            return (
              <button key={opt} type="button" onClick={() => setCooperated(val)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${cooperated === val ? 'bg-white text-[#4f46e5] shadow-[0_1px_2px_rgba(0,0,0,0.05)]' : 'text-[#475569] hover:text-[#0f172a]'}`}>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-[#0f172a] font-semibold text-base leading-6">Is this a repeated offense?</p>
        <div className="inline-flex p-1 bg-[#f6f6f8] rounded-lg gap-1">
          {['Yes', 'No'].map((opt) => {
            const val = opt === 'Yes';
            return (
              <button key={opt} type="button" onClick={() => setRepeated(val)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${repeated === val ? 'bg-white text-[#4f46e5] shadow-[0_1px_2px_rgba(0,0,0,0.05)]' : 'text-[#475569] hover:text-[#0f172a]'}`}>
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StepReview({ form, intoxicated, cooperated, repeated }) {
  const rows = [
    { label: 'Student Name', value: form.studentName || '—' },
    { label: 'Enrollment Number', value: form.enrollmentNumber || '—' },
    { label: 'Department', value: form.department || '—' },
    { label: 'Year', value: form.year || '—' },
    { label: 'Hostel', value: form.hostel || '—' },
    { label: 'Room', value: form.room || '—' },
    { label: 'Date', value: form.date || '—' },
    { label: 'Time', value: form.time || '—' },
    { label: 'Location', value: form.location || '—' },
    { label: 'Offense Type', value: form.offenseType || '—' },
    { label: 'Intoxicated', value: intoxicated === null ? '—' : intoxicated ? 'Yes' : 'No' },
    { label: 'Cooperated', value: cooperated ? 'Yes' : 'No' },
    { label: 'Repeated Offense', value: repeated ? 'Yes' : 'No' },
  ];
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-[#4f46e5] text-[20px]">fact_check</span>
        <h2 className="text-[#0f172a] font-bold text-[18px] leading-7">Review Submission</h2>
      </div>
      <p className="text-[#64748b] text-sm leading-5">Please verify all details before submitting.</p>
      <div className="rounded-lg border border-[#e2e8f0] overflow-hidden">
        {rows.map(({ label, value }, i) => (
          <div key={label} className={`flex items-center justify-between px-4 py-3 ${i % 2 === 0 ? 'bg-[#f8fafc]' : 'bg-white'}`}>
            <span className="text-[#64748b] text-sm">{label}</span>
            <span className="text-[#0f172a] text-sm font-medium">{value}</span>
          </div>
        ))}
      </div>
      {form.description && (
        <div className="flex flex-col gap-1">
          <span className="text-[#64748b] text-sm">Description</span>
          <p className="text-[#0f172a] text-sm bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-4 py-3 leading-5">{form.description}</p>
        </div>
      )}
    </div>
  );
}

export default function RegisterCase() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showActions, setShowActions] = useState(false);

  const [form, setForm] = useState({
    studentName: '', enrollmentNumber: '', department: '', year: '',
    hostel: 'BSH', room: '', date: '', time: '', location: '',
    offenseType: '', description: '',
  });
  const [intoxicated, setIntoxicated] = useState(null);
  const [cooperated, setCooperated] = useState(true);
  const [repeated, setRepeated] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = () => {
    setShowActions(true);
  };

  const handleEscalate = () => {
    navigate('/warden/cases');
  };

  const handleWarning = () => {
    navigate('/warden/cases');
  };

  const goNext = () => setCurrentStep((s) => Math.min(STEPS.length - 1, s + 1));
  const goPrev = () => setCurrentStep((s) => Math.max(0, s - 1));
  const isLast = currentStep === STEPS.length - 1;
  const isFirst = currentStep === 0;

  const stepContent = [
    <StepStudentInfo form={form} set={set} />,
    <StepIncidentDetails form={form} set={set} />,
    <StepEvidence dragOver={dragOver} setDragOver={setDragOver} />,
    <StepQuestionnaire
      intoxicated={intoxicated} setIntoxicated={setIntoxicated}
      cooperated={cooperated} setCooperated={setCooperated}
      repeated={repeated} setRepeated={setRepeated}
    />,
    <StepReview form={form} intoxicated={intoxicated} cooperated={cooperated} repeated={repeated} />,
  ];

  return (
    <div className="min-h-screen bg-[#f6f6f8] font-[Inter,sans-serif]">
      <WardenSidebar />
      <main className="pt-14 md:pt-0 md:pl-64 overflow-y-auto py-8 md:py-[60px] px-4 md:px-8">
        <div className="max-w-[1000px] mx-auto flex flex-col gap-6">

          <div className="flex flex-col gap-2">
            <h1 className="text-[#0f172a] text-[28px] md:text-[30px] font-black tracking-[-0.9px] leading-tight md:pt-10 pt-5">
              Register New Case
            </h1>
            <p className="text-[#64748b] text-base leading-7">
              Submit details to register a disciplinary case.
            </p>
            <div className="pb-2">
              <ProgressBar steps={STEPS} currentStep={currentStep} />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-8 flex flex-col gap-6">
                {!showActions ? (
                  <>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.22, ease: 'easeInOut' }}
                      >
                        {stepContent[currentStep]}
                      </motion.div>
                    </AnimatePresence>

                    <div className="flex items-center justify-between pt-2 border-t border-[#e2e8f0]">
                      <button
                        type="button"
                        onClick={goPrev}
                        disabled={isFirst}
                        className="flex items-center gap-2 px-6 py-3 text-[#475569] text-base font-medium hover:text-[#0f172a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                        Previous
                      </button>

                      {!isLast ? (
                        <button
                          type="button"
                          onClick={goNext}
                          className="flex items-center gap-2 px-8 py-3 bg-[#5c56e9] text-white text-base font-medium rounded-lg shadow-[0_10px_15px_-3px_rgba(31,58,137,0.3)] hover:bg-[#4e49e4] transition-colors"
                        >
                          Next Step
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSubmit}
                          className="flex items-center gap-2 px-8 py-3 bg-[#c02525] text-white text-base font-bold rounded-lg shadow-[0_10px_15px_-3px_rgba(192,37,37,0.3)] hover:bg-[#a81f1f] transition-colors"
                        >
                          Submit Case
                          <span className="material-symbols-outlined text-[18px]">send</span>
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-6 py-4">
                    <div className="w-16 h-16 rounded-full bg-[#ecfdf5] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#047857] text-[36px]">check_circle</span>
                    </div>
                    <div className="text-center flex flex-col gap-2">
                      <h2 className="text-[#0f172a] font-bold text-[22px]">Case Registered Successfully</h2>
                      <p className="text-[#64748b] text-sm">Choose an action to proceed with this case.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                      <button
                        onClick={handleEscalate}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#4f46e5] text-white text-base font-semibold rounded-lg hover:bg-[#4338ca] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">gavel</span>
                        Escalate to Chief Warden
                      </button>
                      <button
                        onClick={handleWarning}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white text-base font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">warning</span>
                        Issue Warning
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full lg:w-[280px] lg:flex-shrink-0 flex flex-col gap-4">
              <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0f172a] text-[16px]">info</span>
                  <h3 className="text-[#0f172a] font-bold text-sm leading-5">Guidelines</h3>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    "Ensure enrollment number is accurate.",
                    "Select the primary offense if multiple violations occurred.",
                    "Attach clear evidence or witness statements.",
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#f1f5f9] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#64748b] text-[10px] font-bold">{i + 1}</span>
                      </div>
                      <p className="text-[#475569] text-xs leading-4">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
