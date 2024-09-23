'use client';

import { useState, useEffect } from 'react';
import { useSurvey } from '@/context/SurveyContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Step5ContactInfo() {
  const { updateSurveyData, setIsStepValid } = useSurvey();
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [errors, setErrors] = useState({ email: '', dateOfBirth: '' });

  useEffect(() => {
    const validateEmail = (email: string) => {
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(String(email).toLowerCase());
    };

    const validateDateOfBirth = (dob: string) => {
      const date = new Date(dob);
      const now = new Date();
      return !isNaN(date.getTime()) && date < now && date.getFullYear() > 1900;
    };

    const emailValid = validateEmail(email);
    const dobValid = validateDateOfBirth(dateOfBirth);

    setErrors({
      email: emailValid ? '' : 'Please enter a valid email address',
      dateOfBirth: dobValid ? '' : 'Please enter a valid date of birth',
    });

    setIsStepValid(emailValid && dobValid);
    
    if (emailValid && dobValid) {
      updateSurveyData({ email, dateOfBirth });
    }
  }, [email, dateOfBirth, setIsStepValid, updateSurveyData]);

  return (
    <form className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">What is your email address?</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dob">What is your date of birth?</Label>
        <Input
          id="dob"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          required
        />
        {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>}
      </div>
    </form>
  );
}