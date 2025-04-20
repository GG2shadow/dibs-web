'use client';

import * as React from 'react';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const generateTimeSlots = (date: Date) => {
  const slots = [];
  const startTime = new Date(date);
  startTime.setHours(0, 0, 0, 0); // Start at 11:00 AM

  const endTime = new Date(date);
  endTime.setHours(23, 59, 0, 0); // End at 8:00 PM

  while (startTime < endTime) {
    const slotEnd = new Date(startTime);
    slotEnd.setMinutes(startTime.getMinutes() + 90); // Add 1.5 hours

    slots.push({
      start: new Date(startTime),
      end: new Date(slotEnd),
    });

    // Move to next slot starting time (current start + 2.5 hours to create gap)
    startTime.setHours(startTime.getHours() + 2, startTime.getMinutes() + 30);
  }

  return slots;
};

export function DatePicker() {
  const [selectedDate, setSelectedDate] = React.useState<Date>();
  const [selectedSlot, setSelectedSlot] = React.useState<{
    start: Date;
    end: Date;
  }>();

  const handleDaySelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlot(undefined);
  };

  const handleSlotSelect = (slot: { start: Date; end: Date }) => {
    setSelectedSlot(slot);
  };

  const timeSlots = selectedDate ? generateTimeSlots(selectedDate) : [];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[240p] justify-start text-left font-normal',
            !(selectedDate && selectedSlot) && 'text-muted-foreground',
          )}
        >
          <CalendarIcon />
          {selectedDate && selectedSlot ? (
            `${format(selectedDate, 'PPP')}, ${format(selectedSlot.start, 'h:mm aa')} - ${format(selectedSlot.end, 'h:mm aa')}`
          ) : (
            <span>Select date and time slot</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDaySelect}
        />

        {selectedDate && (
          <div style={{ borderTop: 'solid 1px hsl(var(--border))' }}>
            <h2 className="mt-2 mb-2 text-center text-lg font-bold">
              Choose Time Slot
            </h2>
            <div className="mb-2 grid max-h-60 grid-cols-2 gap-2 overflow-y-auto">
              {timeSlots.map((slot, index) => {
                const isSelected =
                  selectedSlot?.start.getTime() === slot.start.getTime();
                const timeRange = `${format(slot.start, 'h:mm a')} - ${format(slot.end, 'h:mm a')}`;

                return (
                  <button
                    key={index}
                    onClick={() => handleSlotSelect(slot)}
                    className={`rounded-md p-2 text-sm transition-colors ${
                      isSelected
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-100 hover:bg-gray-200'
                    } `}
                  >
                    {timeRange}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 border-t pt-4">
          <PopoverClose className="rounded-md px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100">
            Cancel
          </PopoverClose>
          <PopoverClose
            disabled={!selectedSlot}
            className={`rounded-md px-3 py-1.5 text-sm text-white ${
              selectedSlot
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'cursor-not-allowed bg-gray-300'
            } `}
          >
            Confirm
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
}
