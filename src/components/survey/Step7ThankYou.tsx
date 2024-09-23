'use client';

import { useSurvey } from '@/context/SurveyContext'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export default function Step7ThankYou() {
  const { surveyData, setCurrentStep, submitSurvey, submitError, setSubmitError } = useSurvey()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionComplete, setSubmissionComplete] = useState(false)

  useEffect(() => {
    const requiredFields = ['name', 'email', 'dateOfBirth', 'financialWellbeing', 'hasSavings', 'preferredTime', 'phoneNumber'];
    const missingFields = requiredFields.filter(field => !surveyData[field as keyof typeof surveyData]);

    if (missingFields.length > 0) {
      setSubmitError(`Missing required fields: ${missingFields.join(', ')}. Please go back and fill in all required information.`);
    } else {
      setSubmitError(null);
    }
  }, [surveyData, setSubmitError]);

  const handleSubmit = async () => {
    if (submitError) {
      return;
    }

    setIsSubmitting(true);
    try {
      await submitSurvey();
      setSubmissionComplete(true);
    } catch (error) {
      console.error('Error submitting survey:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    setCurrentStep(6);  // Go back to the last step
  };

  if (submissionComplete) {
    return (
      <div className="text-center space-y-spacing-md">
        <h2 className="text-2xl font-semibold text-foreground font-heading">Thank You, {surveyData.name}!</h2>
        <p className="text-foreground text-base">Your survey has been submitted successfully.</p>
        <p className="text-foreground text-base">We appreciate your time and input. One of our representatives will reach out to you soon at {surveyData.email}.</p>
        <p className="text-foreground text-base">Your preferred contact time: {surveyData.preferredTime}</p>
      </div>
    );
  }

  return (
    <div className="text-center space-y-spacing-md">
      <h2 className="text-2xl font-semibold text-foreground font-heading">Review and Submit</h2>
      {submitError ? (
        <div className="text-red-500">{submitError}</div>
      ) : (
        <p className="text-foreground text-base">Please review your information before submitting.</p>
      )}
      <Button onClick={handleSubmit} disabled={isSubmitting || !!submitError}>
        {isSubmitting ? 'Submitting...' : 'Submit Survey'}
      </Button>
      <Button onClick={handleGoBack} variant="outline">
        Go Back
      </Button>
    </div>
  );
}