'use client';

import { useState, useEffect } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { FcGoogle } from 'react-icons/fc';

import CreamContainer from '@/components/layout/cream-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabaseClient';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push('/');
      }
    };

    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      if (rememberMe) {
        await supabase.auth.setSession({
          access_token:
            (await supabase.auth.getSession()).data.session?.access_token || '',
          refresh_token:
            (await supabase.auth.getSession()).data.session?.refresh_token ||
            '',
        });
      }
      router.push('/');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResetLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password?type=recovery`,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setResetSuccess(true);
    }
    setResetLoading(false);
  };

  const closeModal = () => {
    setShowForgotPassword(false);
    setResetEmail('');
    setErrorMsg(null);
    setResetSuccess(false);
  };

  return (
    <CreamContainer>
      <section className="py-28 lg:pt-44 lg:pb-32">
        <div className="container">
          <div className="flex flex-col gap-4">
            <Card className="mx-auto w-full max-w-sm">
              <CardHeader className="flex flex-col items-center space-y-0">
                <div className="mb-3 flex items-center gap-2">
                  <Image
                    src="/dibs-logo-red.png"
                    alt="Dibs Logo"
                    width={32}
                    height={32}
                  />
                  <span className="text-dibs-red text-lg font-semibold">
                    Dibs
                  </span>
                </div>
                <p className="mb-2 text-2xl font-bold">Welcome back</p>
                <p className="text-muted-foreground">
                  Please enter your details.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {errorMsg && (
                    <p className="text-sm text-red-500">{errorMsg}</p>
                  )}
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) =>
                          setRememberMe(checked as boolean)
                        }
                        className="border-muted-foreground"
                      />
                      <label
                        htmlFor="remember"
                        className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember me
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-dibs-red text-sm font-medium"
                    >
                      Forgot password
                    </button>
                  </div>
                  <Button
                    type="submit"
                    className="mt-2 w-full bg-[var(--color-dibs-red)] hover:bg-[var(--color-dibs-red-hover)] active:bg-[var(--color-dibs-red-pressed)]"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                  >
                    <FcGoogle className="mr-2 size-5" />
                    {loading ? 'Signing in...' : 'Sign in with Google'}
                  </Button>
                </form>
                <div className="text-muted-foreground mx-auto mt-8 flex justify-center gap-1 text-sm">
                  <p>Don&apos;t have an account?</p>
                  <Link href="/sign-up" className="text-dibs-red font-medium">
                    Sign up
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Forgot Password Modal */}
            {showForgotPassword && (
              <div
                className="fixed inset-0 flex items-center justify-center bg-black/50"
                onClick={closeModal}
              >
                <Card
                  className="w-full max-w-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CardHeader>
                    <h2 className="text-2xl font-bold">Reset Password</h2>
                    <p className="text-muted-foreground">
                      Enter your email address and we'll send you a link to
                      reset your password.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={handleForgotPassword}
                      className="grid gap-4"
                    >
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                      />
                      {errorMsg && (
                        <p className="text-sm text-red-500">{errorMsg}</p>
                      )}
                      {resetSuccess && (
                        <p className="text-sm text-green-500">
                          Password reset link has been sent to your email.
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={closeModal}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 bg-[var(--color-dibs-red)] hover:bg-[var(--color-dibs-red-hover)] active:bg-[var(--color-dibs-red-pressed)]"
                          disabled={resetLoading}
                        >
                          {resetLoading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>
    </CreamContainer>
  );
};

export default Login;
