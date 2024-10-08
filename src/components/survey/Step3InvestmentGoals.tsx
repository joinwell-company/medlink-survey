'use client';

import { useState, useEffect } from 'react'
import { useSurvey } from '@/context/SurveyContext'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/lib/umami'

const goals = [
  'Wellness & Fitness',
  'Travel & Recreation',
  'Financial Planning',
  'Medical essentials',
  'Health Insurance',
  'Specialist Healthcare'
]

interface Step3Props {
  isFirstPart: boolean;
  onComplete: () => void;
}

export default function Step3InvestmentGoals({ isFirstPart }: Step3Props) {
  const { updateSurveyData, setIsStepValid } = useSurvey()
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [additionalGoals, setAdditionalGoals] = useState<string[]>([])

  useEffect(() => {
    if (isFirstPart) {
      setIsStepValid(selectedGoals.length === 3)
    } else {
      setIsStepValid(additionalGoals.length === 2)
    }
  }, [selectedGoals, additionalGoals, isFirstPart, setIsStepValid])

  const toggleGoal = (goal: string, isAdditional: boolean = false) => {
    console.log('Toggling goal:', goal, 'isAdditional:', isAdditional)
    if (isAdditional) {
      setAdditionalGoals(prev => {
        const newGoals = prev.includes(goal)
          ? prev.filter(g => g !== goal)
          : prev.length < 2 ? [...prev, goal] : prev;
        
        trackEvent('toggle_investment_goal', { 
          goal, 
          isAdditional, 
          action: prev.includes(goal) ? 'remove' : 'add' 
        });
        
        return newGoals;
      })
    } else {
      setSelectedGoals(prev => {
        const newGoals = prev.includes(goal)
          ? prev.filter(g => g !== goal)
          : prev.length < 3 ? [...prev, goal] : prev;
        
        trackEvent('toggle_investment_goal', { 
          goal, 
          isAdditional, 
          action: prev.includes(goal) ? 'remove' : 'add' 
        });
        
        return newGoals;
      })
    }
  }

  useEffect(() => {
    updateSurveyData({
      primaryInvestmentGoals: selectedGoals,
      secondaryInvestmentGoals: additionalGoals
    })
  }, [selectedGoals, additionalGoals, updateSurveyData])

  useEffect(() => {
    if (!isFirstPart) {
      trackEvent('step3_second_part_view');
    }
  }, [isFirstPart]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">
        {isFirstPart
          ? "Choose 3 things you would like to have your investments pay for"
          : "If you could choose 2 more from that list, what would they be?"}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {goals.map(goal => (
          <Button
            key={goal}
            type="button"
            variant={
              selectedGoals.includes(goal) || additionalGoals.includes(goal)
                ? "customGreen"
                : "outline"
            }
            onClick={() => toggleGoal(goal, !isFirstPart)}
            disabled={!isFirstPart && selectedGoals.includes(goal)}
            className={`h-24 text-sm ${
              !isFirstPart && selectedGoals.includes(goal)
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            {goal}
          </Button>
        ))}
      </div>
    </div>
  )
}