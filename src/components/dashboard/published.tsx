"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, EyeOff } from "lucide-react";

interface PublishedProps {
  published: boolean;
  pageid: string;
}

export default function Published({ published, pageid }: PublishedProps) {
  const [isPublished, setIsPublished] = useState(published);
  const [isLoading, setIsLoading] = useState(false);

  const handlePublish = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/markdown/${pageid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ published: !isPublished }),
      });

      if (response.ok) {
        setIsPublished(!isPublished);
        toast.success(`Статья ${isPublished ? "снята с публикации" : "опубликована"}`);
      } else {
        throw new Error("Ошибка изменения статуса");
      }
    } catch (error) {
      console.error("Publish error:", error);
      toast.error("Ошибка во время изменения статуса статьи");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Вы уверены, что хотите удалить эту статью?")) return;

    try {
      const response = await fetch(`/api/markdown/${pageid}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Статья удалена");
        // Обновляем страницу после удаления
        window.location.reload();
      } else {
        throw new Error("Ошибка удаления");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Ошибка во время удаления статьи");
    }
  };

  return (
    <div className="flex space-x-2">
      <Link href={`/edit?pageid=${pageid}`}>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-1" />
          Редактировать
        </Button>
      </Link>
      
      <Button
        variant={isPublished ? "outline" : "default"}
        size="sm"
        onClick={handlePublish}
        disabled={isLoading}
      >
        {isPublished ? (
          <EyeOff className="h-4 w-4 mr-1" />
        ) : (
          <Eye className="h-4 w-4 mr-1" />
        )}
        {isPublished ? "Скрыть" : "Опубликовать"}
      </Button>
      
      <Button
        variant="destructive"
        size="sm"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}