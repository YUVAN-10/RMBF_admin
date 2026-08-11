export default function MemberFormStepper({ steps, currentStep, onStepClick }) {
  return (
    <div className="mb-6 flex items-center">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isComplete = index <= currentStep;
        const isCurrent = index === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.key} className={["flex items-center", isLast ? "" : "flex-1"].join(" ")}>
            <button
              type="button"
              onClick={() => onStepClick && onStepClick(index)}
              title={step.label}
              className={[
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                isCurrent
                  ? "bg-primary text-white ring-2 ring-primary ring-offset-2 shadow-sm"
                  : isComplete
                  ? "bg-secondary text-white hover:bg-secondary/90 cursor-pointer"
                  : "bg-border text-text-secondary hover:bg-border/80 cursor-pointer",
              ].join(" ")}
            >
              <Icon size={17} strokeWidth={2} />
              <span className="sr-only">{step.label}</span>
            </button>

            {!isLast && (
              <div
                className={[
                  "mx-2 h-0.5 flex-1 transition-colors",
                  index < currentStep ? "bg-secondary" : "bg-border",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
