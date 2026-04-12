export default function ProgressBar({ steps, currentStep }) {
  const percentage = steps.length <= 1 ? 100 : Math.round((currentStep / (steps.length - 1)) * 100);
  const currentLabel = steps[currentStep] ?? steps[steps.length - 1];

  return (
    <div className="w-full space-y-2">
      {/* Labels row */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-[#4f46e5] truncate">{currentLabel}</span>
        <span className="text-[#64748b] font-medium whitespace-nowrap ml-2">
          Step {currentStep + 1} of {steps.length}
        </span>
      </div>

      {/* Bar track */}
      <div className="relative h-5 rounded-full bg-[#e2e8f0] overflow-hidden shadow-inner">
        {/* Filled portion */}
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#4f46e5] to-[#3b5fc0] transition-all duration-500 ease-in-out flex items-center justify-end pr-2"
          style={{ width: `${Math.max(percentage, 4)}%` }}
        >
          {percentage >= 12 && (
            <span className="text-white text-xs font-bold leading-none">{percentage}%</span>
          )}
        </div>

        {/* Percentage shown outside bar when bar is too short */}
        {percentage < 12 && (
          <span
            className="absolute top-1/2 -translate-y-1/2 text-xs font-bold text-[#4f46e5]"
            style={{ left: `calc(${Math.max(percentage, 4)}% + 6px)` }}
          >
            {percentage}%
          </span>
        )}
      </div>

      {/* Step names row */}
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <span
            key={index}
            className={`text-[10px] font-medium text-center transition-colors duration-300 ${index < currentStep
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
