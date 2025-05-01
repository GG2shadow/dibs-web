'use client';

import React, { useState } from 'react';

import { GoShare } from 'react-icons/go';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

interface OurBookingFormProps {
  className?: string;
  pricePerPax?: number;
}

export function OurBookingForm({ className, pricePerPax = 75 }: OurBookingFormProps) {
  const [pax, setPax] = useState<number>(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="font-['Inter']">First name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter your first name"
                className="font-['Inter']"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="font-['Inter']">Last name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter your last name"
                className="font-['Inter']"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="font-['Inter']">Phone number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className="font-['Inter']"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="font-['Inter']">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="font-['Inter']"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex-1">
              <Label htmlFor="date" className="font-['Inter']">Date and time</Label>
              <div className="[--rdp-accent-color:var(--primary)] h-10">
                <DatePicker />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pax" className="font-['Inter']">Number of pax</Label>
            <div className="flex w-40 items-center rounded-lg border h-9">
              <button
                type="button"
                className="h-full px-2 hover:bg-muted font-['Inter']"
                onClick={() => setPax(Math.max(pax - 1, 1))}
              >
                -
              </button>
              <Input
                type="text"
                disabled
                value={pax}
                className="w-full border-0 text-center h-full font-['Inter']"
              />
              <button
                type="button"
                className="h-full px-2 hover:bg-muted font-['Inter']"
                onClick={() => setPax(pax + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="font-['Inter']">Additional notes</Label>
            <Textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Type anything we should know here."
              className="font-['Inter']"
            />
          </div>

          <Button type="submit" className="w-full font-['Inter']">
            Reserve
          </Button>

          <div className="space-y-2">
            <span className="inline-flex w-full justify-between">
              <h3 className="text-sm font-['Inter']">${pricePerPax} x {pax} pax</h3>
              <h3 className="text-sm font-['Inter']">${pricePerPax * pax}</h3>
            </span>
            <Separator className="my-4" />
            <span className="inline-flex w-full justify-between">
              <h3 className="text-md font-semibold">Total</h3>
              <h3 className="text-md font-semibold">${pricePerPax * pax}</h3>
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 