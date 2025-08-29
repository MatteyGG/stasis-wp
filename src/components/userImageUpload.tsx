// components/UploadImage.tsx
'use client';

import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

export default function UploadImage({
  children,
  userId,
  method,
  onUploadComplete,
  className = ""
}: Readonly<{
  children: React.ReactNode;
  userId: string;
  method: "userScreen" | "userProfile" | "gallery";
  onUploadComplete?: () => void;
  className?: string;
}>) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    if (!target.files || target.files.length === 0) {
      return;
    }

    const selectedFile = target.files[0];
    if (!selectedFile) {
      return;
    }

    // Проверяем тип файла
    if (!selectedFile.type.startsWith('image/')) {
      toast.error("Пожалуйста, выберите файл изображения");
      return;
    }

    // Проверяем размер файла (максимум 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("Размер файла не должен превышать 5MB");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (file === null) {
      toast.error("Пожалуйста, выберите файл");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    formData.append("endPath", method);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка загрузки! Статус: ${response.status}, Текст: ${errorText}`);
      }

      const data = await response.json();
      console.log("Успешная загрузка:", data);

      toast.success("Изображение успешно загружено!");
      
      if (onUploadComplete) {
        onUploadComplete();
      }
      
      // Сбрасываем значение input
      const fileInput = document.getElementById(`file-${method}`) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
      setFile(null);
      
    } catch (error) {
      console.error("Error:", error);
      toast.error("Ошибка при загрузке изображения");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor={`file-${method}`}>
          {file ? file.name : "Выберите изображение"}
        </Label>
        <Input 
          id={`file-${method}`} 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
      </div>
      <Button 
        onClick={handleUpload} 
        disabled={isUploading || !file}
        className="w-full"
      >
        {isUploading ? "Загрузка..." : children}
      </Button>
    </div>
  );
}