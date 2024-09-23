'use client';

import { useEffect } from 'react';
import { useSurvey } from '@/context/SurveyContext';

export default function Step1Introduction() {
  const { setIsStepValid } = useSurvey();

  useEffect(() => {
    // Set the step as valid immediately since it's just an introduction
    setIsStepValid(true);
  }, [setIsStepValid]);

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-4">
        Welcome to Medlink Survey
      </h2>
      <p className="mb-6 text-foreground">
        Wealthy people use their investments to pay for their lifestyle.
        Now we&apos;re bringing this to you too.
        Answer a few questions about yourself and we will pair you with a solution that might just be right for you.
      </p>
    </div>
  );
}