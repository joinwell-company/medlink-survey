'use client';

import { useState, useEffect } from 'react';
import { useSurvey } from '@/context/SurveyContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function Step6ScheduleContact() {
  const { updateSurveyData, setIsStepValid } = useSurvey();
  const [preferredTime, setPreferredTime] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [errors, setErrors] = useState({ preferredTime: '', phoneNumber: '' });

  useEffect(() => {
    const isPreferredTimeValid = preferredTime !== '';
    const isPhoneNumberValid = /^\d{10}$/.test(phoneNumber);

    const isValid = isPreferredTimeValid && isPhoneNumberValid;
    setIsStepValid(isValid);

    setErrors({
      preferredTime: isPreferredTimeValid ? '' : 'Please select a preferred contact time',
      phoneNumber: isPhoneNumberValid ? '' : 'Please enter a valid 10-digit phone number',
    });

    if (isValid) {
      updateSurveyData({ preferredTime, phoneNumber, additionalInfo });
    }
  }, [preferredTime, phoneNumber, additionalInfo]);

  return (
    <form className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="preferredTime">Preferred contact time</Label>
        <Select onValueChange={setPreferredTime} value={preferredTime}>
          <SelectTrigger id="preferredTime">
            <SelectValue placeholder="Select preferred time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="morning">Morning</SelectItem>
            <SelectItem value="afternoon">Afternoon</SelectItem>
            <SelectItem value="evening">Evening</SelectItem>
          </SelectContent>
        </Select>
        {errors.preferredTime && <p className="text-red-500 text-sm">{errors.preferredTime}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone number</Label>
        <Input
          id="phoneNumber"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter your phone number"
          required
        />
        {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalInfo">Additional information (optional)</Label>
        <Textarea
          id="additionalInfo"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Any additional information you'd like to share"
        />
      </div>
    </form>
  );
}
