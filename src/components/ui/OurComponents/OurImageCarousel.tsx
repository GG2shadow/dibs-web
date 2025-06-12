'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface OurImageCarouselProps {
  images: string[];
  className?: string;
}

export function OurImageCarousel({ images, className }: OurImageCarouselProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const thumbnailRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const viewAllThumbnailRefs = useRef<Record<number, HTMLDivElement | null>>(
    {},
  );
  const getThumbnailWindow = () => {
    return images.map((img, index) => ({ img, realIndex: index }));
  };

  useEffect(() => {
    const el = thumbnailRefs.current[selectedImage];
    const viewAllEl = viewAllThumbnailRefs.current[selectedImage];
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
    if (viewAllEl) {
      viewAllEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedImage]);

  return (
    <div className={cn('grid grid-cols-5 gap-4', className)}>
      {/* Main image with arrows */}
      <div className="col-span-4 flex justify-start">
        <div className="relative col-span-2 aspect-[4/3] max-h-[400px] overflow-hidden rounded-lg">
          {/* Left arrow */}
          <button
            onClick={() => setSelectedImage((prev) => Math.max(prev - 1, 0))}
            className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white disabled:opacity-40"
            disabled={selectedImage === 0}
          >
            ←
          </button>

          {/* Right arrow */}
          <button
            onClick={() =>
              setSelectedImage((prev) => Math.min(prev + 1, images.length - 1))
            }
            className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white disabled:opacity-40"
            disabled={selectedImage === images.length - 1}
          >
            →
          </button>

          <Image
            src={images[selectedImage]}
            alt={`Main image ${selectedImage + 1}`}
            fill
            className="cursor-pointer object-cover"
            onClick={() => setIsDialogOpen(true)}
          />
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex justify-start">
        <div className="flex max-h-[400px] w-32 flex-col gap-4 overflow-y-auto pr-1">
          {getThumbnailWindow().map(({ img, realIndex }) => (
            <div
              key={realIndex}
              ref={(el) => {
                thumbnailRefs.current[realIndex] = el;
              }}
              className={cn(
                'relative aspect-[4/3] w-24 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-all',
                realIndex === selectedImage
                  ? 'border-blue-500'
                  : 'border-transparent hover:border-gray-300',
              )}
              onClick={() => setSelectedImage(realIndex)}
            >
              <Image
                src={img}
                alt={`Thumbnail ${realIndex + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Optional Dialog for viewing all */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-full max-w-[90vw] overflow-auto p-4 md:max-w-3xl">
          <DialogTitle style={{ display: 'none' }}>View All Images</DialogTitle>
          <div className="flex w-full flex-col items-center gap-4">
            {/* Main Image */}
            <div className="w-full max-w-2xl">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100">
                {/* Left Arrow */}
                <button
                  onClick={() =>
                    setSelectedImage((prev) => Math.max(prev - 1, 0))
                  }
                  disabled={selectedImage === 0}
                  className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white disabled:opacity-40"
                >
                  ←
                </button>

                {/* Right Arrow */}
                <button
                  onClick={() =>
                    setSelectedImage((prev) =>
                      Math.min(prev + 1, images.length - 1),
                    )
                  }
                  disabled={selectedImage === images.length - 1}
                  className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white disabled:opacity-40"
                >
                  →
                </button>

                <Image
                  src={images[selectedImage]}
                  alt={`Main image ${selectedImage + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex w-full max-w-2xl gap-3 overflow-x-auto">
              {images.map((image, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    viewAllThumbnailRefs.current[index] = el;
                  }}
                  className={cn(
                    'relative aspect-[4/3] w-28 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-all',
                    selectedImage === index
                      ? 'border-blue-500'
                      : 'border-transparent hover:border-gray-300',
                  )}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
