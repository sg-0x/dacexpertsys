export default function PastRecordsTable({
  title = 'Past Disciplinary Records',
  records = [],
  loading = false,
  error = '',
  onViewAll,
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f5f9]">
        <h3 className="text-base font-bold text-[#0f172a]">{title}</h3>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-semibold text-[#4f46e5] hover:text-[#4338ca]"
          >
            View All
          </button>
        )}
      </div>

      {loading ? (
        <div className="px-6 py-6 text-sm text-[#64748b]">Loading records...</div>
      ) : error ? (
        <div className="px-6 py-6 text-sm text-red-600">Error: {error}</div>
      ) : records.length === 0 ? (
        <div className="px-6 py-6 text-sm text-[#64748b]">No records found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#f1f5f9]">
                {['Token ID', 'Student Name', 'Offense', 'Status', 'Date'].map((heading) => (
                  <th key={heading} className="px-5 py-3 text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8fafc]">
              {records.map((row) => (
                <tr key={row.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs text-[#64748b]">{row.token}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#0f172a]">{row.studentName}</td>
                  <td className="px-5 py-3.5 text-sm text-[#334155]">{row.offense}</td>
                  <td className="px-5 py-3.5 text-sm text-[#334155]">{row.status}</td>
                  <td className="px-5 py-3.5 text-sm text-[#64748b]">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
