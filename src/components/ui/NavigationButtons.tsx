import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface NavigationButtonsProps {
  onBack: () => void
  onNext: () => void
  nextDisabled: boolean
  showBack: boolean
  nextText?: string
}

export function NavigationButtons({ onBack, onNext, showBack, nextDisabled, nextText = "Next" }: NavigationButtonsProps) {
  return (
    <div className="flex justify-between mt-6">
      {showBack ? (
        <Button 
          onClick={onBack} 
          variant="outline" 
          className="flex items-center justify-center w-10 h-10 rounded-full border border-black p-0"
        >
          <ChevronLeft className="h-6 w-6 text-black" />
        </Button>
      ) : (
        <div /> // Empty div to maintain layout when back button is hidden
      )}
      <Button 
        onClick={onNext} 
        disabled={nextDisabled} 
        className="flex items-center rounded-full px-6 py-2"
        variant="next"
      >
        {nextText} <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}