import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from 'lucide-react';

// Mock data for demonstration
const availableSlots = [
  { date: '2025-05-02', time: '11:00 AM - 12:00 PM', title: 'Muay Thai Gym Classes', instructor: 'LEEROY TAN', totalSlots: 10, bookedSlots: 3 },
  { date: '2025-05-05', time: '7:00 PM - 8:00 PM', title: 'Muay Thai Gym Classes', instructor: 'LEEROY TAN', totalSlots: 10, bookedSlots: 5 },
  { date: '2025-05-06', time: '7:00 PM - 8:00 PM', title: 'Muay Thai Gym Classes', instructor: 'Danial Hanif', totalSlots: 8, bookedSlots: 2 },
  { date: '2025-05-18', time: '11:00 AM - 12:00 PM', title: 'Muay Thai Gym Classes', instructor: 'Pearl Chan', totalSlots: 12, bookedSlots: 4 },
  { date: '2025-05-19', time: '5:30 PM - 6:30 PM', title: 'Muay Thai Gym Classes', instructor: 'Chris Bernhardi', totalSlots: 10, bookedSlots: 7 },
  { date: '2025-05-19', time: '7:00 PM - 8:00 PM', title: 'Yoga Class', instructor: 'Jane Doe', totalSlots: 15, bookedSlots: 12 },
  { date: '2025-05-19', time: '8:00 PM - 9:00 PM', title: 'Boxing', instructor: 'John Smith', totalSlots: 8, bookedSlots: 6 },
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function getPrevMonth(year: number, month: number) {
  if (month === 0) return { year: year - 1, month: 11 };
  return { year, month: month - 1 };
}
function getNextMonth(year: number, month: number) {
  if (month === 11) return { year: year + 1, month: 0 };
  return { year, month: month + 1 };
}
function pad(num: number) {
  return num.toString().padStart(2, '0');
}
function getDateString(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function getBookingColor(bookedSlots: number, totalSlots: number) {
  const percentage = (bookedSlots / totalSlots) * 100;
  if (percentage < 50) {
    return { background: '#DCFCE7', color: '#166534' }; // Green
  } else if (percentage < 80) {
    return { background: '#FEF9C3', color: '#854D0E' }; // Yellow
  } else {
    return { background: '#FEE2E2', color: '#B91C1C' }; // Red (current dibs red)
  }
}

export function BookingsCalendar() {
  const today = new Date();
  const [view, setView] = React.useState<'month' | 'week' | 'day'>('month');
  const [current, setCurrent] = React.useState({
    year: 2025,
    month: 4, // May (0-indexed)
  });
  const [expanded, setExpanded] = React.useState<{ [date: string]: boolean }>({});
  const [selectedInstructors, setSelectedInstructors] = React.useState<Set<string>>(new Set());

  // Get unique instructors
  const instructors = React.useMemo(() => {
    const uniqueInstructors = new Set(availableSlots.map(slot => slot.instructor));
    return Array.from(uniqueInstructors);
  }, []);

  // Filter slots based on selected instructors
  const filteredSlots = React.useMemo(() => {
    if (selectedInstructors.size === 0) return availableSlots;
    return availableSlots.filter(slot => selectedInstructors.has(slot.instructor));
  }, [selectedInstructors]);

  const toggleInstructor = (instructor: string) => {
    setSelectedInstructors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(instructor)) {
        newSet.delete(instructor);
      } else {
        newSet.add(instructor);
      }
      return newSet;
    });
  };

  const daysInMonth = getDaysInMonth(current.year, current.month);
  const firstDayOfWeek = getFirstDayOfWeek(current.year, current.month);

  // Build calendar grid (dynamic weeks based on month length)
  const weeks: (number | null)[][] = [];
  let day = 1 - firstDayOfWeek;
  const totalDays = daysInMonth + firstDayOfWeek;
  const totalWeeks = Math.ceil(totalDays / 7);
  
  for (let w = 0; w < totalWeeks; w++) {
    const week: (number | null)[] = [];
    for (let d = 0; d < 7; d++) {
      if (day > 0 && day <= daysInMonth) {
        week.push(day);
      } else {
        week.push(null);
      }
      day++;
    }
    weeks.push(week);
  }

  const handlePrev = () => {
    setCurrent((prev) => getPrevMonth(prev.year, prev.month));
  };
  const handleNext = () => {
    setCurrent((prev) => getNextMonth(prev.year, prev.month));
  };

  const handleExpand = (date: string) => {
    setExpanded((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  const monthName = new Date(current.year, current.month).toLocaleString('default', { month: 'long' });

  return (
    <div className="w-full flex flex-col gap-4 pl-1">
      <h1 className="text-xl font-semibold">Booking Calendar</h1>
      {/* Header */}
      <div className="flex items-center justify-between pr-2 pt-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrev}><ChevronLeft /></Button>
          <span className="text-lg font-semibold">{monthName} {current.year}</span>
          <Button variant="outline" size="icon" onClick={handleNext}><ChevronRight /></Button>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Instructors <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {instructors.map((instructor) => (
                <DropdownMenuCheckboxItem
                  key={instructor}
                  checked={selectedInstructors.has(instructor)}
                  onCheckedChange={() => toggleInstructor(instructor)}
                >
                  {instructor}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-sm font-medium">Vacancies status:</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm" style={{ background: '#DCFCE7' }}></div>
          <span className="text-muted-foreground">Available (&lt; 50%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm" style={{ background: '#FEF9C3' }}></div>
          <span className="text-muted-foreground">Filling (50-80%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm" style={{ background: '#FEE2E2' }}></div>
          <span className="text-muted-foreground">Almost Full (&gt; 80%)</span>
        </div>
      </div>
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 bg-muted rounded-xl p-2 pb-6">
        {/* Days of week header */}
        {daysOfWeek.map((d) => (
          <div key={d} className="text-center font-medium text-muted-foreground py-1">{d}</div>
        ))}
        {/* Days */}
        {weeks.flat().map((day, idx) => {
          const dateStr = day ? getDateString(current.year, current.month, day) : '';
          const daySlots = filteredSlots.filter(a => a.date === dateStr);
          const showExpand = daySlots.length > 2;
          const isExpanded = expanded[dateStr];
          return (
            <Card key={idx} className={`min-h-[90px] flex flex-col ${!day ? 'bg-transparent border-none shadow-none' : ''}`}>
              <CardContent className="p-2 h-full flex flex-col gap-1">
                <div className="text-xs font-semibold text-muted-foreground mb-1">{day || ''}</div>
                {daySlots.slice(0, showExpand && !isExpanded ? 1 : undefined).map((slot, i) => {
                  const colors = getBookingColor(slot.bookedSlots, slot.totalSlots);
                  return (
                    <div
                      key={i}
                      style={{ background: colors.background, color: colors.color }}
                      className="rounded-md px-2 py-1 text-xs font-medium mb-1"
                    >
                      <div>{slot.time}</div>
                      <div>{slot.title}</div>
                      <div className="text-[10px] font-normal">{slot.instructor}</div>
                      <div className="text-[10px] font-normal mt-1">
                        {slot.bookedSlots}/{slot.totalSlots} slots booked
                      </div>
                    </div>
                  );
                })}
                {showExpand && !isExpanded && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-2 py-0 h-6 text-xs text-dibs-red"
                    onClick={() => handleExpand(dateStr)}
                  >
                    +{daySlots.length - 1} more
                  </Button>
                )}
                {showExpand && isExpanded && (
                  <>
                    {daySlots.slice(1).map((slot, i) => {
                      const colors = getBookingColor(slot.bookedSlots, slot.totalSlots);
                      return (
                        <div
                          key={i + 1}
                          style={{ background: colors.background, color: colors.color }}
                          className="rounded-md px-2 py-1 text-xs font-medium mb-1"
                        >
                          <div>{slot.time}</div>
                          <div>{slot.title}</div>
                          <div className="text-[10px] font-normal">{slot.instructor}</div>
                          <div className="text-[10px] font-normal mt-1">
                            {slot.bookedSlots}/{slot.totalSlots} slots booked
                          </div>
                        </div>
                      );
                    })}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-2 py-0 h-6 text-xs text-dibs-red"
                      onClick={() => handleExpand(dateStr)}
                    >
                      Show less
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default BookingsCalendar;
