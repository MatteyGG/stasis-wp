// components/UserAvatar.tsx
'use client';

import { cn } from '@/lib/utils';

interface UserAvatarProps {
  userId: string;
  username?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
  version?: string | null; // опциональная версия, если передана извне
}

export default function UserAvatar({ 
  userId,
  username, 
  size = 'md', 
  className,
  version
}: UserAvatarProps) {
  
  const sizeMap = {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 },
    xl: { width: 96, height: 96 },
    xxl: { width: 128, height: 128 }
  };

  const { width, height } = sizeMap[size];
  const prefix = "https://s3.timeweb.cloud/576b093c-bf65d329-1603-4121-b476-e46d7ce3cb2a/userProfile/";
  
  // Используем версию из пропсов, из сессии или fallback
  const avatarVersion = version|| "default";
  const avatarUrl = `${prefix}${userId}.png?v=${avatarVersion}`;

  const fallbackSrc = "/que-placeholder.png";

  return (
    <img
      src={avatarUrl}
      alt={username || "User Avatar"}
      width={width}
      height={height}
      className={cn("rounded-full object-cover border-2 border-gray-300", className)}
      onError={(e) => {
        e.currentTarget.src = fallbackSrc;
      }}
    />
  );
}