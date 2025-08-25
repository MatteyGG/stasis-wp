// app/profile/me/page.tsx
'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function ProfileMePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Предотвращаем множественные перенаправления
    if (hasRedirected.current) return;
    
    if (status === "unauthenticated") {
      hasRedirected.current = true;
      router.push('/signin');
    } else if (status === "authenticated" && session?.user?.id) {
      hasRedirected.current = true;
      router.push(`/profile/${session.user.id}`);
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return null;
}