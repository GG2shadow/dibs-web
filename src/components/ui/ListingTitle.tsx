'use client';

interface ListingTitleProps {
  title: string;
  description: string;
  className?: string;
}

export function ListingTitle({ title, description, className }: ListingTitleProps) {
  return (
    <div className={className}>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-md text-muted-foreground">{description}</p>
    </div>
  );
} 