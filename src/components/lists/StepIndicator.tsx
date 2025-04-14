
import { CheckCircle2 } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const steps = [
    { id: 1, label: "Configure List" },
    { id: 2, label: "Get Data" },
    { id: 3, label: "Review" },
  ];

  return (
    <div className="w-full my-8 flex justify-center">
      <ol className="flex items-center justify-between w-full md:w-[70%]">
        {steps.map((step, index) => (
          <li 
            key={step.id} 
            className="relative flex flex-col items-center"
            style={{ 
              width: '33.333%', 
              // First item aligns left, last item aligns right, middle item centered
              textAlign: index === 0 ? 'left' : index === steps.length - 1 ? 'right' : 'center'
            }}
          >
            {/* Horizontal line - only between items */}
            {index > 0 && (
              <div 
                className={`absolute top-4 h-0.5 -left-1/2 w-full ${
                  step.id <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
            
            {/* Step Circle */}
            <div className="relative z-10 flex items-center justify-center">
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
            </div>
            
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
          </li>
        ))}
      </ol>
    </div>
  );
}
