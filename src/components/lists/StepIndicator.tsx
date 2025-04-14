
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
      <ol className="flex items-center w-full md:w-[70%]">
        {steps.map((step, index) => (
          <li key={step.id} className={`relative flex flex-col items-center ${
            index < steps.length - 1 ? "flex-1" : ""
          }`}>
            {/* Step Circle */}
            {step.id < currentStep ? (
              <div className="z-10 flex items-center justify-center w-8 h-8 rounded-full bg-primary mb-2">
                <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
              </div>
            ) : step.id === currentStep ? (
              <div className="z-10 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium mb-2">
                {step.id}
              </div>
            ) : (
              <div className="z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 border-muted bg-background text-muted-foreground font-medium mb-2">
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
            
            {/* Line connecting to next step */}
            {index < steps.length - 1 && (
              <div 
                className={`absolute top-4 -right-1/2 w-full h-0.5 ${
                  currentStep > index + 1 ? "bg-primary" : "bg-muted"
                }`} 
                style={{ left: '50%' }}
              />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
