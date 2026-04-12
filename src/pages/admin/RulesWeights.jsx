const RULES = [
  { id: 'R-401', name: 'Plagiarism – First Offense',      weight: 70, severity: 'High',     category: 'Academic' },
  { id: 'R-402', name: 'Plagiarism – Repeat Offense',     weight: 90, severity: 'Critical', category: 'Academic' },
  { id: 'R-105', name: 'Recidivism Multiplier',           weight: 85, severity: 'Critical', category: 'Behaviour'},
  { id: 'R-210', name: 'Vandalism / Property Damage',     weight: 65, severity: 'High',     category: 'Conduct'  },
  { id: 'R-115', name: 'Attendance Violation',            weight: 30, severity: 'Low',      category: 'Academic' },
  { id: 'R-317', name: 'Substance Abuse',                 weight: 75, severity: 'High',     category: 'Conduct'  },
  { id: 'R-204', name: 'Exam Malpractice',                weight: 80, severity: 'Critical', category: 'Academic' },
  { id: 'R-301', name: 'Disruption / Misconduct',         weight: 45, severity: 'Medium',   category: 'Behaviour'},
];

const severityColors = {
  Critical: 'bg-red-100 text-red-700',
  High:     'bg-orange-100 text-orange-700',
  Medium:   'bg-yellow-100 text-yellow-700',
  Low:      'bg-slate-100 text-slate-600',
};

export default function RulesWeights() {
  return (
    <div className="space-y-6 max-w-5xl">

      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#0f172a]">Rules &amp; Weight Management</h3>
          <p className="text-sm text-[#64748b] mt-0.5">
            Configure the scoring rules and their severity weights used during case evaluation.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#4f46e5] hover:bg-[#162d6b] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Rule
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Rules',    value: RULES.length, icon: 'rule',          color: 'text-[#4f46e5]', bg: 'bg-[#eef2fb]' },
          { label: 'Critical',       value: RULES.filter(r => r.severity === 'Critical').length, icon: 'crisis_alert', color: 'text-red-600',      bg: 'bg-red-50'    },
          { label: 'High',           value: RULES.filter(r => r.severity === 'High').length,     icon: 'warning',      color: 'text-orange-600',   bg: 'bg-orange-50' },
          { label: 'Avg Weight',     value: Math.round(RULES.reduce((s, r) => s + r.weight, 0) / RULES.length), icon: 'scale', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(({ label, value, icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-[#e2e8f0] p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
              <span className={`material-symbols-outlined text-[20px] ${color}`}>{icon}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0f172a]">{value}</p>
              <p className="text-xs text-[#64748b]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Rules table */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-[#e2e8f0]">
                {['Rule ID', 'Rule Name', 'Category', 'Weight', 'Severity', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {RULES.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="px-5 py-4">
                    <span className="font-mono text-sm text-[#64748b]">{rule.id}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-[#0f172a]">{rule.name}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-[#64748b]">{rule.category}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-28 h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#4f46e5] rounded-full"
                          style={{ width: `${rule.weight}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-[#0f172a] w-8">{rule.weight}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${severityColors[rule.severity]}`}>
                      {rule.severity}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-[#64748b] hover:text-[#4f46e5] hover:bg-[#eef2fb] rounded-lg transition-colors" title="Edit">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button className="p-1.5 text-[#64748b] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
