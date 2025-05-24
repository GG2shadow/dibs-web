'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup } from '@/components/ui/radio-group';
import OurLabel from '../../OurComponents/OurLabel';

interface DaySchedule {
  enabled: boolean;
  startTime: string;
  endTime: string;
  customTimeSlots: {
    startTime: string;
    endTime: string;
  }[];
}

interface Schedule {
  [key: string]: DaySchedule;
}

export function BookingsSchedules() {
  const [selectedListing, setSelectedListing] = useState('');
  const [timeSlotType, setTimeSlotType] = useState('fixed');

  const [schedule, setSchedule] = useState<Schedule>({
    monday: { enabled: true, startTime: '09:00', endTime: '17:00', customTimeSlots: [] },
    tuesday: { enabled: true, startTime: '09:00', endTime: '17:00', customTimeSlots: [] },
    wednesday: { enabled: true, startTime: '09:00', endTime: '17:00', customTimeSlots: [] },
    thursday: { enabled: true, startTime: '09:00', endTime: '17:00', customTimeSlots: [] },
    friday: { enabled: true, startTime: '09:00', endTime: '17:00', customTimeSlots: [] },
    saturday: { enabled: false, startTime: '09:00', endTime: '17:00', customTimeSlots: [] },
    sunday: { enabled: false, startTime: '09:00', endTime: '17:00', customTimeSlots: [] },
  });

  const [bookingDuration, setBookingDuration] = useState('');
  const [breakDuration, setBreakDuration] = useState('');

  const handleDayToggle = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled
      }
    }));
  };

  const handleTimeChange = (day: string, field: 'startTime' | 'endTime', value: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleCustomTimeSlotAdd = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        customTimeSlots: [...prev[day].customTimeSlots, { startTime: '', endTime: '' }]
      }
    }));
  };

  const handleCustomTimeSlotChange = (day: string, index: number, field: 'startTime' | 'endTime', value: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        customTimeSlots: prev[day].customTimeSlots.map((slot, i) => 
          i === index ? { ...slot, [field]: value } : slot
        )
      }
    }));
  };

  const handleCustomTimeSlotRemove = (day: string, index: number) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        customTimeSlots: prev[day].customTimeSlots.filter((_, i) => i !== index)
      }
    }));
  };

  const days = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' },
  ];

  // Mock listings data - replace with actual data from your API
  const listings = [
    { id: '1', name: 'Haircut & Styling' },
    { id: '2', name: 'Hair Coloring' },
    { id: '3', name: 'Hair Treatment' },
    { id: '4', name: 'Beard Trim' },
  ];

  return (
    <div className="w-full pl-1">
      <h1 className="text-xl font-semibold">Booking Schedules</h1>
      <p className="text-sm text-muted-foreground">This is a list of all your bookable schedules.</p>
      <div className="flex items-center py-4">
        <form className="w-1/2 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold font-['Inter']">Listing settings</h2>
            <div className="space-y-2">
              <Label htmlFor="listing" className="font-['Inter']">Listing</Label>
              <Select value={selectedListing} onValueChange={setSelectedListing}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a listing" />
                </SelectTrigger>
                <SelectContent>
                  {listings.map((listing) => (
                    <SelectItem key={listing.id} value={listing.id}>
                      {listing.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold font-['Inter']">Business hours</h2>
            <div className="space-y-4">
              <Label className="font-['Inter']">Time slot type</Label>
              <RadioGroup value={timeSlotType} onValueChange={setTimeSlotType} className="grid grid-cols-2 gap-4">
                <div
                  className={`p-4 pr-8 border rounded-lg cursor-pointer transition-colors ${
                    timeSlotType === 'fixed'
                      ? 'border-dibs-red bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setTimeSlotType('fixed')}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      checked={timeSlotType === 'fixed'}
                      onChange={() => setTimeSlotType('fixed')}
                      className="mt-1 accent-dibs-red"
                    />
                    <div>
                      <div className="mb-2">
                        <Label className="font-['Inter'] font-medium">Fixed time slot</Label>
                      </div>
                      <p className="text-sm text-gray-600">
                        Bookings are divided into regular intervals (such as hourly slots). Perfect for services with consistent duration requirements.
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={`p-4 pr-8 border rounded-lg cursor-pointer transition-colors ${
                    timeSlotType === 'custom'
                      ? 'border-dibs-red bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setTimeSlotType('custom')}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      checked={timeSlotType === 'custom'}
                      onChange={() => setTimeSlotType('custom')}
                      className="mt-1 accent-dibs-red"
                    />
                    <div>
                      <div className="mb-2">
                        <Label className="font-['Inter'] font-medium">Custom time slot</Label>
                      </div>
                      <p className="text-sm text-gray-600">
                        Manually specify available time slots for each day. Bookings will only be available during these specific times.
                      </p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {timeSlotType === 'fixed' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bookingDuration" className="font-['Inter']">Default booking duration</Label>
                  <Select value={bookingDuration} onValueChange={setBookingDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="breakDuration" className="font-['Inter']">Break between bookings</Label>
                  <Select value={breakDuration} onValueChange={setBreakDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No break</SelectItem>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {days.map((day) => (
                <div key={day.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={day.id} className="font-['Inter']">{day.label}</Label>
                    <Switch
                      id={day.id}
                      checked={schedule[day.id].enabled}
                      onCheckedChange={() => handleDayToggle(day.id)}
                    />
                  </div>
                  {schedule[day.id].enabled && (
                    <>
                      {timeSlotType === 'fixed' ? (
                        <div className="flex gap-4">
                          <div className="space-y-2 flex-1">
                            <Label htmlFor={`${day.id}-start`} className="font-['Inter'] font-small text-gray-600">Start Time</Label>
                            <Input
                              id={`${day.id}-start`}
                              type="time"
                              value={schedule[day.id].startTime}
                              onChange={(e) => handleTimeChange(day.id, 'startTime', e.target.value)}
                              className="h-10 border-gray-200 focus:border-dibs-red focus:ring-dibs-red/20"
                            />
                          </div>
                          <div className="space-y-2 flex-1">
                            <Label htmlFor={`${day.id}-end`} className="font-['Inter'] font-small text-gray-600">End Time</Label>
                            <Input
                              id={`${day.id}-end`}
                              type="time"
                              value={schedule[day.id].endTime}
                              onChange={(e) => handleTimeChange(day.id, 'endTime', e.target.value)}
                              className="h-10 border-gray-200 focus:border-dibs-red focus:ring-dibs-red/20"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            {schedule[day.id].customTimeSlots.map((slot, index) => (
                              <div key={index} className="flex gap-2">
                                <div className="flex-1">
                                  <Label className="text-sm text-gray-600">Start Time</Label>
                                  <Input
                                    type="time"
                                    value={slot.startTime}
                                    onChange={(e) => handleCustomTimeSlotChange(day.id, index, 'startTime', e.target.value)}
                                    className="h-10 border-gray-200 focus:border-dibs-red focus:ring-dibs-red/20"
                                  />
                                </div>
                                <div className="flex-1">
                                  <Label className="text-sm text-gray-600">End Time</Label>
                                  <Input
                                    type="time"
                                    value={slot.endTime}
                                    onChange={(e) => handleCustomTimeSlotChange(day.id, index, 'endTime', e.target.value)}
                                    className="h-10 border-gray-200 focus:border-dibs-red focus:ring-dibs-red/20"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleCustomTimeSlotRemove(day.id, index)}
                                  className="px-3 py-2 text-sm text-dibs-red hover:text-red-700 mt-6"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => handleCustomTimeSlotAdd(day.id)}
                              className="text-sm text-dibs-red hover:text-red-700"
                            >
                              + Add time slot
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
