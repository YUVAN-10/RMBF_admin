export default function MemberFormStepper({ steps, currentStep }) {
  return (
    <div className="mb-6 flex items-center">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isComplete = index <= currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.key} className={["flex items-center", isLast ? "" : "flex-1"].join(" ")}>
            <div
              className={[
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
                isComplete ? "bg-secondary text-white" : "bg-border text-text-secondary",
              ].join(" ")}
            >
              <Icon size={17} strokeWidth={2} />
              <span className="sr-only">{step.label}</span>
            </div>

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
