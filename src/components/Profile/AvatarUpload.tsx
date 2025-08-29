// components/settings/AvatarUpload.tsx
'use client';

import ImageWithFallback from '@/components/ImageWithFallback';
import { Button } from '@/components/ui/button';
import { useState, ChangeEvent } from "react";
import { toast } from "react-toastify";

export default function AvatarUpload({ userId, username }: { userId: string; username: string; }) {
  const [isUploading, setIsUploading] = useState(false);
  const avatarImage = `https://s3.timeweb.cloud/576b093c-bf65d329-1603-4121-b476-e46d7ce3cb2a/userProfile/${userId}.png`;
  const fallbackAvatar = "/source/help/profile.png";

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    if (!target.files || target.files.length === 0) {
      return;
    }

    const file = target.files[0];
    if (!file) {
      return;
    }

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      toast.error("Пожалуйста, выберите файл изображения");
      return;
    }

    // Проверяем размер файла (максимум 5MB)
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
        throw new Error(`Ошибка загрузки! Статус: ${response.status}, Текст: ${errorText}`);
      }

      toast.success("Аватар успешно обновлен!");
      
      // Обновляем страницу через несколько секунд
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error("Error:", error);
      toast.error("Ошибка при загрузке аватара");
    } finally {
      setIsUploading(false);
      // Сбрасываем значение input
      target.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3 md:space-y-4">
      <div className="relative">
        <ImageWithFallback
          className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover border-2 border-gray-300"
          src={avatarImage}
          fallbackSrc={fallbackAvatar}
          alt={username}
          width={128}
          height={128}
        />
      </div>
      
      <div className="w-full max-w-xs">
        <input 
          id="avatar-upload" 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="avatar-upload" className="w-full">
          <Button 
            variant="outline" 
            className="w-full text-xs md:text-sm py-1 md:py-2 h-auto"
            disabled={isUploading}
            asChild
          >
            <span>
              {isUploading ? "Загрузка..." : "Сменить аватар"}
            </span>
          </Button>
        </label>
        <p className="text-xs text-muted-foreground mt-1 md:mt-2 text-center">
          JPG, PNG или GIF. Максимум 5MB.
        </p>
      </div>
    </div>
  );
}