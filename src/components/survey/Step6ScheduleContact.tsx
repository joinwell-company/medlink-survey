'use client';

import { useState, useEffect } from 'react';
import { useSurvey } from '@/context/SurveyContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function Step6ScheduleContact() {
  const { updateSurveyData, setIsStepValid } = useSurvey();
  const [preferredTime, setPreferredTime] = useState('');
  const [preferredDay, setPreferredDay] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [errors, setErrors] = useState({
    preferredTime: '',
    preferredDay: '',
    phoneNumber: '',
  });

  // Touched states to track user interaction
  const [touched, setTouched] = useState({
    preferredTime: false,
    preferredDay: false,
    phoneNumber: false,
  });

  const isValid =
    preferredTime !== '' &&
    preferredDay !== '' &&
    /^\d{10}$/.test(phoneNumber);

  useEffect(() => {
    setIsStepValid(isValid);

    setErrors({
      preferredTime:
        touched.preferredTime && !preferredTime
          ? 'Please select a preferred contact time'
          : '',
      preferredDay:
        touched.preferredDay && !preferredDay
          ? 'Please select a preferred contact day'
          : '',
      phoneNumber:
        touched.phoneNumber && !/^\d{10}$/.test(phoneNumber)
          ? 'Please enter a valid 10-digit phone number'
          : '',
    });

    updateSurveyData({
      preferredTime,
      preferredDay,
      phoneNumber,
      additionalInfo,
    });
  }, [
    preferredTime,
    preferredDay,
    phoneNumber,
    additionalInfo,
    touched,
    isValid,
    setIsStepValid,
    updateSurveyData,
  ]);

  return (
    <form className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="preferredTime">Preferred contact time</Label>
        <Select
          onValueChange={(value) => {
            setPreferredTime(value);
            setTouched((prev) => ({ ...prev, preferredTime: true }));
          }}
          value={preferredTime}
        >
          <SelectTrigger id="preferredTime">
            <SelectValue placeholder="Select preferred time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="morning">Morning</SelectItem>
            <SelectItem value="afternoon">Afternoon</SelectItem>
            <SelectItem value="evening">Evening</SelectItem>
          </SelectContent>
        </Select>
        {errors.preferredTime && (
          <p className="text-red-500 text-sm">{errors.preferredTime}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferredDay">Preferred contact day</Label>
        <Select
          onValueChange={(value) => {
            setPreferredDay(value);
            setTouched((prev) => ({ ...prev, preferredDay: true }));
          }}
          value={preferredDay}
        >
          <SelectTrigger id="preferredDay">
            <SelectValue placeholder="Select preferred day" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monday">Monday</SelectItem>
            <SelectItem value="tuesday">Tuesday</SelectItem>
            <SelectItem value="wednesday">Wednesday</SelectItem>
            <SelectItem value="thursday">Thursday</SelectItem>
            <SelectItem value="friday">Friday</SelectItem>
            <SelectItem value="saturday">Saturday</SelectItem>
            <SelectItem value="sunday">Sunday</SelectItem>
          </SelectContent>
        </Select>
        {errors.preferredDay && (
          <p className="text-red-500 text-sm">{errors.preferredDay}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone number</Label>
        <Input
          id="phoneNumber"
          type="tel"
          value={phoneNumber}
          onChange={(e) => {
            setPhoneNumber(e.target.value);
          }}
          onBlur={() =>
            setTouched((prev) => ({ ...prev, phoneNumber: true }))
          }
          placeholder="Enter your phone number"
          required
        />
        {errors.phoneNumber && (
          <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
        )}
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
