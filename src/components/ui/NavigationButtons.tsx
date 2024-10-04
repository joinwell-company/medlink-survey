import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { trackEvent } from "@/lib/umami"

interface NavigationButtonsProps {
  onBack: () => void
  onNext: () => void
  showBack: boolean
  nextDisabled: boolean
  nextText: string
}

export function NavigationButtons({
  onBack,
  onNext,
  showBack,
  nextDisabled,
  nextText,
}: NavigationButtonsProps) {
  const handleBack = () => {
    trackEvent('click_back_button');
    onBack();
  };

  return (
    <div className="flex justify-between mt-6">
      {showBack ? (
        <Button onClick={handleBack} variant="outline" className="flex items-center justify-center w-10 h-10 rounded-full border border-black p-0">
          <ChevronLeft  className="w-6 h-4 text-black"/>
        </Button>
      ) : (
        <div></div>
      )}
      <Button onClick={onNext} disabled={nextDisabled} className="flex items-center  rounded-full px-6 py-2">
        {nextText} <ChevronRight className="ml-2 h-4 w-4"/>
      </Button>
    </div>
  )
}