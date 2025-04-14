
import { CheckCircle2 } from "lucide-react";

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
    <div className="w-full my-8 flex justify-center">
      <div className="relative flex justify-between w-full md:w-[70%]">
        {/* Connector Lines - correctly positioned to connect between steps */}
        <div 
          className="absolute top-4 h-0.5 bg-muted z-0 w-full" 
        />
        
        {/* Progress Line - adjusted to match full width and progress */}
        <div 
          className="absolute top-4 h-0.5 bg-primary z-0 transition-all duration-500" 
          style={{ 
            width: `${(Math.max(0, currentStep - 1) / (steps.length - 1)) * 100}%` 
          }} 
        />
        
        {/* Steps */}
        {steps.map((step) => (
          <div key={step.id} className="z-10 flex flex-col items-center">
            {/* Step Circle */}
            {step.id < currentStep ? (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mb-2">
                <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
              </div>
            ) : step.id === currentStep ? (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium mb-2">
                {step.id}
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full border-2 border-muted bg-background flex items-center justify-center text-muted-foreground font-medium mb-2">
                {step.id}
              </div>
            )}
            
            {/* Step Label */}
            <span 
              className={`text-sm ${
                step.id === currentStep 
                  ? "font-medium text-foreground" 
                  : step.id < currentStep 
                    ? "text-primary" 
                    : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

