
import { createContext, useContext, useState, ReactNode } from "react";

export type ListData = {
  name: string;
  description: string;
  team_id?: number;
};

export type DataSourceOption = "csv" | "manual" | "api";

type ListCreationContextType = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  listData: ListData;
  updateListData: (data: Partial<ListData>) => void;
  dataSource: DataSourceOption | null;
  setDataSource: (source: DataSourceOption | null) => void;
  contactData: any[];
  setContactData: (data: any[]) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  isComplete: boolean;
  setIsComplete: (complete: boolean) => void;
};

const ListCreationContext = createContext<ListCreationContextType | undefined>(undefined);

export const ListCreationProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [listData, setListData] = useState<ListData>({ name: "", description: "" });
  const [dataSource, setDataSource] = useState<DataSourceOption | null>(null);
  const [contactData, setContactData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const updateListData = (data: Partial<ListData>) => {
    setListData((prev) => ({ ...prev, ...data }));
  };

  return (
    <ListCreationContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        listData,
        updateListData,
        dataSource,
        setDataSource,
        contactData,
        setContactData,
        isProcessing,
        setIsProcessing,
        isComplete,
        setIsComplete,
      }}
    >
      {children}
    </ListCreationContext.Provider>
  );
};

export const useListCreation = () => {
  const context = useContext(ListCreationContext);
  if (context === undefined) {
    throw new Error("useListCreation must be used within a ListCreationProvider");
  }
  return context;
};
