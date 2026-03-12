// components/settings/AvatarUpload.tsx
'use client';

import { useState, useRef, ChangeEvent } from "react";
import { toast } from "react-toastify";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
interface AvatarUploadProps {
  userId: string;
  username?: string | null;
}

export default function AvatarUpload({ 
  userId, 
  username 
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session, update } = useSession();

  const router = useRouter();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Валидация файла
    if (!file.type.startsWith('image/')) {
      toast.error("Пожалуйста, выберите файл изображения");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Размер файла не должен превышать 5MB");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("endPath", "userProfile");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        toast.success("Аватар успешно обновлен!");
        router.refresh();
        
        await update({
          user: {
            ...session?.user,
            avatarVersion: result.avatarVersion
          }
        });
        
        console.log("✅ Session updated with new avatar version:", result.avatarVersion);
        
      } else {
        throw new Error(result.error || "Unknown error");
      }
      
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Ошибка при загрузке аватара");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3 md:space-y-4">
      <div className="relative">
        <UserAvatar 
          userId={userId} 
          username={username} 
          version={session?.user?.avatarVersion}
          size="xxl" 
        />
      </div>
      
      <div className="w-full max-w-xs">
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
        <Button 
          variant="outline" 
          className="w-full text-xs md:text-sm py-1 md:py-2 h-auto"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? "Загрузка..." : "Сменить аватар"}
        </Button>
        
        <p className="text-xs text-muted-foreground mt-1 md:mt-2 text-center">
          JPG, PNG или GIF. Максимум 5MB.
        </p>
        <p className="text-xs text-muted-foreground text-center">
          Аватар обновится автоматически во всем приложении.
        </p>
      </div>
    </div>
  );
}