'use client';

import SurveyLayout from '@/components/survey/SurveyLayout'
import { SurveyProvider } from '@/context/SurveyContext'
import SurveyStep from '@/components/survey/SurveyStep'

export default function Home() {
  return (
    <SurveyProvider>
      <SurveyLayout>
        <SurveyStep />
      </SurveyLayout>
    </SurveyProvider>
  )
}