import { useState, useEffect } from 'react'
import { useSurvey } from '@/context/SurveyContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Step2PersonalInfo() {
  const { updateSurveyData, setIsStepValid } = useSurvey()
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const isValid = name.trim().length > 0
    setIsStepValid(isValid)

    if (isValid) {
      setError('')
      updateSurveyData({ name })
    } else if (name.trim().length > 0) {
      setError('Please enter your name')
    }
  }, [name, setIsStepValid, updateSurveyData])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex flex-col items-center">
          <Label htmlFor="name">Your Name</Label>
        </div>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  )
}