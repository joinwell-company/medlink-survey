import { Button } from "@/components/ui/button"
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
        <Button onClick={handleBack} variant="outline">
          Back
        </Button>
      ) : (
        <div></div>
      )}
      <Button onClick={onNext} disabled={nextDisabled}>
        {nextText}
      </Button>
    </div>
  )
}