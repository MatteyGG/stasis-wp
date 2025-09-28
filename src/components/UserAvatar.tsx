// components/UserAvatar.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  userId: string;
  username?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
  version?: string;
}

export default function UserAvatar({ 
  userId,
  username, 
  size = 'md', 
  className,
  version
}: UserAvatarProps) {
  const [error, setError] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState('');

  const sizeMap = {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 },
    xl: { width: 96, height: 96 },
    xxl: { width: 128, height: 128 }
  };

  // Инициализация только на клиенте
  useEffect(() => {
    setAvatarVersion(version || Date.now().toString());
  }, [version]);

  const { width, height } = sizeMap[size];
  
  const avatarUrl = `https://s3.timeweb.cloud/576b093c-bf65d329-1603-4121-b476-e46d7ce3cb2a/userProfile/${userId}.png?v=${avatarVersion}`;
  const fallbackSrc = "/que-placeholder.png";

  // Показываем fallback пока не инициализировали версию или при ошибке
  if (error || !avatarVersion) {
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