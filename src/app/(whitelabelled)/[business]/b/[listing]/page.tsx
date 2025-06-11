'use client';

import React, { useState } from 'react';

import { GoShare } from 'react-icons/go';

import { ListingDescription } from '@/components/ui/ListingDescription';
import { ListingTitle } from '@/components/ui/ListingTitle';
import OurAnnouncementBanner from '@/components/ui/OurComponents/OurAnnouncementBanner';
import { OurBookingForm } from '@/components/ui/OurComponents/OurBookingForm';
import { OurImageCarousel } from '@/components/ui/OurComponents/OurImageCarousel';
import OurWatermarkFooter from '@/components/ui/OurComponents/OurWatermarkFooter';

// Sample image data for the carousel
const images = [
  '/dibs-listing-photo.png',
  '/dibs-listing-photo.png',
  '/dibs-listing-photo.png',
  '/dibs-listing-photo.png',
  '/dibs-listing-photo.png',
  '/dibs-listing-photo.png',
  '/dibs-listing-photo.png',
  '/dibs-listing-photo.png',
  '/dibs-listing-photo.png',
];

const ListingPage = () => {
  const [business, setBusiness] = useState<string | undefined>(undefined);
  const [listing, setListing] = useState<string | undefined>(undefined);

  return (
    <div className="listing-container min-h-screen w-screen">
      <OurAnnouncementBanner></OurAnnouncementBanner>
      <div className="container mx-auto mt-10 px-4 py-8">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="md:w-[60%]">
            <OurImageCarousel images={images} className="mb-8" />
            <ListingTitle
              title="1-on-1 Expert Consultation"
              description="Get personalized guidance from our experts"
              className="mb-8"
            />
            <ListingDescription />
            <div className="text-muted-foreground mt-6 flex items-center text-sm">
              <span>Share</span>
              <GoShare className="ml-2 h-4 w-4" />
            </div>
          </div>
          <div className="md:w-[40%]">
            <OurBookingForm className="max-w-2xl" />
          </div>
        </div>
      </div>
      <OurWatermarkFooter></OurWatermarkFooter>
    </div>
  );
};

// Export the component
export default ListingPage;
