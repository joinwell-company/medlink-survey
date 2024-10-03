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
  const [emailTouched, setEmailTouched] = useState(false);
  const [dateOfBirthTouched, setDateOfBirthTouched] = useState(false);

  useEffect(() => {
    const validateEmail = (email: string) => {
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(String(email).toLowerCase());
    };

    const validateDateOfBirth = (dob: string) => {
      const [day, month, year] = dob.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      const now = new Date();
      return (
        date instanceof Date && !isNaN(date.getTime()) &&
        date < now &&
        date.getFullYear() > 1900 &&
        date.getFullYear() < now.getFullYear()
      );
    };

    const emailValid = validateEmail(email);
    const dobValid = validateDateOfBirth(dateOfBirth);

    setErrors({
      email: emailTouched && !emailValid ? 'Please enter a valid email address' : '',
      dateOfBirth: dateOfBirthTouched && !dobValid ? 'Please enter a valid date of birth' : '',
    });

    const isValid = email !== '' && dateOfBirth !== '' && emailValid && dobValid;
    setIsStepValid(isValid);

    if (isValid) {
      const [day, month, year] = dateOfBirth.split('/').map(Number);
      const formattedDate = new Date(year, month - 1, day).toISOString();
      updateSurveyData({ email, dateOfBirth: formattedDate });
    }
  }, [email, dateOfBirth, emailTouched, dateOfBirthTouched, setIsStepValid, updateSurveyData]);

  const handleDateOfBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 4) value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
    else if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2)}`;
    setDateOfBirth(value);
  };

  return (
    <form className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">What is your email address?</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setEmailTouched(true)}
          placeholder="Enter your email"
          required
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dob">What is your date of birth?</Label>
        <Input
          id="dob"
          type="text"
          value={dateOfBirth}
          onChange={handleDateOfBirthChange}
          onBlur={() => setDateOfBirthTouched(true)}
          placeholder="DD/MM/YYYY"
          required
        />
        {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>}
      </div>
    </form>
  );
}