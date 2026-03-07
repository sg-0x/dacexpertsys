import { HiCheck } from 'react-icons/hi';

export default function ProgressBar({ steps, currentStep }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={index} className="flex items-center flex-1 last:flex-none">
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-[#1f3a89] text-white shadow-md shadow-[#1f3a89]/30'
                      : isCurrent
                        ? 'bg-[#1f3a89] text-white shadow-lg shadow-[#1f3a89]/40 ring-4 ring-[#1f3a89]/20'
                        : 'bg-[#f1f5f9] text-[#94a3b8] border-2 border-[#e2e8f0]'
                  }`}
                >
                  {isCompleted ? <HiCheck className="w-5 h-5" /> : index + 1}
                </div>
                <span
                  className={`mt-2 text-xs font-medium text-center max-w-[80px] ${
                    isCurrent ? 'text-[#1f3a89]' : isCompleted ? 'text-[#0f172a]' : 'text-[#94a3b8]'
                  }`}
                >
                  {step}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2 mt-[-20px]">
                  <div className="h-1 rounded-full bg-[#f1f5f9] overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-[#1f3a89] transition-all duration-500 ${
                        isCompleted ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
