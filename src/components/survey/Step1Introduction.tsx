'use client';

import { useEffect } from 'react';
import { useSurvey } from '@/context/SurveyContext';
import { NavigationButtons } from '@/components/ui/NavigationButtons';

export default function Step1Introduction({ onNext }: { onNext: () => void }) {
  const { setIsStepValid } = useSurvey();

  useEffect(() => {
    // Set the step as valid immediately since it's just an introduction
    setIsStepValid(true);
  }, [setIsStepValid]);

  return (
    <div className="p-8 pt-12 border border-gray-300 rounded-tl-[2rem] h-[380px] font-sf-pro">
      <div className="flex flex-col align-around items-start">    
        <h2 className="text-2xl font-semibold mb-4 text-left">
          Welcome to Medlink Survey
        </h2>
        <p className="mb-6 text-foreground text-left leading-relaxed max-w-[35rem]">
          Wealthy people use their investments to pay for their lifestyle.
        </p>
        <p className="mb-6 text-foreground text-left leading-relaxed max-w-[35rem]">
          Now we&apos;re bringing this to you too.
        </p>
        <p className="mb-4 text-foreground text-left leading-relaxed max-w-[35rem]">
          Answer a few questions about yourself and we will pair you with a solution that might just be right for you.
        </p>
        <div className="mt-1">
          <NavigationButtons
            onBack={() => {}}
            onNext={onNext}
            showBack={false}
            nextDisabled={false}
            nextText="Get Started"
          />
        </div>
      </div>
    </div>
  );
}
