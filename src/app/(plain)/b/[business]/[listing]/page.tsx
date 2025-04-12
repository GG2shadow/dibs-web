'use client';

import React, { useState } from 'react';

import { GoShare } from 'react-icons/go';

import BLPWatermarkBanner from '@/components/ui/BookingLandingPage/BLPWatermarkBanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

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
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [pax, setPax] = useState<number>(1); // Added state for pax

  return (
    <div className="listing-container min-h-screen w-screen">
      <BLPWatermarkBanner />
      {/* Full width Image Carousel */}
      <div className="image-col">
        <ImageCarousel images={images} />
      </div>
      {/* Listing Information below the carousel */}
      <div className="form-col">
        <h1 className="text-xl font-semibold">1-on-1 Expert Consultation</h1>
        <h2 className="text-md font-bold">{listing}</h2>
        <p className="mt-4 text-sm">
          Schedule a call with our expert to get your business back on track.
        </p>
        <div className="text-muted-foreground mt-6 flex items-center text-sm">
          <span>Share</span>
          <GoShare className="ml-2 h-4 w-4" />
        </div>
        <div className="mt-6">
          {/* Card for date, pax, and additional notes */}
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="mb-4">
                <h3 className="mb-2 text-sm font-semibold">Date and time</h3>
                <div className="[--rdp-accent-color:var(--primary)]">
                  <DatePicker />
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold">Number of pax</h3>
                <div className="flex w-40 items-center rounded-lg border">
                  <button
                    className="p-2 pl-4"
                    onClick={() => setPax(Math.max(pax - 1, 1))} // Decrease pax, ensuring it doesn't go below 1
                  >
                    -
                  </button>
                  <Input
                    type="text"
                    disabled
                    value={pax}
                    onChange={(e) =>
                      setPax(Math.max(Number(e.target.value), 1))
                    } // Ensure pax doesn't go below 1
                    className="w-full border-0 text-center"
                  />
                  <button
                    className="p-2 pr-4"
                    onClick={() => setPax(pax + 1)} // Increase pax
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="my-4">
                <h3 className="mb-2 text-sm font-semibold">Additional notes</h3>
                <Textarea placeholder="Type anything we should know here." />
              </div>
              <Button className="mb-2 w-full text-white">Reserve</Button>
              <span className="mt-2 inline-flex w-full justify-between">
                <h3 className="text-md">$75 x {pax} pax</h3>
                <h3 className="text-md">${75 * pax}</h3>
              </span>
              <Separator className="my-4" />
              <span className="inline-flex w-full justify-between">
                <h3 className="text-md mb-2 font-semibold">Total</h3>
                <h3 className="text-md mb-2 font-semibold">${75 * pax}</h3>
              </span>
            </CardContent>
          </Card>
        </div>
      </div>
      <style jsx>{`
        .listing-container {
          display: flex;
          flex-direction: column;
          padding: 5rem 8rem;
        }
        .image-col {
          width: 100%;
          margin-bottom: 3rem;
        }
        .form-col {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }
        @media (max-width: 1024px) {
          .listing-container {
            padding: 5rem 3rem;
          }
          .image-col {
            margin-bottom: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

// Image Carousel Component
const ImageCarousel = ({ images }: { images: string[] }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="image-carousel">
      {/* Main Image Grid */}
      <div className="image-grid">
        {images.slice(0, 5).map((image, index) => (
          <div
            key={index}
            className={`grid-item ${index === 0 ? 'main-image' : ''}`}
            onClick={() => setSelectedImage(image)}
          >
            <img src={image} alt={`Listing image ${index + 1}`} />
          </div>
        ))}
      </div>

      {/* Thumbnail Gallery */}
      <div className="thumbnail-gallery">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail ${index + 1}`}
            className={selectedImage === image ? 'selected' : ''}
            onClick={() => setSelectedImage(image)}
          />
        ))}
      </div>

      <style jsx>{`
        .image-carousel {
          width: 100%;
        }
        .image-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 8px;
          height: 500px;
          margin-bottom: 16px;
        }
        .grid-item {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
          cursor: pointer;
        }
        .grid-item.main-image {
          grid-column: 1;
          grid-row: 1 / span 2;
        }
        .grid-item:nth-child(2) {
          grid-column: 2;
          grid-row: 1;
        }
        .grid-item:nth-child(3) {
          grid-column: 2;
          grid-row: 2;
        }
        .grid-item:nth-child(4) {
          grid-column: 3;
          grid-row: 1;
        }
        .grid-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.2s ease;
        }
        .grid-item:hover img {
          transform: scale(1.05);
        }
        .thumbnail-gallery {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 8px 0;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .thumbnail-gallery::-webkit-scrollbar {
          display: none;
        }
        .thumbnail-gallery img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 4px;
          cursor: pointer;
          opacity: 0.7;
          transition: all 0.2s ease;
        }
        .thumbnail-gallery img.selected {
          opacity: 1;
          border: 2px solid #000;
        }
        .thumbnail-gallery img:hover {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .image-grid {
            grid-template-columns: 1fr;
            height: 400px;
            gap: 0;
          }
          .grid-item {
            display: none;
          }
          .grid-item.main-image {
            display: block;
            grid-column: 1;
            grid-row: 1;
            height: 100%;
          }
          .thumbnail-gallery {
            display: flex;
            gap: 4px;
            padding: 8px 0;
          }
          .thumbnail-gallery img {
            width: 60px;
            height: 60px;
          }
        }
      `}</style>
    </div>
  );
};

// Export the component
export default ListingPage;
