export type Listing = {
  id: string | null;
  title: string;
  description: string;
  price: number | null;
  business_id: string | null;
  created_at: string | null;
  slug: string | null;
  listing_image: ListingImage[];
  is_active: boolean;
};

export type ListingImage = {
  id: string;
  image_url: string;
};

export type ListingForm = {
  id: string | null;
  title: string;
  description: string;
  price: string;
  is_active: boolean;
  images: ListingImageForm[];
};

export type ListingImageForm = {
  id?: string; // optional: if it's from DB
  url?: string; // existing image URL
  file?: File; // new image to upload
};

export function mapListingToForm(listing: Listing): ListingForm {
  return {
    id: listing.id,
    title: listing.title,
    description: listing.description,
    price: listing.price?.toString() ?? '',
    is_active: listing.is_active,
    images: listing.listing_image.map((img) => ({
      id: img.id,
      url: img.image_url,
    })),
  };
}

export function mapFormToListing(
  form: ListingForm,
  base: Partial<Listing> = {},
): Listing {
  return {
    id: base.id ?? null,
    title: form.title,
    description: form.description,
    price: parseFloat(form.price) || 0,
    business_id: base.business_id ?? null,
    created_at: base.created_at ?? null,
    slug: base.slug ?? null,
    listing_image: [
      ...(base.listing_image ?? []), // keep existing image data (optional)
    ],
    is_active: form.is_active,
  };
}
