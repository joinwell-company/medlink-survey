'use client';

import { useState, useEffect } from 'react';
import { useSurvey } from '@/context/SurveyContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Step4FinancialWellbeing() {
  const { updateSurveyData, setIsStepValid } = useSurvey();
  const [financialWellbeing, setFinancialWellbeing] = useState('');
  const [hasSavings, setHasSavings] = useState('');
  const [monthlySavings, setMonthlySavings] = useState('');

  const validateNumber = (value: string) => {
    return value !== '' && !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
  };

  useEffect(() => {
    const isFinancialWellbeingValid = validateNumber(financialWellbeing);
    const isHasSavingsValid = validateNumber(hasSavings);
    const isMonthlySavingsValid = validateNumber(monthlySavings);

    const isValid = isFinancialWellbeingValid && isHasSavingsValid && isMonthlySavingsValid;
    setIsStepValid(isValid);

    if (isValid) {
      updateSurveyData({
        financialWellbeing: parseFloat(financialWellbeing),
        hasSavings: parseFloat(hasSavings),
        monthlySavings: parseFloat(monthlySavings),
      });
    }
  }, [financialWellbeing, hasSavings, monthlySavings, setIsStepValid, updateSurveyData]);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d*(\.\d*)?$/.test(value)) {
      setter(value);
    }
  };

  return (
    <form className="space-y-6">
      <div>
        <Label htmlFor="financial-wellbeing">How much money do you have saved right now? ($)</Label>
        <Input
          id="financial-wellbeing"
          type="text"
          inputMode="decimal"
          value={financialWellbeing}
          onChange={handleInputChange(setFinancialWellbeing)}
          placeholder="0.00"
          required
        />
      </div>

      <div>
        <Label htmlFor="has-savings">How much money do you think you could save in 12 months? ($)</Label>
        <Input
          id="has-savings"
          type="text"
          inputMode="decimal"
          value={hasSavings}
          onChange={handleInputChange(setHasSavings)}
          placeholder="0.00"
          required
        />
      </div>

      <div>
        <Label htmlFor="monthly-savings">How much superannuation do you currently have? ($)</Label>
        <Input
          id="monthly-savings"
          type="text"
          inputMode="decimal"
          value={monthlySavings}
          onChange={handleInputChange(setMonthlySavings)}
          placeholder="0.00"
          required
        />
      </div>
    </form>
  );
}
