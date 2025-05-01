'use client';

import * as React from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface OurImageCarouselProps {
  images: string[];
  className?: string;
}

export function OurImageCarousel({
  images,
  className,
}: OurImageCarouselProps) {
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <div className={cn('grid grid-cols-3 gap-4', className)}>
      {/* Main image */}
      <div className="col-span-2 aspect-[4/3] relative rounded-lg overflow-hidden">
        <Image
          src={images[selectedImage]}
          alt={`Listing image ${selectedImage + 1}`}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right side images */}
      <div className="flex flex-col gap-4 h-full">
        <div className="relative rounded-lg overflow-hidden cursor-pointer flex-1">
          <Image
            src={images[1]}
            alt="Listing image 2"
            fill
            className="object-cover"
            onClick={() => setSelectedImage(1)}
          />
        </div>
        <div className="relative rounded-lg overflow-hidden cursor-pointer flex-1">
          <Image
            src={images[2]}
            alt="Listing image 3"
            fill
            className="object-cover"
            onClick={() => setSelectedImage(2)}
          />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="absolute bottom-4 right-4 bg-white/90 hover:bg-white font-inter"
                onClick={() => setIsDialogOpen(true)}
              >
                View all images
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="grid gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-[4/3] rounded-lg overflow-hidden"
                  >
                    <Image
                      src={image}
                      alt={`Listing image ${index + 1}`}
                      fill
                      className="object-cover"
                      onClick={() => {
                        setSelectedImage(index);
                        setIsDialogOpen(false);
                      }}
                    />
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
} 