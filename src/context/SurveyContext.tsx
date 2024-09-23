import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import axios from 'axios';

export interface SurveyData {
  name?: string;
  email?: string;
  dateOfBirth?: string;
  primaryInvestmentGoals?: string[];
  secondaryInvestmentGoals?: string[];
  financialWellbeing?: number;
  hasSavings?: number;
  monthlySavings?: number;
  preferredTime?: string;
  preferredDay?: string;
  phoneNumber?: string;
  additionalInfo?: string;
}

interface SurveyContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isStepValid: boolean;
  setIsStepValid: (valid: boolean) => void;
  surveyData: SurveyData;
  updateSurveyData: (data: Partial<SurveyData>) => void;
  submitError: string | null;
  setSubmitError: (error: string | null) => void;
  submitSurvey: () => Promise<void>;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export function SurveyProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isStepValid, setIsStepValid] = useState(false);
  const [surveyData, setSurveyData] = useState<SurveyData>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateSurveyData = useCallback((data: Partial<SurveyData>) => {
    setSurveyData((prevData) => ({ ...prevData, ...data }));
  }, []);

  const submitSurvey = async () => {
    try {
      const response = await axios.post('/api/submit-survey', {
        ...surveyData,
        financialWellbeing: parseFloat(surveyData.financialWellbeing?.toString() || '0'),
        hasSavings: parseFloat(surveyData.hasSavings?.toString() || '0'),
        monthlySavings: parseFloat(surveyData.monthlySavings?.toString() || '0'),
      });
      if (response.status === 200) {
        setSubmitError(null);
        return response.data;
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      setSubmitError('Failed to submit survey. Please try again.');
    }
  };

  return (
    <SurveyContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        isStepValid,
        setIsStepValid,
        surveyData,
        updateSurveyData,
        submitError,
        setSubmitError,
        submitSurvey,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
}

export function useSurvey() {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
}
