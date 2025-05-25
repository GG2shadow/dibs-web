import Link from 'next/link';

import { formatCurrency } from '@/lib/utils';
import { Business } from '@/types/business';
import { Listing } from '@/types/listing';

interface Product {
  id: string;
  name: string;
  description: string;
  price: {
    amount: string;
    suffix: string;
  };
  image: string;
}

interface OurProductsListProps {
  listings: Listing[];
  business: Business | null;
}

const OurProductsList = ({ listings, business }: OurProductsListProps) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-start text-2xl font-bold">Services</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`${business?.slug}/b/${listing.slug}`}
              className="group bg-card relative overflow-hidden rounded-lg border transition-all hover:shadow-lg"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <h3 className="mb-1 text-base font-semibold">
                  {listing.title}
                </h3>
                <p className="text-muted-foreground font-inter mb-2 text-sm">
                  {listing.description}
                </p>
                <p className="font-inter text-base">
                  <span className="font-bold">
                    {formatCurrency(listing.price)}
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export { OurProductsList };
