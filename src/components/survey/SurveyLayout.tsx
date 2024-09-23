import { ReactNode } from 'react';
import { Progress } from '@/components/ui/progress';
import { useSurvey } from '@/context/SurveyContext';
import Image from 'next/image';

interface SurveyLayoutProps {
  children: ReactNode;
}

export default function SurveyLayout({ children }: SurveyLayoutProps) {
  const { currentStep } = useSurvey();
  const totalSteps = 7;

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans relative">
      <header className="w-full bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Image src="/logo.svg" alt="Medlink Logo" width={150} height={150} className="mr-4" />
        </div>
        {currentStep > 1 && currentStep < totalSteps && (
          <div className="relative w-full pb-8">
            <div className="relative w-full">
              <Progress value={((currentStep - 1) / (totalSteps - 1)) * 100} className="w-full h-2" />
              <div
                className="absolute top-1/2 transform -translate-y-1/2"
                style={{ left: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
              >
                <div className="w-4 h-4 bg-neutral-900 rounded-full border-2 border-white" />
              </div>
            </div>
            <div
              className="absolute mt-4 transform -translate-x-1/2"
              style={{ left: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            >
              <div className="bg-neutral-200 text-neutral-800 px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                {currentStep - 1}/{totalSteps - 1}
              </div>
            </div>
          </div>
        )}
      </header>
      <main className={`flex-grow flex ${currentStep === 1 ? 'items-start justify-start' : 'items-center justify-center'}`}>
        {currentStep === 1 ? (
          <div className="flex w-full">
            <div className="w-full max-w-2xl ml-16 mt-16">
              <div className="bg-card text-card-foreground p-spacing-lg rounded-lg shadow-md">
                {children}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center ml-8">
              <Image src="/doctor.svg" alt="Doctor" width={150} height={150} className="mb-4 absolute" style={{ right: '500px', bottom: '350px' }} />
              <Image src="/green.svg" alt="Green" width={150} height={150} className="mb-4 absolute" style={{ right: '500px', bottom: '50px' }} />
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md">
            <div className="bg-card text-card-foreground p-spacing-lg rounded-lg shadow-md">
              {children}
            </div>
          </div>
        )}
      </main>
      <footer className="w-9/12 mx-auto mb-4 z-10 relative">
        <div className="bg-[#F2F2F2] rounded-lg p-4 shadow flex items-center justify-between">
          <div className="text-gray-400 text-xs">
            © 2024 Medlink. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <a href="#" className="underline text-sm text-gray-600 hover:text-gray-800">Terms & Conditions</a>
            <a href="#" className="underline text-sm text-gray-600 hover:text-gray-800">Privacy Policy</a>
          </div>
        </div>
      </footer>
      {currentStep === 1 ? (
        <div className="absolute bottom-0 right-0 mb-4 mr-4">
          <Image src="/mbold.svg" alt="Mbold" width={300} height={300} />
        </div>
      ) : (
        <div className="absolute bottom-0 right-0 mb-4 mr-4">
          <Image src="/mfaded.svg" alt="Mfaded" width={300} height={300} />
        </div>
      )}
      {currentStep === 1 && (
        <div className="absolute right-20 mr-20" style={{ bottom: '350px' }}>
          <Image src="/trolley.svg" alt="Trolley" width={155} height={155} />
        </div>
      )}
    </div>
  );
}