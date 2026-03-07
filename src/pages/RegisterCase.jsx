import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ProgressBar from '../components/ProgressBar';

// ─── Offense options ──────────────────────────────────────────────────────────
const offenseOptions = [
  'Plagiarism', 'Vandalism', 'Exam Malpractice', 'Attendance',
  'Disruption', 'Substance Abuse', 'Harassment', 'Other',
];

const STEPS = [
  'Student Info',
  'Incident Details',
  'Evidence',
  'Assessment',
  'Review',
  'Submit',
];


export default function RegisterCase() {
  const navigate = useNavigate();

  // Step state
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [form, setForm] = useState({
    studentName: '', rollNumber: '', department: '', hostelBlock: '',
    offenseType: '', description: '', notes: '',
  });
  const [intoxicated, setIntoxicated] = useState(null);   // null | true | false
  const [cooperated, setCooperated]   = useState(true);
  const [offenseCount, setOffenseCount] = useState(1);
  const [dragOver, setDragOver] = useState(false);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ form, intoxicated, cooperated, offenseCount });
  };

  return (
    <div className="flex min-h-screen bg-[#f6f6f8] font-[Inter,sans-serif]">

      <Sidebar />

      {/* ══ MAIN ══ */}
      <main className="flex-1 overflow-y-auto py-[60px] px-8">
        <div className="max-w-[1000px] mx-auto flex flex-col gap-8">

          {/* Page header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-[#0f172a] text-[36px] font-black tracking-[-0.9px] leading-10">
              Register New Disciplinary Case
            </h1>
            <p className="text-[#64748b] text-[18px] leading-7">
              Submit details below to initiate an automated disciplinary review.
            </p>
          </div>

          <div className="flex gap-8 items-start">

            {/* ══ LEFT COLUMN ══ */}
            <div className="flex-1 min-w-0">
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl border border-[#e2e8f0] shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-8 flex flex-col gap-6"
              >

                {/* ── Student Information ── */}
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#1f3a89] text-[16px]">person</span>
                  <h2 className="text-[#0f172a] font-bold text-[18px] leading-7">Student Information</h2>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  {[
                    { label: 'Student Name',  field: 'studentName', placeholder: 'e.g. John Doe'          },
                    { label: 'Roll Number',   field: 'rollNumber',  placeholder: 'e.g. CS-2023-045'       },
                    { label: 'Department',    field: 'department',  placeholder: 'e.g. Computer Science'   },
                    { label: 'Hostel Block',  field: 'hostelBlock', placeholder: 'e.g. Block A, Room 101'  },
                  ].map(({ label, field, placeholder }) => (
                    <div key={field} className="flex flex-col gap-2">
                      <label className="text-[#334155] text-sm font-medium">{label}</label>
                      <input
                        type="text"
                        value={form[field]}
                        onChange={set(field)}
                        placeholder={placeholder}
                        className="bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2.5 text-[#0f172a] text-base placeholder:text-[#94a3b8] focus:outline-none focus:border-[#1f3a89] focus:ring-1 focus:ring-[#1f3a89] transition-colors"
                      />
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-[#e2e8f0]" />

                {/* ── Incident Details ── */}
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#1f3a89] text-[22px]">report</span>
                  <h2 className="text-[#0f172a] font-bold text-[18px] leading-7">Incident Details</h2>
                </div>

                <div className="flex flex-col gap-5">
                  {/* Offense Type */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#334155] text-sm font-medium">Offense Type</label>
                    <div className="relative">
                      <select
                        value={form.offenseType}
                        onChange={set('offenseType')}
                        className="w-full appearance-none bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-3 text-base text-[#0f172a] focus:outline-none focus:border-[#1f3a89] focus:ring-1 focus:ring-[#1f3a89] transition-colors cursor-pointer"
                      >
                        <option value="" disabled>Select offense category...</option>
                        {offenseOptions.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] text-[20px] pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#334155] text-sm font-medium">Incident Description</label>
                    <textarea
                      value={form.description}
                      onChange={set('description')}
                      rows={5}
                      placeholder="Describe the incident in detail, including time, location, and involved parties..."
                      className="bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-[#0f172a] text-base placeholder:text-[#94a3b8] resize-y focus:outline-none focus:border-[#1f3a89] focus:ring-1 focus:ring-[#1f3a89] transition-colors"
                    />
                  </div>

                  {/* Evidence Upload */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#334155] text-sm font-medium">Evidence Upload</label>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
                      className={`h-40 flex flex-col items-center justify-center gap-2 bg-[#f8fafc] border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
                        dragOver ? 'border-[#1f3a89] bg-[#f0f4ff]' : 'border-[#cbd5e1]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[#94a3b8] text-[32px]">upload_file</span>
                      <p className="text-sm">
                        <span className="font-semibold text-[#1f3a89]">Click to upload</span>
                        <span className="text-[#64748b]"> or drag and drop</span>
                      </p>
                      <p className="text-[#64748b] text-xs">PDF, JPG, PNG or MP4 (MAX. 10MB)</p>
                    </div>
                  </div>
                </div>

                {/* ── Progress Bar ── */}
                <div className="pb-2">
                  <ProgressBar steps={STEPS} currentStep={currentStep} />
                </div>

                {/* ── Questionnaire Card ── */}
                <div className="bg-white rounded-xl border border-[#e2e4ea] shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-8 flex flex-col gap-8">

                  {/* Card header */}
                  <div className="border-b border-[#e2e4ea] pb-6 flex flex-col gap-2">
                    <h3 className="text-[#0f172a] font-bold text-xl leading-7">Incident Assessment</h3>
                    <p className="text-[#64748b] text-base leading-6">
                      Please answer the following questions honestly to determine the recommended disciplinary action framework.
                    </p>
                  </div>

                  <div className="flex flex-col gap-8 pb-4">

                    {/* Q1: Intoxicated */}
                    <div className="flex flex-col gap-1">
                      <p className="text-[#0f172a] font-semibold text-base leading-6">Was the student intoxicated?</p>
                      <p className="text-[#64748b] text-sm leading-5">
                        Evidence of alcohol consumption, breathalyzer results, or failed field sobriety test.
                      </p>
                      <div className="flex gap-4 pt-3">
                        {[
                          { value: true,  label: 'Yes, evidence present' },
                          { value: false, label: 'No, sober'             },
                        ].map(({ value, label }) => (
                          <label key={String(value)} className="flex-1 cursor-pointer">
                            <input
                              type="radio"
                              className="sr-only"
                              checked={intoxicated === value}
                              onChange={() => setIntoxicated(value)}
                            />
                            <div className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                              intoxicated === value
                                ? 'bg-[#f0f4ff] border-[#1f3a89]'
                                : 'bg-white border-[#e2e4ea]'
                            }`}>
                              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                                intoxicated === value ? 'border-[#1f3a89] bg-[#1f3a89]' : 'border-[#cbd5e1]'
                              }`}>
                                {intoxicated === value && <div className="w-2 h-2 rounded-full bg-white" />}
                              </div>
                              <span className="text-[#334155] text-base font-medium">{label}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Q2: Cooperated */}
                    <div className="flex flex-col gap-1">
                      <p className="text-[#0f172a] font-semibold text-base leading-6">Did the student cooperate with officials?</p>
                      <p className="text-[#64748b] text-sm leading-5 pb-3">
                        Refers to compliance with campus security or faculty requests during the incident.
                      </p>
                      <div className="inline-flex p-1 bg-[#f6f6f8] rounded-lg gap-1">
                        {['Yes', 'No'].map((opt) => {
                          const val = opt === 'Yes';
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setCooperated(val)}
                              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                                cooperated === val
                                  ? 'bg-white text-[#1f3a89] shadow-[0_1px_2px_rgba(0,0,0,0.05)]'
                                  : 'text-[#475569] hover:text-[#0f172a]'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Q3: Offense Count */}
                    <div className="flex flex-col gap-1">
                      <p className="text-[#0f172a] font-semibold text-base leading-6">Offense Count</p>
                      <p className="text-[#64748b] text-sm leading-5">
                        How many prior related offenses has the student committed?
                      </p>
                      <div className="flex gap-4 pt-3">
                        {[
                          { count: 1, label: '1st' },
                          { count: 2, label: '2nd' },
                          { count: 3, label: '3rd+' },
                        ].map(({ count, label }) => (
                          <button
                            key={count}
                            type="button"
                            onClick={() => setOffenseCount(count)}
                            className={`relative flex-1 flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${
                              offenseCount === count
                                ? 'bg-[#1f3a89]/5 border-[#1f3a89]'
                                : 'border-[#e2e4ea] hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-[#0f172a] font-bold text-2xl leading-8">{label}</span>
                            <span className="text-[#64748b] text-xs">Offense</span>
                            {offenseCount === count && (
                              <span className="material-symbols-outlined absolute top-3 right-3 text-[#1f3a89] text-[15px]">
                                check_circle
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[#0f172a] font-semibold text-base leading-6">
                        Additional Notes <span className="font-normal text-[#94a3b8]">(Optional)</span>
                      </label>
                      <textarea
                        value={form.notes}
                        onChange={set('notes')}
                        rows={3}
                        placeholder="Enter any mitigating circumstances..."
                        className="bg-white border border-[#e2e4ea] rounded-lg px-3 py-3 text-[#0f172a] text-base placeholder:text-[#94a3b8] resize-y focus:outline-none focus:border-[#1f3a89] focus:ring-1 focus:ring-[#1f3a89] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* ── Step Navigation ── */}
                <div className="flex items-center justify-between py-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2 px-6 py-3 text-[#475569] text-base font-medium hover:text-[#0f172a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-[12px]">arrow_back</span>
                    Previous Step
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep((s) => Math.min(STEPS.length - 1, s + 1))}
                    className="relative flex items-center gap-2 px-8 py-3 bg-[#1f3a89] text-white text-base font-medium rounded-lg overflow-hidden shadow-[0_10px_15px_-3px_rgba(31,58,137,0.3),0_4px_6px_-4px_rgba(31,58,137,0.3)] hover:bg-[#162d6b] transition-colors"
                  >
                    Next Step
                    <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                  </button>
                </div>

                {/* ── Submit / Cancel ── */}
                <div className="flex items-center justify-end gap-3 pt-2 pb-8">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3 text-[#475569] text-base font-medium rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="relative flex items-center gap-2 px-8 py-3 bg-[#c02525] text-white text-base font-bold rounded-lg overflow-hidden shadow-[0_10px_15px_-3px_rgba(31,58,137,0.2),0_4px_6px_-4px_rgba(31,58,137,0.2)] hover:bg-[#a81f1f] transition-colors"
                  >
                    Submit Case
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </button>
                </div>

              </form>
            </div>

            {/* ══ RIGHT COLUMN ══ */}
            <div className="w-[312px] flex-shrink-0 flex flex-col gap-6">

              {/* Token Generation card */}
              <div className="relative bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl p-5 overflow-hidden">
                {/* Faint bg icon */}
                <div className="absolute top-1 right-1 opacity-10 p-4">
                  <span className="material-symbols-outlined text-[80px] text-emerald-600">token</span>
                </div>

                <div className="relative flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#047857] text-[20px]">verified</span>
                    <span className="text-[#047857] font-bold text-sm tracking-[0.7px] uppercase">System Ready</span>
                  </div>
                  <h3 className="text-[#064e3b] font-bold text-[18px] leading-7">Token Generation</h3>
                  <p className="text-[#065f46] text-sm leading-5">
                    Upon submission, a unique tracking ID will be generated automatically.
                  </p>
                  <div className="flex items-center justify-between bg-white border border-[#d1fae5] rounded px-3 py-3 mt-1">
                    <span className="text-[#047857] font-bold text-[18px] leading-7" style={{ fontFamily: 'Liberation Mono, monospace' }}>
                      DAC-2026-XXXX
                    </span>
                    <span className="material-symbols-outlined text-[#047857] text-[20px]">content_copy</span>
                  </div>
                </div>
              </div>

              {/* Filling Guidelines */}
              <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0f172a] text-[17px]">info</span>
                  <h3 className="text-[#0f172a] font-bold text-base leading-6">Filling Guidelines</h3>
                </div>
                <div className="flex flex-col gap-4">
                  {[
                    "Ensure the student's Roll Number is exact to fetch academic history automatically.",
                    "Select the most severe offense if multiple violations occurred.",
                    "Attach clear photographic evidence or signed witness statements for faster processing.",
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#f1f5f9] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#64748b] text-xs font-bold">{i + 1}</span>
                      </div>
                      <p className="text-[#475569] text-sm leading-5">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Logs */}
              <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[#0f172a] font-bold text-base leading-6">Recent Logs</h3>
                  <button className="text-[#1f3a89] text-xs font-semibold hover:underline">View All</button>
                </div>
                <div className="flex flex-col gap-1">
                  {[
                    {
                      name: 'Michael B. - Curfew',
                      id: 'DAC-2026-1041 • Pending',
                      iconBg: 'bg-[#ffedd5]',
                      icon: 'schedule',
                      iconColor: 'text-orange-500',
                    },
                    {
                      name: 'Sarah L. - Damage',
                      id: 'DAC-2026-1038 • Resolved',
                      iconBg: 'bg-[#dcfce7]',
                      icon: 'check_circle',
                      iconColor: 'text-green-600',
                    },
                  ].map((log) => (
                    <div key={log.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${log.iconBg}`}>
                        <span className={`material-symbols-outlined text-[14px] ${log.iconColor}`}>{log.icon}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[#0f172a] font-medium text-sm leading-5">{log.name}</span>
                        <span className="text-[#64748b] text-xs leading-4">{log.id}</span>
                      </div>
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