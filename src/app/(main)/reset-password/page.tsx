'use client';

import { useState, useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import CreamContainer from '@/components/layout/cream-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabaseClient';

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Check if we have a session
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const isRecovery = searchParams.get('type') === 'recovery';

      // console.log('Session:', session);
      // console.log('Is Recovery:', isRecovery);

      // If we have a session and we're in a recovery flow, stay on the page
      if (session && isRecovery) {
        return;
      }

      // If we have a session but not in recovery, go to dashboard
      if (session && !isRecovery) {
        router.push('/dashboard');
        return;
      }

      // If we don't have a session and not in recovery, go to login
      if (!session && !isRecovery) {
        router.push('/login');
        return;
      }
    };

    checkSession();
  }, [router, searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg(
          'Password has been reset successfully, redirecting to login page...',
        );
        // Sign out the user after password reset
        await supabase.auth.signOut();
        setRedirecting(true);
        // Wait a moment before redirecting to show the success message
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (error) {
      setErrorMsg('An error occurred while resetting your password');
    }
    setLoading(false);
  };

  return (
    <CreamContainer>
      <section className="py-28 lg:pt-44 lg:pb-32">
        <div className="container">
          <div className="mx-auto max-w-sm">
            <h1 className="mb-6 text-center text-2xl font-bold">
              Reset Password
            </h1>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <Input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
              {successMsg && (
                <p className="text-sm text-green-500">{successMsg}</p>
              )}
              <Button type="submit" disabled={loading || redirecting}>
                {loading
                  ? 'Resetting...'
                  : redirecting
                    ? 'Redirecting...'
                    : 'Reset Password'}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </CreamContainer>
  );
};

export default ResetPassword;
