
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  isNextDisabled?: boolean;
  nextLabel?: string;
}

export default function StepNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  isNextDisabled = false,
  nextLabel = "Next"
}: StepNavigationProps) {
  return (
    <div className="flex justify-between mt-8">
      {currentStep > 1 ? (
        <Button variant="outline" onClick={onPrevious}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
      ) : (
        <div />
      )}
      
      <Button 
        onClick={onNext} 
        disabled={isNextDisabled}
        variant="default"
        className={!isNextDisabled && currentStep === totalSteps ? "bg-primary hover:bg-primary/90 animate-pulse" : ""}
      >
        {nextLabel}
        {currentStep < totalSteps && <ChevronRight className="ml-2 h-4 w-4" />}
      </Button>
    </div>
  );
}
