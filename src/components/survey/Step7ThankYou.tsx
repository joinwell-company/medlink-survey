'use client';

import { useSurvey } from '@/context/SurveyContext'

export default function Step7ThankYou() {
  const { surveyData, resetSurvey } = useSurvey()

  return <ThankYouMessage surveyData={surveyData} resetSurvey={resetSurvey} />
}

function ThankYouMessage({ surveyData, resetSurvey }: { surveyData: any, resetSurvey: () => void }) {
  return (
    <div className="text-center space-y-spacing-md">
      <h2 className="text-2xl font-semibold text-foreground font-heading">Thank You, {surveyData.name}!</h2>
      <p className="text-foreground text-base">Your survey has been submitted successfully.</p>
      <p className="text-foreground text-base">We appreciate your time and input. One of our representatives will reach out to you soon at {surveyData.email}.</p>
      <p className="text-foreground text-base">Your preferred contact time: {surveyData.preferredTime} on {surveyData.preferredDay}</p>
      <button 
        onClick={resetSurvey}
        className="mt-6 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
      >
        Return to Homepage
      </button>
    </div>
  )
}