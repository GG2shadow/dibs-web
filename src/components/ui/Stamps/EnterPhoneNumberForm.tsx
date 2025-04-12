import React, { useState } from 'react';

import { Label } from '../label';
import OurLabel from '../OurComponents/OurLabel';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Signup2Props {
  signupText?: string;
  isSendOtp?: boolean;
  isOutsideLoading?: boolean;
  onNext: (newPhone: string) => void;
}

const EnterPhoneNumberForm = ({
  signupText = 'Add stamps to account',
  isSendOtp = true,
  isOutsideLoading = false,
  onNext,
}: Signup2Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (phone.trim() === '') {
      alert('Please enter your phone number');
      return;
    }
    const cleanedPhone = phone.replace(/\+/g, ''); // Removes all "+" occurrences

    if (isSendOtp) {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://xgidujoanslsfwwtqidj.supabase.co/functions/v1/send-otp`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnaWR1am9hbnNsc2Z3d3RxaWRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzc4NTM4MywiZXhwIjoyMDUzMzYxMzgzfQ.RN_VqNSkN3gHk4JngkIaClgn0tmM-aDCxGtWaELLXDM`,
            },
            // Add any required body parameters here
            body: JSON.stringify({ phone_number: cleanedPhone }),
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

        onNext(cleanedPhone); // Move to the next step
      } catch (err) {
        const errorText =
          err instanceof Error ? err.message : 'Failed to submit form';
        setError(errorText);
        alert(errorText);
      } finally {
        setIsLoading(false);
      }
    } else {
      onNext(cleanedPhone); // Move to the next step
    }
  };

  return (
    <section className="pb-16">
      <form className="container" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <div className="mx-auto w-full max-w-sm rounded-md p-6 shadow">
            <div>
              <OurLabel>Phone number</OurLabel>
              <div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={phone}
                  className="mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:ring focus:ring-blue-300"
                  placeholder="Singaporean phone number."
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="mt-6 w-full bg-[var(--color-dibs-red)] text-white hover:bg-[var(--color-dibs-red-hover)] active:bg-[var(--color-dibs-red-pressed)]"
                disabled={isLoading || isOutsideLoading}
              >
                {isLoading || isOutsideLoading ? 'Submitting...' : signupText}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export { EnterPhoneNumberForm };
