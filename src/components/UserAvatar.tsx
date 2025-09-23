// components/UserAvatar.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  userId: string;
  username?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
}

export default function UserAvatar({ 
  userId,
  username, 
  size = 'md', 
  className 
}: UserAvatarProps) {
  const [error, setError] = useState(false);

  const sizeMap = {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 },
    xl: { width: 96, height: 96 },
    xxl: { width: 128, height: 128 }
  };

  const { width, height } = sizeMap[size];
  const avatarUrl = `https://s3.timeweb.cloud/576b093c-bf65d329-1603-4121-b476-e46d7ce3cb2a/userProfile/${userId}.png`;
  const fallbackSrc = "/que-placeholder.png";

  if (error) {
    // показываем fallback
    return (
      <Image
        src={fallbackSrc}
        alt={username || "User Avatar"}
        width={width}
        height={height}
        className={cn("rounded-full object-cover border-2 border-gray-300", className)}
      />
    );
  }

  return (
    <Image
      src={avatarUrl}
      alt={username || "User Avatar"}
      width={width}
      height={height}
      className={cn("rounded-full object-cover border-2 border-gray-300", className)}
      onError={() => setError(true)}
      referrerPolicy="no-referrer"
    />
  );
}