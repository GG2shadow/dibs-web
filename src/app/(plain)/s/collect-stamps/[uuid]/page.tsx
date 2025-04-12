'use client';

import React, { useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { BusinessProfile } from '@/components/ui/Stamps/BusinessProfile';
import { EnterPhoneNumberForm } from '@/components/ui/Stamps/EnterPhoneNumberForm';

const CollectStampsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  const router = useRouter();
  const { uuid } = useParams(); // Extract the dynamic route parameter

  const handleSubmit = async (newPhone: string) => {
    // Handle phone number submission logic here
    setPhoneNumber(newPhone);
    console.log('Phone number submitted:', newPhone);

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://xgidujoanslsfwwtqidj.supabase.co/functions/v1/collect-stamps`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnaWR1am9hbnNsc2Z3d3RxaWRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzc4NTM4MywiZXhwIjoyMDUzMzYxMzgzfQ.RN_VqNSkN3gHk4JngkIaClgn0tmM-aDCxGtWaELLXDM`,
          },
          // Add any required body parameters here
          body: JSON.stringify({
            transaction_id: uuid,
            phone_number: newPhone,
          }),
        },
      );

      const result = await response.json();
      if (!response.ok) {
        if (result && result.error) {
          throw new Error(result.error);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      alert(result.message);
      router.push(`/s/stamp-card/${result.customer_stamp_id}`); // Redirect to stamp card after complete
    } catch (err) {
      const errorText =
        err instanceof Error ? err.message : 'Failed to submit form';
      setError(errorText);
      alert(errorText);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <BusinessProfile
        heading="Frites"
        subheading="Beefy goodness & crispy potato perfection."
        logo={{
          url: 'https://www.shadcnblocks.com',
          src: 'https://shadcnblocks.com/images/block/block-1.svg',
          alt: 'logo',
        }}
      />
      <EnterPhoneNumberForm
        isSendOtp={false}
        isOutsideLoading={isLoading}
        onNext={handleSubmit}
      />
    </div>
  );
};

export default CollectStampsPage;
