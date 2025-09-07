// src/app/edit/page.tsx

"use client";

import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useState, FormEvent, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Save, Eye, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const EditorComp = dynamic(() => import("@/components/EditorComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full bg-gray-100 animate-pulse rounded-lg"></div>
  ),
});

// Выносим основной контент в отдельный компонент, который использует useSearchParams
function EditPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageid = searchParams.get("pageid");

  const [title, setTitle] = useState("");
  const [short, setShort] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const ref = useRef<MDXEditorMethods>(null);

  const fetchArticleData = useCallback(async () => {
    try {
      const response = await fetch(`/api/markdown/${pageid}`);
      if (response.ok) {
        const data = await response.json();
        setTitle(data.title || "");
        setShort(data.short || "");
        setCategory(data.category || "");
        setImage(data.scr || "");
        setImageAlt(data.alt || "");
        setMarkdown(data.md || "");
        setIsPublished(data.published || false);

        if (data.tags) {
          setTags(Array.isArray(data.tags) ? data.tags : JSON.parse(data.tags));
        }
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      toast.error("Ошибка загрузки статьи");
    }
  }, [pageid]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/category");
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  useEffect(() => {
    if (pageid) {
      fetchArticleData();
    } else {
      setMarkdown("# Начните **писать**");
    }
    
    fetchCategories();
  }, [pageid, fetchArticleData, fetchCategories]);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const EditorSave = async (ev: FormEvent) => {
    ev.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/markdown", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          short,
          markdown: ref.current?.getMarkdown(),
          category,
          image,
          imageAlt,
          pageId: pageid,
          tags,
        }),
      });

      if (response.ok) {
        toast.success("Статья сохранена успешно!");
        const data = await response.json();

        if (!pageid) {
          // Если это новая статья, перенаправляем на её страницу редактирования
          router.push(`/edit?pageid=${data.pageId}`);
        }
      } else {
        throw new Error("Ошибка сохранения");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Ошибка сохранения статьи");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    if (category && pageid) {
      window.open(`/wiki/${category}/${pageid}`, "_blank");
    } else {
      toast.info("Сохраните статью сначала для предпросмотра");
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {pageid ? "Редактирование статьи" : "Создание новой статьи"}
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePreview}
            disabled={!category || !pageid}
          >
            <Eye className="mr-2 h-4 w-4" />
            Предпросмотр
          </Button>
          <Button onClick={EditorSave} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Сохранить
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Метаданные статьи */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Метаданные статьи</CardTitle>
              <CardDescription>Основная информация о статье</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Заголовок</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Введите заголовок статьи"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="short">Краткое описание</Label>
                <Input
                  id="short"
                  value={short}
                  onChange={(e) => setShort(e.target.value)}
                  placeholder="Краткое описание статьи"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Категория</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Ссылка на изображение</Label>
                <Input
                  id="image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="URL изображения для превью"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageAlt">Описание изображения</Label>
                <Input
                  id="imageAlt"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Альт-текст для изображения"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Теги</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Введите тег и нажмите Enter"
                  />
                  <Button type="button" onClick={handleAddTag} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 rounded-full hover:bg-gray-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {pageid && (
                <div className="flex items-center space-x-2">
                  <Label htmlFor="published">Статус:</Label>
                  <Badge variant={isPublished ? "default" : "secondary"}>
                    {isPublished ? "Опубликовано" : "Черновик"}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Советы по форматированию</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="list-disc list-inside space-y-1">
                <li>Используйте заголовки разных уровней для структуры</li>
                <li>Добавляйте изображения для наглядности</li>
                <li>Используйте списки для перечислений</li>
                <li>Выделяйте важное жирным или курсивом</li>
                <li>Добавляйте теги для лучшей categorization</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Редактор контента */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Содержание статьи</CardTitle>
              <CardDescription>
                Используйте панель инструментов для форматирования
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense
                fallback={
                  <div className="h-96 bg-gray-100 animate-pulse rounded-lg"></div>
                }
              >
                <EditorComp markdown={markdown} editorRef={ref} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Основной компонент страницы, который оборачивает контент в Suspense
export default function Editor() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-6 px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Загрузка редактора...</h1>
        </div>
        <div className="h-96 bg-gray-100 animate-pulse rounded-lg"></div>
      </div>
    }>
      <EditPageContent />
    </Suspense>
  );
}