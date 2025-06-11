// /app/api/schedule/save/route.ts
import { NextResponse } from 'next/server';

import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  const body = await req.json();

  const { listingId, schedule, timeSlotType, bookingDuration, breakDuration } =
    body;

  // Optional: delete existing schedule before inserting new
  await supabase.from('listing_schedule').delete().eq('listing_id', listingId);

  for (const [day, value] of Object.entries(schedule) as [
    string,
    DaySchedule,
  ][]) {
    const { data: inserted, error } = await supabase
      .from('listing_schedule')
      .insert({
        listing_id: listingId,
        day_of_week: day,
        enabled: value.enabled,
        time_slot_type: timeSlotType,
        start_time: timeSlotType === 'fixed' ? value.startTime : null,
        end_time: timeSlotType === 'fixed' ? value.endTime : null,
        booking_duration:
          timeSlotType === 'fixed' ? Number(bookingDuration) : null,
        break_duration: timeSlotType === 'fixed' ? Number(breakDuration) : null,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error }, { status: 500 });

    if (timeSlotType === 'custom') {
      for (const slot of value.customTimeSlots) {
        await supabase.from('listing_custom_time_slot').insert({
          schedule_id: inserted.id,
          start_time: slot.startTime,
          end_time: slot.endTime,
        });
      }
    }
  }

  return NextResponse.json({ success: true });
}
