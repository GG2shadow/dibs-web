'use client';

import { cn } from '@/lib/utils';

interface ListingDescriptionProps {
  className?: string;
}

export function ListingDescription({ className }: ListingDescriptionProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold font-['Inter']">About this consultation</h2>
        <p className="text-muted-foreground">
          Our expert consultation service provides personalized guidance and support to help you navigate the challenges of running your business. Whether you're looking for strategic advice, operational improvements, or specific solutions to your business problems, our experts are here to help.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold font-['Inter']">What you'll get</h2>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>One hour of personalized consultation</li>
          <li>Expert advice tailored to your business needs</li>
          <li>Actionable recommendations and strategies</li>
          <li>Follow-up resources and materials</li>
        </ul>
      </div>
    </div>
  );
} 