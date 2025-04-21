
import { useNavigate } from "react-router-dom";
import { useListCreation, ListCreationProvider } from "@/contexts/ListCreationContext";
import StepIndicator from "@/components/lists/StepIndicator";
import StepNavigation from "@/components/lists/StepNavigation";
import ConfigureListStep from "@/components/lists/steps/ConfigureListStep";
import GetDataStep from "@/components/lists/steps/GetDataStep";
import ReviewStep from "@/components/lists/steps/ReviewStep";
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
  
  const getHeaderTitle = () => {
    if (currentStep === 1 || !listData.name.trim()) {
      return "Create New List";
    }
    return listData.name;
  }
  
  const handleNext = () => {
    if (currentStep === 1) {
      if (!listData.name.trim()) {
        toast.error("Please enter a list name");
        return;
      }
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 2) {
      if (contactData.length === 0) {
        toast.error("Please upload a valid CSV file");
        return;
      }
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3 && isComplete) {
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
      return contactData.length === 0;
    }
    if (currentStep === 3) {
      return !isComplete;
    }
    return false;
  };
  
  return (
    <div className="container p-6 flex flex-col min-h-[calc(100vh-64px)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 items-center">
        <div className="flex justify-start md:justify-start items-center">
          <PageHeader title={getHeaderTitle()} className="mb-0" />
        </div>
        <div className="flex justify-center">
          <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        </div>
      </div>
      
      <div className="py-4 flex-grow overflow-auto">
        {currentStep === 1 && <ConfigureListStep />}
        {currentStep === 2 && <GetDataStep />}
        {currentStep === 3 && <ReviewStep />}
      </div>
      
      <div className="mt-6 mb-2">
        <StepNavigation 
          currentStep={currentStep} 
          totalSteps={TOTAL_STEPS} 
          onNext={handleNext} 
          onPrevious={handlePrevious}
          isNextDisabled={isNextDisabled()}
          nextLabel={currentStep === 3 && isComplete ? "Finish" : "Next"}
        />
      </div>
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

