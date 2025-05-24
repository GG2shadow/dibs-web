'use client';

import React, { useState } from 'react';

import { OurBusinessProfile } from '@/components/ui/OurComponents/OurBusinessProfile';
import { EnterPhoneNumberForm } from '@/components/ui/Stamps/EnterPhoneNumberForm';
import { VerifyOTPForm } from '@/components/ui/Stamps/VerifyOTPForm';

const CollectStampsPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState(1);

  const handleSubmit = (newPhone: string) => {
    // Handle phone number submission logic here
    setPhoneNumber(newPhone);
    console.log('Phone number submitted:', newPhone);
    setStep(2);
  };

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
      {step === 1 && (
        <EnterPhoneNumberForm
          signupText="Redeem rewards for account"
          onNext={handleSubmit}
        />
      )}
      {step === 2 && (
        <VerifyOTPForm
          signupText="Redeem rewards for account"
          phoneNumber={phoneNumber}
        />
      )}
    </div>
  );
};

export default CollectStampsPage;
