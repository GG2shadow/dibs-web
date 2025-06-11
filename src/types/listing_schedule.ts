interface CustomTimeSlot {
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  enabled: boolean;
  startTime: string;
  endTime: string;
  customTimeSlots: CustomTimeSlot[];
}

type Schedule = Record<string, DaySchedule>;

type TimeSlotType = 'fixed' | 'custom' | '';
