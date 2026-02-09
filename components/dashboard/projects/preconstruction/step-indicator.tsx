import { STEP_DEFINITIONS, type StepDefinition } from "@/lib/preconstruction";

type StepIndicatorProps = {
  currentStep: number;
  steps?: StepDefinition[];
};

export const StepIndicator = ({ currentStep, steps = STEP_DEFINITIONS }: StepIndicatorProps) => {
  const totalSteps = steps.length || 1;
  const safeCurrentStep = Math.min(Math.max(currentStep, 1), totalSteps);
  const progressPercent = Math.round((safeCurrentStep / totalSteps) * 100);

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4 shadow-sm">
      <div className="flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span className="font-medium text-foreground">
          Step {safeCurrentStep} of {totalSteps}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-foreground" aria-hidden="true" />
          {progressPercent}% complete
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-foreground transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <ol
        className="flex w-full gap-3 overflow-x-auto pb-2 sm:flex-col sm:gap-0 sm:space-y-3 sm:overflow-visible snap-x snap-mandatory"
        style={{ scrollbarWidth: "thin" }}
      >
        {steps.map((stepDef, index) => {
          const stepNumber = index + 1;
          const isActive = safeCurrentStep === stepNumber;
          const isComplete = safeCurrentStep > stepNumber;
          const itemKey = stepDef.id ?? `${stepNumber}-${stepDef.title}`;
          const itemBorder = isActive
            ? "border-border"
            : isComplete
            ? "border-border"
            : "border-border";
          const itemBackground = isActive
            ? "bg-muted shadow-sm"
            : isComplete
            ? "bg-muted/50"
            : "bg-card";
          return (
            <li
              key={itemKey}
              className={`min-w-[180px] flex-shrink-0 snap-start rounded-lg border ${itemBorder} ${itemBackground} flex items-start gap-3 p-3 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-w-0`}
              tabIndex={0}
            >
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                  isComplete
                    ? "border-foreground bg-foreground text-background"
                    : isActive
                    ? "border-foreground text-foreground"
                    : "border-muted-foreground/40 text-muted-foreground"
                }`}
                aria-label={
                  isActive ? "Current step" : `Step ${stepNumber} indicator`
                }
              >
                {isComplete ? "✓" : stepNumber}
              </div>
              <div>
                <p
                  className={`text-sm font-medium ${
                    isActive || isComplete
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {stepDef.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stepDef.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
