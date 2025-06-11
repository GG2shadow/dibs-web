import { NextResponse } from 'next/server';

import { supabase } from '@/lib/supabaseClient';

const formatTime = (raw: string | null): string => {
  if (!raw) return '09:00'; // fallback default
  // From "12:25:00+00" → "12:25"
  return raw.slice(0, 5);
};

export async function GET(
  req: Request,
  { params }: { params: { listingId: string } },
) {
  const { data: schedules, error } = await supabase
    .from('listing_schedule')
    .select('*, listing_custom_time_slot(*)')
    .eq('listing_id', params.listingId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const schedule: Schedule = {};
  let timeSlotType = '';
  let bookingDuration = null;
  let breakDuration = null;

  for (const s of schedules) {
    const day = s.day_of_week;
    schedule[day] = {
      enabled: s.enabled,
      startTime: formatTime(s.start_time),
      endTime: formatTime(s.end_time),
      customTimeSlots: s.listing_custom_time_slot.map(
        (slot: { start_time: string; end_time: string }) => ({
          startTime: formatTime(slot.start_time),
          endTime: formatTime(slot.end_time),
        }),
      ),
    };

    timeSlotType = s.time_slot_type; // safe: same for all days
    bookingDuration = s.booking_duration;
    breakDuration = s.break_duration;
  }

  return NextResponse.json({
    timeSlotType,
    bookingDuration,
    breakDuration,
    schedule,
  });
}
