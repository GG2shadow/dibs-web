// app/reset-password/page.tsx (Server Component)
import { Suspense } from 'react';

import ResetPasswordForm from '@/components/ui/Auth/reset-password-form';

export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
