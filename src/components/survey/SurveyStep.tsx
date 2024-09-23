import { useEffect, useState } from 'react';
import { useSurvey } from '@/context/SurveyContext';
import Step1Introduction from './Step1Introduction';
import Step2PersonalInfo from './Step2PersonalInfo';
import Step3InvestmentGoals from './Step3InvestmentGoals';
import Step4FinancialWellbeing from './Step4FinancialWellbeing';
import Step5ContactInfo from './Step5ContactInfo';
import Step6ScheduleContact from './Step6ScheduleContact';
import Step7ThankYou from './Step7ThankYou';
import { NavigationButtons } from '@/components/ui/NavigationButtons';

export default function SurveyStep() {
  const { currentStep, setCurrentStep, isStepValid, surveyData, setSubmitError } = useSurvey();
  const [isStep3FirstPart, setIsStep3FirstPart] = useState(true);

  useEffect(() => {
    setSubmitError(null);
  }, [currentStep, setSubmitError]);

  const handleBack = () => {
    if (currentStep === 3 && !isStep3FirstPart) {
      setIsStep3FirstPart(true);
    } else {
      setCurrentStep(currentStep > 1 ? currentStep - 1 : 1);
    }
  };

  const handleNext = () => {
    if (isStepValid) {
      const requiredFields: { [key: number]: string[] } = {
        2: ['name'],
        4: ['financialWellbeing', 'hasSavings', 'monthlySavings'],
        5: ['email', 'dateOfBirth'],
        6: ['preferredTime', 'phoneNumber']
      };

      const currentRequiredFields = requiredFields[currentStep] || [];
      const missingFields = currentRequiredFields.filter(field => !surveyData[field as keyof typeof surveyData]);

      if (missingFields.length > 0) {
        setSubmitError(`Please fill in the following fields: ${missingFields.join(', ')}`);
      } else {
        if (currentStep === 3) {
          if (isStep3FirstPart) {
            setIsStep3FirstPart(false);
          } else {
            setCurrentStep(4);
          }
        } else {
          setCurrentStep(currentStep < 7 ? currentStep + 1 : 7);
        }
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1Introduction onNext={handleNext} />;
      case 2: return <Step2PersonalInfo />;
      case 3: return (
        <Step3InvestmentGoals 
          isFirstPart={isStep3FirstPart} 
          onComplete={() => setIsStep3FirstPart(false)} 
        />
      );
      case 4: return <Step4FinancialWellbeing />;
      case 5: return <Step5ContactInfo />;
      case 6: return <Step6ScheduleContact />;
      case 7: return <Step7ThankYou />;
      default: return null;
    }
  };

  return (
    <div>
      {renderStep()}
      {currentStep !== 1 && (
        <NavigationButtons
          onBack={handleBack}
          onNext={handleNext}
          showBack={currentStep > 1}
          nextDisabled={!isStepValid}
          nextText={currentStep === 7 ? "Submit" : "Next"}
        />
      )}
    </div>
  );
}