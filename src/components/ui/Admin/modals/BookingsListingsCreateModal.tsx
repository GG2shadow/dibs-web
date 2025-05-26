'use client';

import React, { useState } from 'react';

import { X, Upload } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { ListingForm } from '@/types/listing';

interface BookingsListingsCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (newListing: ListingForm) => void;
}

export function BookingsListingsCreateModal({
  isOpen,
  onClose,
  onCreate,
}: BookingsListingsCreateModalProps) {
  const [formData, setFormData] = useState<ListingForm>({
    id: null,
    title: '',
    description: '',
    price: '',
    is_active: true,
    images: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files).map((file) => ({
        file, // new file to upload
      }));

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...fileArray],
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleToggleChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: !prev[name as keyof typeof prev],
    }));
  };

  const handleCreate = () => {
    if (onCreate) {
      onCreate(formData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Modal backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        aria-hidden="true"
      />

      {/* Modal content container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className={cn(
            'bg-background relative w-full max-w-2xl transform overflow-hidden rounded-lg p-6 shadow-lg transition-all',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          )}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none"
          >
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </button>

          {/* Modal content */}
          <div className="space-y-6">
            <h2 className="text-lg leading-none font-semibold tracking-tight">
              Create listing
            </h2>

            <form className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="font-['Inter']">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter listing title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="font-['Inter']">
                    Description
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter description"
                  />
                </div>
                {/* <div className="space-y-2">
                  <Label htmlFor="long-description" className="font-['Inter']">
                    Long description
                  </Label>
                  <Textarea
                    id="long-description"
                    name="longDescription"
                    value={formData.longDescription}
                    onChange={handleInputChange}
                    placeholder="Enter long description"
                  />
                </div> */}
                <div className="space-y-2">
                  <Label htmlFor="images" className="font-['Inter']">
                    Images
                  </Label>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="images"
                      className="relative flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="mb-3 h-8 w-8 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{' '}
                          or drag and drop
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
                      <p className="text-muted-foreground text-sm">
                        {formData.images.length} image(s) selected
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {formData.images.map((img, index) => (
                    <div key={index} className="group relative">
                      <img
                        src={img.url ?? URL.createObjectURL(img.file!)}
                        alt={`Image ${index + 1}`}
                        className="h-24 w-full rounded object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 z-10 rounded-full bg-white p-1 text-red-600 shadow hover:bg-red-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="font-['Inter']">
                    Price per pax
                  </Label>
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
                      <Label htmlFor="isActive" className="font-['Inter']">
                        Active Listing
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        Make this listing available for bookings
                      </p>
                    </div>
                    <Switch
                      id="isActive"
                      checked={formData.is_active}
                      onCheckedChange={() => handleToggleChange('isActive')}
                    />
                  </div>
                </div>
                {/* <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label
                        htmlFor="requiresDeposit"
                        className="font-['Inter']"
                      >
                        Requires Deposit
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        Enable if this listing requires a deposit
                      </p>
                    </div>
                    <Switch
                      id="requiresDeposit"
                      checked={formData.requiresDeposit}
                      onCheckedChange={() =>
                        handleToggleChange('requiresDeposit')
                      }
                    />
                  </div>
                </div> */}
              </div>
            </form>

            {/* Modal footer */}
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={onClose}
                className="border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-lg border px-4 text-sm font-semibold shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="bg-dibs-red focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-400 focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                Create Listing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
