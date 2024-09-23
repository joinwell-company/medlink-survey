import { ReactNode } from 'react'
import { Progress } from '@/components/ui/progress'
import { useSurvey } from '@/context/SurveyContext'

interface SurveyLayoutProps {
  children: ReactNode
}

export default function SurveyLayout({ children }: SurveyLayoutProps) {
  const { currentStep } = useSurvey()
  const totalSteps = 7

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <header className="w-full bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-foreground font-heading">Medlink</h1>
        </div>
        {currentStep < totalSteps && (
          <div className="relative w-full pb-8">
            <div className="relative w-full">
              <Progress value={(currentStep / totalSteps) * 100} className="w-full h-2" />
              <div 
                className="absolute top-1/2 transform -translate-y-1/2" 
                style={{ left: `${(currentStep / totalSteps) * 100}%` }}
              >
                <div className="w-4 h-4 bg-neutral-900 rounded-full border-2 border-white" />
              </div>
            </div>
            <div 
              className="absolute mt-4 transform -translate-x-1/2" 
              style={{ left: `${(currentStep / totalSteps) * 100}%` }}
            >
              <div className="bg-neutral-200 text-neutral-800 px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                {currentStep}/{totalSteps}
              </div>
            </div>
          </div>
        )}
      </header>
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-card text-card-foreground p-spacing-lg rounded-lg shadow-md">
            {children}
          </div>
        </div>
      </main>
      <footer className="w-full text-center py-4 text-sm text-muted-foreground">
        <a href="#" className="underline">Terms & Conditions</a>
        {' | '}
        <a href="#" className="underline">Privacy Policy</a>
      </footer>
    </div>
  )
}