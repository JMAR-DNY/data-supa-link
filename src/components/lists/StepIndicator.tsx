
import { CheckCircle2, Circle } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const steps = [
    { id: 1, label: "Configure List" },
    { id: 2, label: "Get Data" },
    { id: 3, label: "Process" },
  ];

  return (
    <div className="w-full my-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative">
            <div className="flex items-center gap-2">
              {step.id < currentStep ? (
                <CheckCircle2 className="h-6 w-6 text-primary" />
              ) : step.id === currentStep ? (
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium">
                  {step.id}
                </div>
              ) : (
                <Circle className="h-6 w-6 text-muted-foreground" />
              )}
              <span className={`text-sm hidden sm:block ${step.id === currentStep ? "font-medium" : "text-muted-foreground"}`}>
                {step.label}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div className="absolute top-3 left-[calc(100%+0.5rem)] w-[calc(100%-1rem)] h-[2px] bg-muted">
                <div 
                  className="h-full bg-primary transition-all duration-300" 
                  style={{ width: currentStep > step.id ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 sm:hidden">
        {steps.map((step) => (
          <span 
            key={step.id}
            className={`text-xs ${step.id === currentStep ? "font-medium" : "text-muted-foreground"}`}
          >
            {step.label}
          </span>
        ))}
      </div>
    </div>
  );
}
