'use client';

import { useEffect, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { IoLogoTiktok } from 'react-icons/io5';
import { PiInstagramLogoFill } from 'react-icons/pi';

import OurAnnouncementBanner from '@/components/ui/OurComponents/OurAnnouncementBanner';
import { OurBusinessProfile } from '@/components/ui/OurComponents/OurBusinessProfile';
import { OurProductsList } from '@/components/ui/OurComponents/OurProductsList';
import { OurStampCardsList } from '@/components/ui/OurComponents/OurStampCardsList';
import OurWatermarkFooter from '@/components/ui/OurComponents/OurWatermarkFooter';
import { supabase } from '@/lib/supabaseClient';
import { Business } from '@/types/business';
import { Listing } from '@/types/listing';

export default function BookingLandingPage() {
  const { business: businessSlug } = useParams() as { business: string };
  const [isValid, setIsValid] = useState<boolean | null>(null); // null = loading
  const [business, setBusiness] = useState<Business | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchListings = async () => {
      const { data: businessData, error: businessError } = await supabase
        .from('business')
        .select('*')
        .eq('slug', businessSlug)
        .single();

      if (businessError || !businessData) {
        console.warn('Invalid business ID. Redirecting...');
        router.push('/not-found'); // or another fallback page
        return;
      }

      setBusiness(businessData); // ✅ store business data in state

      const { data: listingData, error: listingError } = await supabase
        .from('listing')
        .select(
          `
          *,
          listing_image (
            id,
            image_url
          )
        `,
        )
        .eq('business_id', businessData.id)
        .eq('is_active', true);

      console.warn('Error when fetching listings: ', listingError);

      setListings(listingData ?? []);
      setIsValid(true);
    };

    if (businessSlug) {
      fetchListings();
    }
  }, [businessSlug, router]);

  // 👉 Prevent rendering until check is done
  if (isValid === null) return null; // Or show a loader

  const stampCards = [
    {
      id: '1',
      title: 'Campaign Bagus',
      endDate: '31 Dec 2024',
      progress: 25,
    },
    {
      id: '2',
      title: 'Campaign Also Bagus',
      endDate: 'Never',
      progress: 50,
    },
  ];

  return (
    <div className="min-h-screen w-screen pt-16">
      <OurAnnouncementBanner></OurAnnouncementBanner>
      <OurBusinessProfile
        brand={business?.name}
        bio={business?.bio ?? ''}
        logo={{
          url: 'https://www.shadcnblocks.com',
          src: 'https://shadcnblocks.com/images/block/block-1.svg',
          alt: 'logo',
        }}
        socials={[
          {
            platform: 'Instagram',
            url: 'https://twitter.com/yourhandle',
            handle: '@kaydens_escape',
            icon: <PiInstagramLogoFill className="h-5 w-5" />,
          },
          {
            platform: 'TikTok',
            url: 'https://instagram.com/yourhandle',
            handle: '@kaydens_escape',
            icon: <IoLogoTiktok className="h-5 w-5" />,
          },
          // ... more social links
        ]}
      />
      <OurProductsList listings={listings} business={business} />
      <OurStampCardsList cards={stampCards} />
      <OurWatermarkFooter />
    </div>
  );
}
