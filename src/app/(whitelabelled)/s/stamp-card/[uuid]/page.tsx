import React from 'react';

import { OurBusinessProfile } from '@/components/ui/OurComponents/OurBusinessProfile';
import { StampCard } from '@/components/ui/Stamps/StampCard';

const StampCardPage: React.FC = () => {
  const milestones = [
    { title: 'Sign up for the loyalty program', achieved: true },
    { title: 'Make your first purchase', achieved: true },
    { title: 'Refer a friend', achieved: false },
    { title: 'Collect 10 stamps', achieved: false },
  ];

  return (
    <div className="container mx-auto">
      <OurBusinessProfile
        brand="Frites"
        bio="Beefy goodness & crispy potato perfection."
        logo={{
          url: 'https://www.shadcnblocks.com',
          src: 'https://shadcnblocks.com/images/block/block-1.svg',
          alt: 'logo',
        }}
      />
      <StampCard />
    </div>
  );
};

export default StampCardPage;
