'use client';

import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface ShareProfileButtonProps {
  userId: string;
}


const notifyCopy = (message: string) => {
  toast.success(message, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};


export default function ShareProfileButton({ userId }: ShareProfileButtonProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const copyToClipboard = async () => {
    try {
      const profileUrl = `${window.location.origin}/public-profile/${userId}`;
      await navigator.clipboard.writeText(profileUrl);
       
      notifyCopy("Ссылка скопирована");
       
    } catch (err) {
      console.error('Failed to copy: ', err);
      
    }
  };

  // Не рендерим кнопку на сервере
  if (!isClient) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Copy className="mr-2 h-4 w-4" />
        Скопировать ссылку
      </Button>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={copyToClipboard}>
      <Copy className="mr-2 h-4 w-4" />
      Скопировать ссылку
    </Button>
  );
}