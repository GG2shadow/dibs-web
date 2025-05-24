import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Mock data for demonstration
const appointments = [
  { date: '2025-05-02', time: '11:00 AM - 12:00 PM', title: 'Muay Thai Gym Classes', instructor: 'LEEROY TAN' },
  { date: '2025-05-05', time: '7:00 PM - 8:00 PM', title: 'Muay Thai Gym Classes', instructor: 'LEEROY TAN' },
  { date: '2025-05-06', time: '7:00 PM - 8:00 PM', title: 'Muay Thai Gym Classes', instructor: 'Danial Hanif' },
  { date: '2025-05-18', time: '11:00 AM - 12:00 PM', title: 'Muay Thai Gym Classes', instructor: 'Pearl Chan' },
  { date: '2025-05-19', time: '5:30 PM - 6:30 PM', title: 'Muay Thai Gym Classes', instructor: 'Chris Bernhardi' },
  // Add more for testing stacking/collapsing
  { date: '2025-05-19', time: '7:00 PM - 8:00 PM', title: 'Yoga Class', instructor: 'Jane Doe' },
  { date: '2025-05-19', time: '8:00 PM - 9:00 PM', title: 'Boxing', instructor: 'John Smith' },
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

export function BookingsCalendar() {
  const today = new Date();
  const [view, setView] = React.useState<'month' | 'week' | 'day'>('month');
  const [current, setCurrent] = React.useState({
    year: 2025,
    month: 4, // May (0-indexed)
  });
  const [expanded, setExpanded] = React.useState<{ [date: string]: boolean }>({});

  const daysInMonth = getDaysInMonth(current.year, current.month);
  const firstDayOfWeek = getFirstDayOfWeek(current.year, current.month);

  // Build calendar grid (6 weeks, 7 days)
  const weeks: (number | null)[][] = [];
  let day = 1 - firstDayOfWeek;
  for (let w = 0; w < 6; w++) {
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
        {/* <div className="flex gap-2">
          <Button variant={view === 'month' ? 'outline' : 'ghost'} onClick={() => setView('month')}>Month</Button>
          <Button variant={view === 'week' ? 'outline' : 'ghost'} onClick={() => setView('week')}>Week</Button>
          <Button variant={view === 'day' ? 'outline' : 'ghost'} onClick={() => setView('day')}>Day</Button>
        </div> */}
      </div>
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 bg-muted rounded-xl p-2">
        {/* Days of week header */}
        {daysOfWeek.map((d) => (
          <div key={d} className="text-center font-medium text-muted-foreground py-1">{d}</div>
        ))}
        {/* Days */}
        {weeks.flat().map((day, idx) => {
          const dateStr = day ? getDateString(current.year, current.month, day) : '';
          const dayAppointments = appointments.filter(a => a.date === dateStr);
          const showExpand = dayAppointments.length > 2;
          const isExpanded = expanded[dateStr];
          return (
            <Card key={idx} className={`min-h-[90px] flex flex-col ${!day ? 'bg-transparent border-none shadow-none' : ''}`}>
              <CardContent className="p-2 h-full flex flex-col gap-1">
                <div className="text-xs font-semibold text-muted-foreground mb-1">{day || ''}</div>
                {dayAppointments.slice(0, showExpand && !isExpanded ? 1 : undefined).map((appt, i) => (
                  <div
                    key={i}
                    style={{ background: '#FEE2E2', color: '#B91C1C' }}
                    className="rounded-md px-2 py-1 text-xs font-medium mb-1"
                  >
                    <div>{appt.time}</div>
                    <div>{appt.title}</div>
                    <div className="text-[10px] font-normal">{appt.instructor}</div>
                  </div>
                ))}
                {showExpand && !isExpanded && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-2 py-0 h-6 text-xs text-dibs-red"
                    onClick={() => handleExpand(dateStr)}
                  >
                    +{dayAppointments.length - 1} more
                  </Button>
                )}
                {showExpand && isExpanded && (
                  <>
                    {dayAppointments.slice(1).map((appt, i) => (
                      <div
                        key={i + 1}
                        style={{ background: '#FEE2E2', color: '#B91C1C' }}
                        className="rounded-md px-2 py-1 text-xs font-medium mb-1"
                      >
                        <div>{appt.time}</div>
                        <div>{appt.title}</div>
                        <div className="text-[10px] font-normal">{appt.instructor}</div>
                      </div>
                    ))}
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
