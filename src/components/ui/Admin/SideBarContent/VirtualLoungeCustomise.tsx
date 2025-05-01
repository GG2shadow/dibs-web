'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

export function VirtualLoungeCustomise() {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    phone: '',
    email: '',
    instagram: '',
    tiktok: '',
    bookings: false,
    stamps: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: !prev[name as keyof typeof prev]
    }));
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4 pl-1">
        <form className="w-full space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Business information</h2>
            <div className="space-y-2">
              <Label htmlFor="name" className="font-['Inter']">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter business name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="font-['Inter']">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Enter business bio"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="font-['Inter']">Phone number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
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
                placeholder="Enter email"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold font-['Inter']">Socials</h2>
            <div className="space-y-2">
              <Label htmlFor="instagram" className="font-['Inter']">Instagram</Label>
              <Input
                id="instagram"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                placeholder="Enter Instagram handle"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiktok" className="font-['Inter']">TikTok</Label>
              <Input
                id="tiktok"
                name="tiktok"
                value={formData.tiktok}
                onChange={handleInputChange}
                placeholder="Enter TikTok handle"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold font-['Inter']">Features</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="bookings" className="font-['Inter']">Bookings</Label>
                  <p className="text-sm text-muted-foreground">Let your customers make bookings for your services</p>
                </div>
                <Switch
                  id="bookings"
                  checked={formData.bookings}
                  onCheckedChange={() => handleToggleChange('bookings')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="stamps" className="font-['Inter']">Stamps</Label>
                  <p className="text-sm text-muted-foreground">Let your customers create stamp cards so that their loyalty can be converted into real rewards</p>
                </div>
                <Switch
                  id="stamps"
                  checked={formData.stamps}
                  onCheckedChange={() => handleToggleChange('stamps')}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
