
import { useNavigate } from "react-router-dom";
import { useListCreation, ListCreationProvider } from "@/contexts/ListCreationContext";
import StepIndicator from "@/components/lists/StepIndicator";
import StepNavigation from "@/components/lists/StepNavigation";
import ConfigureListStep from "@/components/lists/steps/ConfigureListStep";
import GetDataStep from "@/components/lists/steps/GetDataStep";
import ProcessStep from "@/components/lists/steps/ProcessStep";
import PageHeader from "@/components/dashboard/PageHeader";
import { toast } from "sonner";

function CreateListContent() {
  const navigate = useNavigate();
  const { 
    currentStep, 
    setCurrentStep, 
    listData, 
    dataSource, 
    isComplete,
    contactData
  } = useListCreation();
  
  const TOTAL_STEPS = 3;
  
  // Determine the header title based on the current step and list name
  const getHeaderTitle = () => {
    if (currentStep === 1 || !listData.name.trim()) {
      return "Create New List";
    }
    return listData.name;
  }
  
  const handleNext = () => {
    if (currentStep === 1) {
      // Validate first step
      if (!listData.name.trim()) {
        toast.error("Please enter a list name");
        return;
      }
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 2) {
      // Validate second step
      if (!dataSource) {
        toast.error("Please select a data source");
        return;
      }
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3 && isComplete) {
      // Go back to lists page
      navigate("/dashboard/lists");
      toast.success(`List "${listData.name}" created successfully!`);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const isNextDisabled = () => {
    if (currentStep === 1) {
      return !listData.name.trim();
    }
    if (currentStep === 2) {
      // Enable next button if there's contact data (file is uploaded)
      return !dataSource || contactData.length === 0;
    }
    if (currentStep === 3) {
      return !isComplete;
    }
    return false;
  };
  
  return (
    <div className="container p-6">
      <PageHeader title={getHeaderTitle()} />
      
      <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      
      <div className="py-4">
        {currentStep === 1 && <ConfigureListStep />}
        {currentStep === 2 && <GetDataStep />}
        {currentStep === 3 && <ProcessStep />}
      </div>
      
      <StepNavigation 
        currentStep={currentStep} 
        totalSteps={TOTAL_STEPS} 
        onNext={handleNext} 
        onPrevious={handlePrevious}
        isNextDisabled={isNextDisabled()}
        nextLabel={currentStep === 3 && isComplete ? "Finish" : "Next"}
      />
    </div>
  );
}

export default function CreateList() {
  return (
    <ListCreationProvider>
      <CreateListContent />
    </ListCreationProvider>
  );
}
