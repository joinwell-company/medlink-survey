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
    setError(isValid ? '' : 'Please enter your name')

    if (isValid) {
      updateSurveyData({ name })
    }
  }, [name, setIsStepValid, updateSurveyData])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">What is your name?</h2>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
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