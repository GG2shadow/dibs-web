'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { OurBusinessProfile } from '@/components/ui/OurComponents/OurBusinessProfile';
import { AdminStampsForm } from '@/components/ui/Stamps/AdminStampsForm';
import { supabase } from '@/lib/supabaseClient';

const AdminPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    // Check for an active session
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Redirect to login if no session is found
        router.push('/login');
      } else {
        // User is logged in; stop showing the loading indicator
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle phone number submission logic here
    console.log('Phone number submitted:', phoneNumber);
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          minHeight: '100vh',
        }}
      >
        Loading...
      </div>
    );
  }

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
      <AdminStampsForm />
    </div>
  );
};

export default AdminPage;
