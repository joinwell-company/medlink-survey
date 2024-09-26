import { ReactNode } from 'react';
import { Progress } from '@/components/ui/progress';
import { useSurvey } from '@/context/SurveyContext';
import Image from 'next/image';
import styles from './SurveyLayout.module.css';
import { NavigationButtons } from '@/components/ui/NavigationButtons';

interface SurveyLayoutProps {
  children: ReactNode;
  progressThickness?: string;
  onSubmit?: () => Promise<boolean>;
}

export default function SurveyLayout({ children, onSubmit }: SurveyLayoutProps) {
  const { currentStep, setCurrentStep, isStepValid, surveyData } = useSurvey();

  const handleNext = async () => {
    if (currentStep === 6 && onSubmit) {
      const success = await onSubmit();
      if (success) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans relative">
      <header className="w-full bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center">
          {/* Responsive logo size */}
          <Image src="/logo.svg" alt="Medlink Logo" width={150} height={150} className="w-32 sm:w-40 md:w-48 lg:w-56 h-auto mr-4" />
        </div>
        {currentStep > 1 && currentStep < 7 && (
          <div className="relative w-full pb-4 sm:pb-8 px-4">
            <div className="relative w-full">
              <Progress 
                value={((currentStep - 1) / (7 - 1)) * 100} 
                className={`w-full h-0.5`}
              />
              <div
                className="absolute top-1/2 transform -translate-y-1/2"
                style={{ left: `${((currentStep - 1) / (7 - 1)) * 100}%` }}
              >
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#D3F898] rounded-full border-2 border-white" />
              </div>
            </div>
            <div
              className="absolute mt-2 sm:mt-4 transform -translate-x-1/2 text-center"
              style={{ left: `${((currentStep - 1) / (7 - 1)) * 100}%` }}
            >
              <div className="bg-[#D3F898] text-neutral-800 px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                {currentStep - 1}/{7 - 1}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <div className="flex-grow flex flex-col bg-white pb-8 pt-4 sm:pt-8 w-full max-w-6xl mx-auto rounded-lg shadow-lg mt-4 px-4 sm:px-6 lg:px-8">
        {/* Main content section */}
        <main className={`flex-grow flex ${currentStep === 1 ? 'items-start justify-start' : 'items-center justify-center'}`}>
          {currentStep === 1 ? (
            <div className="flex flex-col lg:flex-row w-full">
              <div className="w-full lg:max-w-2xl mt-4 lg:mt-20 mb-4 lg:mb-24 lg:w-[580px] lg:h-[380px]">
                <div className="bg-card text-card-foreground p-4 sm:p-6 md:p-8 rounded-lg shadow-md">
                  {children}
                </div>
              </div>
              <div className="hidden lg:flex flex-col items-center justify-center lg:ml-8 relative">
                {/* Images only visible on larger screens */}
                <Image src="/doctor.svg" alt="Doctor" width={150} height={150} className={`mb-4 absolute ${styles.doctorImage}`} />
                <Image src="/green.svg" alt="Green" width={150} height={150} className={`mb-4 absolute ${styles.greenImage}`} />
                <Image src="/trolley.svg" alt="Trolley" width={155} height={155} className={`mb-4 absolute ${styles.trolleyImage}`} />
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md">
              <div className="bg-card text-card-foreground p-4 sm:p-6 md:p-8 rounded-lg shadow-md">
                {children}
              </div>
            </div>
          )}
        </main>
        {/* Footer */}
        <footer className="w-full mt-auto z-20">
          <div className="bg-[#F2F2F2] rounded-lg p-4 shadow flex flex-col xs:flex-row items-center justify-between max-w-6xl mx-auto">
            <div className="text-gray-400 text-xs mb-2 xs:mb-0 text-center xs:text-left">
              © 2024 Medlink. All rights reserved.
            </div>
            <div className="flex space-x-4">
              <a href="https://www.medlink.org.au/" className="text-sm text-gray-600 hover:text-gray-800">Terms & Conditions</a>
              <a href="https://www.medlink.org.au/" className="text-sm text-gray-600 hover:text-gray-800">Privacy Policy</a>
            </div>
          </div>
        </footer>
      </div>
      {/* Background image - now visible on all devices */}
      <div className={`absolute bottom-0 right-0 z-0 w-32 sm:w-48 md:w-64 lg:w-80 ${styles.backgroundImage} ${currentStep === 1 ? '' : styles.fadedBackground}`}>
        <Image 
          src={currentStep === 1 ? "/mbold.svg" : "/mfaded.svg"} 
          alt="Mbackground" 
          layout="responsive" 
          width={300} 
          height={300} 
        />
      </div>
      
    </div>
  );
}