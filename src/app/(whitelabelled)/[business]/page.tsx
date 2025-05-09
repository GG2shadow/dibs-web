'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import { IoLogoTiktok } from 'react-icons/io5';
import { PiInstagramLogoFill } from 'react-icons/pi';

import OurAnnouncementBanner from '@/components/ui/OurComponents/OurAnnouncementBanner';
import { OurBusinessProfile } from '@/components/ui/OurComponents/OurBusinessProfile';
import { OurProductsList } from '@/components/ui/OurComponents/OurProductsList';
import { OurStampCardsList } from '@/components/ui/OurComponents/OurStampCardsList';
import OurWatermarkFooter from '@/components/ui/OurComponents/OurWatermarkFooter';
import { supabase } from '@/lib/supabaseClient';

export default function BookingLandingPage() {
  const { business: businessId } = useParams() as { business: string };
  const [products, setProducts] = useState<
    {
      id: string;
      name: string;
      description: string;
      price: { amount: string; suffix: string };
      image: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase
        .from('listing')
        .select('*')
        .eq('business_id', businessId);

      if (error) {
        console.error('Failed to fetch listings:', error);
      } else {
        // Map to match your component format
        const formatted = data.map((item) => ({
          id: item.id,
          name: item.title,
          description: item.description,
          price: {
            amount: `$${item.price}`,
            suffix: 'per person', // or adapt dynamically
          },
          image: item.image,
        }));
        setProducts(formatted);
      }
    };

    fetchListings();
  }, [businessId]);

  // const products = [
  //   {
  //     id: '1',
  //     name: 'The Haunted Mansion',
  //     description:
  //       'A spine-chilling adventure through a haunted mansion filled with puzzles and mysteries.',
  //     price: {
  //       amount: '$35',
  //       suffix: 'per person',
  //     },
  //     image:
  //       'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  //   },
  //   {
  //     id: '2',
  //     name: 'Prison Break',
  //     description:
  //       'Work together to escape from a maximum-security prison before time runs out.',
  //     price: {
  //       amount: '$30',
  //       suffix: 'per person',
  //     },
  //     image:
  //       'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  //   },
  //   {
  //     id: '3',
  //     name: 'The Lost Treasure',
  //     description:
  //       'Embark on a treasure hunt through ancient ruins to find the legendary artifact.',
  //     price: {
  //       amount: '$40',
  //       suffix: 'per person',
  //     },
  //     image:
  //       'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  //   },
  //   {
  //     id: '4',
  //     name: 'Time Machine',
  //     description:
  //       'Travel through different eras to fix a broken timeline before the universe collapses.',
  //     price: {
  //       amount: '$45',
  //       suffix: 'per person',
  //     },
  //     image:
  //       'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  //   },
  // ];

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
        brand="Kayden's Escape Room"
        bio="Singapore's first escape room that does not actually exist."
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
      <OurProductsList products={products} businessId={businessId} />
      <OurStampCardsList cards={stampCards} />
      <OurWatermarkFooter />
    </div>
  );
}
