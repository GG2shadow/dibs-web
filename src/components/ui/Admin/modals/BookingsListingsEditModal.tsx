'use client';

import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface BookingListing {
  title: string;
  shortDescription: string;
  longDescription: string;
  price: string;
  capacity: string;
  location: string;
  isActive: boolean;
  requiresDeposit: boolean;
  images: File[];
}

interface BookingsListingsEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: BookingListing;
  onSave?: (updatedListing: BookingListing) => void;
}

export function BookingsListingsEditModal({
  isOpen,
  onClose,
  listing,
  onSave,
}: BookingsListingsEditModalProps) {
  const [formData, setFormData] = useState<BookingListing>(listing);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...fileArray]
      }));
    }
  };

  const handleToggleChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: !prev[name as keyof typeof prev]
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Modal backdrop */}
      <div className="fixed inset-0 bg-black/50 transition-opacity" aria-hidden="true" />
      
      {/* Modal content container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className={cn(
            "relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-background p-6 shadow-lg transition-all",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          )}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </button>

          {/* Modal content */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold leading-none tracking-tight">
              Edit listing
            </h2>

            <form className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="font-['Inter']">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter listing title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="short-description" className="font-['Inter']">Short description</Label>
                  <Input
                    id="short-description"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    placeholder="Enter short description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="long-description" className="font-['Inter']">Long description</Label>
                  <Textarea
                    id="long-description"
                    name="longDescription"
                    value={formData.longDescription}
                    onChange={handleInputChange}
                    placeholder="Enter long description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="images" className="font-['Inter']">Images</Label>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="images"
                      className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG or JPEG (MAX. 800x400px)
                        </p>
                      </div>
                      <Input
                        id="images"
                        name="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    {formData.images.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {formData.images.length} image(s) selected
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="font-['Inter']">Price per pax</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="isActive" className="font-['Inter']">Active Listing</Label>
                      <p className="text-sm text-muted-foreground">Make this listing available for bookings</p>
                    </div>
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={() => handleToggleChange('isActive')}
                    />
                  </div>
                </div>
              </div>
            </form>

            {/* Modal footer */}
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={onClose}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-input bg-background px-4 text-sm font-semibold shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="inline-flex h-9 items-center justify-center rounded-lg bg-dibs-red px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
