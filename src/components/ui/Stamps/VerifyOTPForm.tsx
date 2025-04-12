import React, { useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { Label } from '../label';
import OurLabel from '../OurComponents/OurLabel';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Signup2Props {
  signupText?: string;
  phoneNumber: string;
}

const VerifyOTPForm = ({
  signupText = 'Redeem rewards for account',
  phoneNumber,
}: Signup2Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otp, setOtp] = useState(Array(6).fill(''));

  const router = useRouter();
  const { uuid } = useParams(); // Extract the dynamic route parameter

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 7) {
        document.getElementById(`otp-input-${index + 1}`)?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://xgidujoanslsfwwtqidj.supabase.co/functions/v1/verify-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnaWR1am9hbnNsc2Z3d3RxaWRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzc4NTM4MywiZXhwIjoyMDUzMzYxMzgzfQ.RN_VqNSkN3gHk4JngkIaClgn0tmM-aDCxGtWaELLXDM`,
          },
          // Add any required body parameters here
          body: JSON.stringify({
            phone_number: phoneNumber,
            otp_code: otp.join(''),
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
      // alert(result.message)
      await redeemRewards();
    } catch (err) {
      const errorText =
        err instanceof Error ? err.message : 'Failed to submit form';
      setError(errorText);
      alert(errorText);
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoadingOtp(true);
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
          body: JSON.stringify({ phone_number: phoneNumber }),
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
    } catch (err) {
      const errorText =
        err instanceof Error ? err.message : 'Failed to submit form';
      setError(errorText);
      alert(errorText);
    } finally {
      setIsLoadingOtp(false);
    }
  };

  async function redeemRewards() {
    setIsLoadingOtp(true);
    setError(null);

    try {
      const response = await fetch(
        `https://xgidujoanslsfwwtqidj.supabase.co/functions/v1/redeem-rewards`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnaWR1am9hbnNsc2Z3d3RxaWRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzc4NTM4MywiZXhwIjoyMDUzMzYxMzgzfQ.RN_VqNSkN3gHk4JngkIaClgn0tmM-aDCxGtWaELLXDM`,
          },
          // Add any required body parameters here
          body: JSON.stringify({
            transaction_id: uuid,
            phone_number: phoneNumber,
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
      setIsLoadingOtp(false);
    }
  }

  return (
    <section className="pb-16">
      <form className="container" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <div className="mb-6 flex flex-col items-center"></div>
          <div className="mx-auto w-full max-w-sm rounded-md p-6 shadow">
            <div>
              <OurLabel>Please verify the OTP.</OurLabel>
              <div className="text-muted-foreground mx-auto flex justify-start gap-1 text-sm">
                <p>Enter the 6-digit code sent to</p>
                <p className="text-primary">+{phoneNumber}.</p>
              </div>
              <div className="mt-2 grid grid-cols-6 gap-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    maxLength={1}
                    className="h-12 w-full rounded border border-gray-300 text-center"
                  />
                ))}
              </div>
              <Button
                type="submit"
                className="mt-6 w-full bg-[var(--color-dibs-red)] text-white hover:bg-[var(--color-dibs-red-hover)] active:bg-[var(--color-dibs-red-pressed)]"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : signupText}
              </Button>
              <Button
                type="button"
                className="mt-2 w-full"
                disabled={isLoadingOtp}
                onClick={resendOTP}
                variant="secondary"
              >
                {isLoadingOtp ? 'Resending OTP...' : 'Resend OTP code'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export { VerifyOTPForm };
