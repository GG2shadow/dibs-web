'use client';

import React, { useState, useEffect } from 'react';

import OurLabel from '../../OurComponents/OurLabel';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Listing } from '@/types/listing';

const days = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' },
];

const createDefaultSchedule = (): Schedule =>
  Object.fromEntries(
    days.map(({ id }) => [
      id,
      {
        enabled: false,
        startTime: '09:00',
        endTime: '17:00',
        customTimeSlots: [],
      },
    ]),
  ) as Schedule;

export function BookingsSchedules() {
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState('');
  const [timeSlotType, setTimeSlotType] = useState<TimeSlotType>('');
  const [bookingDuration, setBookingDuration] = useState('');
  const [breakDuration, setBreakDuration] = useState('');
  const [schedule, setSchedule] = useState<Schedule>(createDefaultSchedule());

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      const res = await fetch('/api/schedule/listings');
      const data = await res.json();

      if (res.ok) {
        setListings(data.listings);
      } else {
        console.error(data.error);
      }

      setLoading(false);
    };

    fetchListings();
  }, []);

  useEffect(() => {
    if (!selectedListing) return;

    (async () => {
      const res = await fetch(`/api/schedule/${selectedListing}`);
      const result = await res.json();

      if (res.ok && result.schedule) {
        setTimeSlotType(result.timeSlotType);
        setBookingDuration(result.bookingDuration?.toString() || '');
        setBreakDuration(result.breakDuration?.toString() || '');
        setSchedule(result.schedule);
      } else {
        console.warn('No schedule found, using defaults.');
        // fallback: build default empty schedule
        setSchedule(createDefaultSchedule());
        setTimeSlotType('');
        setBookingDuration('');
        setBreakDuration('');
      }
    })();
  }, [selectedListing]);

  const handleTimeSlotTypeChange = (value: TimeSlotType) => {
    setTimeSlotType(value);
    setSchedule(createDefaultSchedule());
    setBookingDuration('');
    setBreakDuration('');
  };

  const handleDayToggle = (day: string) => {
    setSchedule((prev) => {
      const existing = prev[day] ?? {
        enabled: false,
        startTime: '09:00',
        endTime: '17:00',
        customTimeSlots: [],
      };

      return {
        ...prev,
        [day]: {
          ...existing,
          enabled: !existing.enabled,
        },
      };
    });
  };

  const handleTimeChange = (
    day: string,
    field: 'startTime' | 'endTime',
    value: string,
  ) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleCustomTimeSlotAdd = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        customTimeSlots: [
          ...prev[day].customTimeSlots,
          { startTime: '', endTime: '' },
        ],
      },
    }));
  };

  const handleCustomTimeSlotChange = (
    day: string,
    index: number,
    field: 'startTime' | 'endTime',
    value: string,
  ) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        customTimeSlots: prev[day].customTimeSlots.map((slot, i) =>
          i === index ? { ...slot, [field]: value } : slot,
        ),
      },
    }));
  };

  const handleCustomTimeSlotRemove = (day: string, index: number) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        customTimeSlots: prev[day].customTimeSlots.filter(
          (_, i) => i !== index,
        ),
      },
    }));
  };

  return (
    <div className="w-full pl-1">
      <h1 className="text-xl font-semibold">Booking Schedules</h1>
      <p className="text-muted-foreground text-sm">
        This is a list of all your bookable schedules.
      </p>
      <div className="flex items-center py-4">
        <form className="w-1/2 space-y-6">
          <div className="space-y-4">
            <h2 className="font-['Inter'] text-lg font-semibold">
              Listing settings
            </h2>
            <div className="space-y-2">
              <Label htmlFor="listing" className="font-['Inter']">
                Listing
              </Label>
              <Select
                value={selectedListing}
                onValueChange={setSelectedListing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a listing" />
                </SelectTrigger>
                <SelectContent>
                  {loading ? (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      Loading listings...
                    </div>
                  ) : (
                    listings.map((listing) => (
                      <SelectItem key={listing.id} value={listing.id ?? ''}>
                        {listing.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-['Inter'] text-lg font-semibold">
              Business hours
            </h2>
            <div className="space-y-4">
              <Label className="font-['Inter']">Time slot type</Label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`cursor-pointer rounded-lg border p-4 pr-8 transition-colors ${
                    timeSlotType === 'fixed'
                      ? 'border-dibs-red bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleTimeSlotTypeChange('fixed')}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="timeSlot"
                      value="fixed"
                      checked={timeSlotType === 'fixed'}
                      readOnly
                      className="accent-dibs-red mt-1"
                    />
                    <div>
                      <Label className="font-medium">Fixed time slot</Label>
                      <p className="text-sm text-gray-600">
                        Bookings are divided into regular intervals (such as
                        hourly slots). Perfect for services with consistent
                        duration requirements.
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`cursor-pointer rounded-lg border p-4 pr-8 transition-colors ${
                    timeSlotType === 'custom'
                      ? 'border-dibs-red bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleTimeSlotTypeChange('custom')}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="timeSlot"
                      value="custom"
                      checked={timeSlotType === 'custom'}
                      readOnly
                      className="accent-dibs-red mt-1"
                    />
                    <div>
                      <Label className="font-medium">Custom time slot</Label>
                      <p className="text-sm text-gray-600">
                        Manually specify available time slots for each day.
                        Bookings will only be available during these specific
                        times.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {timeSlotType === 'fixed' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bookingDuration" className="font-['Inter']">
                    Default booking duration
                  </Label>
                  <Select
                    value={bookingDuration}
                    onValueChange={setBookingDuration}
                  >
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
                  <Label htmlFor="breakDuration" className="font-['Inter']">
                    Break between bookings
                  </Label>
                  <Select
                    value={breakDuration}
                    onValueChange={setBreakDuration}
                  >
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
                    <Label htmlFor={day.id} className="font-['Inter']">
                      {day.label}
                    </Label>
                    <Switch
                      id={day.id}
                      checked={!!schedule[day.id]?.enabled}
                      onCheckedChange={() => handleDayToggle(day.id)}
                    />
                  </div>
                  {schedule[day.id]?.enabled && (
                    <>
                      {timeSlotType === 'fixed' ? (
                        <div className="flex gap-4">
                          <div className="flex-1 space-y-2">
                            <Label
                              htmlFor={`${day.id}-start`}
                              className="font-small font-['Inter'] text-gray-600"
                            >
                              Start Time
                            </Label>
                            <Input
                              id={`${day.id}-start`}
                              type="time"
                              value={schedule[day.id]?.startTime}
                              onChange={(e) =>
                                handleTimeChange(
                                  day.id,
                                  'startTime',
                                  e.target.value,
                                )
                              }
                              className="focus:border-dibs-red focus:ring-dibs-red/20 h-10 border-gray-200"
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <Label
                              htmlFor={`${day.id}-end`}
                              className="font-small font-['Inter'] text-gray-600"
                            >
                              End Time
                            </Label>
                            <Input
                              id={`${day.id}-end`}
                              type="time"
                              value={schedule[day.id]?.endTime}
                              onChange={(e) =>
                                handleTimeChange(
                                  day.id,
                                  'endTime',
                                  e.target.value,
                                )
                              }
                              className="focus:border-dibs-red focus:ring-dibs-red/20 h-10 border-gray-200"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            {schedule[day.id]?.customTimeSlots.map(
                              (slot, index) => (
                                <div key={index} className="flex gap-2">
                                  <div className="flex-1">
                                    <Label className="text-sm text-gray-600">
                                      Start Time
                                    </Label>
                                    <Input
                                      type="time"
                                      value={slot.startTime}
                                      onChange={(e) =>
                                        handleCustomTimeSlotChange(
                                          day.id,
                                          index,
                                          'startTime',
                                          e.target.value,
                                        )
                                      }
                                      className="focus:border-dibs-red focus:ring-dibs-red/20 h-10 border-gray-200"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <Label className="text-sm text-gray-600">
                                      End Time
                                    </Label>
                                    <Input
                                      type="time"
                                      value={slot.endTime}
                                      onChange={(e) =>
                                        handleCustomTimeSlotChange(
                                          day.id,
                                          index,
                                          'endTime',
                                          e.target.value,
                                        )
                                      }
                                      className="focus:border-dibs-red focus:ring-dibs-red/20 h-10 border-gray-200"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleCustomTimeSlotRemove(day.id, index)
                                    }
                                    className="text-dibs-red mt-6 px-3 py-2 text-sm hover:text-red-700"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ),
                            )}
                            <button
                              type="button"
                              onClick={() => handleCustomTimeSlotAdd(day.id)}
                              className="text-dibs-red text-sm hover:text-red-700"
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

            <button
              type="button"
              onClick={async () => {
                setLoading(true);
                setErrorMessage('');

                try {
                  const res = await fetch('/api/schedule/save', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      listingId: selectedListing,
                      schedule,
                      timeSlotType,
                      bookingDuration,
                      breakDuration,
                    }),
                  });

                  const result = await res.json();

                  if (res.ok && result.success) {
                    alert('Saved!');
                  } else {
                    console.error(result.error);
                    setErrorMessage(
                      'Failed to save schedule. Please try again later.',
                    );
                  }
                } catch (err) {
                  console.error(err);
                  setErrorMessage('Something went wrong while saving.');
                } finally {
                  setLoading(false);
                }
              }}
              className={`mt-6 rounded px-6 py-2 text-white ${
                loading
                  ? 'cursor-not-allowed bg-gray-400'
                  : 'bg-dibs-red hover:bg-red-600'
              }`}
            >
              {loading ? 'Saving...' : 'Save Schedule'}
            </button>
            {errorMessage && (
              <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
