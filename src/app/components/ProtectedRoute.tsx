'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tokenManager } from '@/app/lib/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    if (!tokenManager.hasToken()) {
      router.push('/login');
    }
  }, [router]);

  if (!tokenManager.hasToken()) {
    return null; // or loading spinner
  }

  return <>{children}</>;
}
