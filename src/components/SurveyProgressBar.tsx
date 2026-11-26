import { Check } from 'lucide-react';
import { motion } from 'motion/react';

export interface ProgressStep {
  stepNumber: number;
  label: string;
}

interface SurveyProgressBarProps {
  currentStep: number;
  steps: ProgressStep[];
}

export function SurveyProgressBar({ currentStep, steps }: SurveyProgressBarProps) {
  const totalSteps = steps.length;
  const clampedStep = Math.min(Math.max(currentStep, 1), totalSteps);
  const progressRatio = clampedStep / totalSteps;
  const progressPercent = Math.round(progressRatio * 100);
  const activeStep = steps[clampedStep - 1];

  return (
    <div
      className="w-full"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-valuenow={clampedStep}
      aria-valuetext={`${totalSteps}단계 중 ${clampedStep}단계: ${activeStep?.label ?? ''}`}
    >
      {/* Top concise text indicator for instant mobile readability */}
      <div className="flex items-baseline justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#142220] whitespace-nowrap">
          <span className="tabular-nums text-teal-700">
            {clampedStep} / {totalSteps}
          </span>
          <span aria-hidden="true" className="text-slate-300">
            ·
          </span>
          <span>{activeStep?.label}</span>
        </div>

        <span className="text-xs font-semibold tabular-nums text-teal-700 whitespace-nowrap shrink-0">
          {progressPercent}%
        </span>
      </div>

      {/* Smooth animated progress track using GPU scaleX */}
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-teal-950/8">
        <motion.div
          className="h-full w-full origin-left rounded-full bg-teal-700"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progressRatio }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Compact step nodes directly aligned in one glance on mobile */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {steps.map((step) => {
          const isCompleted = step.stepNumber < clampedStep;
          const isCurrent = step.stepNumber === clampedStep;

          return (
            <div key={step.stepNumber} className="flex items-center gap-2 min-w-0">
              <motion.span
                initial={false}
                animate={{
                  scale: isCurrent ? 1.05 : 1,
                }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums transition-colors duration-200 ${
                  isCompleted
                    ? 'bg-teal-700 text-white'
                    : isCurrent
                      ? 'bg-teal-50 text-teal-800 ring-2 ring-teal-700'
                      : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" /> : step.stepNumber}
              </motion.span>
              <span
                className={`truncate text-xs transition-colors duration-200 ${
                  isCurrent
                    ? 'font-semibold text-[#142220]'
                    : isCompleted
                      ? 'font-medium text-teal-800'
                      : 'font-normal text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
