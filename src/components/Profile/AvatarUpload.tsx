// components/settings/AvatarUpload.tsx
'use client';

import { useState, useRef, ChangeEvent } from "react";
import { toast } from "react-toastify";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";

interface AvatarUploadProps {
  userId: string;
  username?: string | null;
  onAvatarUpdate?: () => void;
}

export default function AvatarUpload({ 
  userId, 
  username, 
  onAvatarUpdate 
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    // Программно кликаем по скрытому input
    fileInputRef.current?.click();
  };

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
    formData.append("userId", userId);
    formData.append("endPath", "userProfile");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }

      toast.success("Аватар успешно обновлен!");
      
      if (onAvatarUpdate) {
        onAvatarUpdate();
      } else {
        setTimeout(() => window.location.reload(), 1000);
      }
      
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Ошибка при загрузке аватара");
    } finally {
      setIsUploading(false);
      // Сбрасываем значение input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3 md:space-y-4">
      <div className="relative">
        <UserAvatar userId={userId} username={username} size="xxl" />
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
          onClick={handleButtonClick}
        >
          {isUploading ? "Загрузка..." : "Сменить аватар"}
        </Button>
        <p className="text-xs text-muted-foreground mt-1 md:mt-2 text-center">
          JPG, PNG или GIF. Максимум 5MB.
        </p>
      </div>
    </div>
  );
}