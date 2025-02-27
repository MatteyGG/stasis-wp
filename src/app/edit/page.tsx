"use client";

import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useState, FormEvent, useRef } from "react";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

const EditorComp = dynamic(() => import("@/app/components/EditorComponent"), {
  ssr: false,
});


export default function Editor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageid = searchParams.get("pageid");

  const [title, setTitle] = useState("");
  const [short, setShort] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [categories, setCategories] = useState<
    { id: number; name: string; createdAt: string }[] | undefined
  >();
  useEffect(() => {
    if (pageid === null) return setMarkdown("# Начните **писать**");
    (async () => {
      try {
        const response = await fetch(`/api/markdown/${pageid}`, {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          setTitle(data.title);
          setShort(data.short);
          setCategory(data.category);
          setImage(data.scr);
          setImageAlt(data.alt);
          setMarkdown(data.md);
          console.log(data.md);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [pageid]);
  useEffect(() => {
    fetch("/api/category")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.data);
        console.log(data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  const ref = useRef<MDXEditorMethods>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.setMarkdown(markdown);
    }
  }, [markdown]);

  const EditorSave = async function (ev: FormEvent) {
    ev.preventDefault();
    console.log({ title, short, markdown, category, image, imageAlt });
    const response = await fetch("/api/markdown", {
      method: "POST",
      body: JSON.stringify({
        title,
        short,
        markdown: ref.current?.getMarkdown(),
        category: category,
        image,
        imageAlt,
        pageId: pageid,
      }),
    });
    if (response.ok) {
      console.log("Saved markdown: ", response);
      if (pageid) {
        router.push(`/wiki/${category}/${pageid}`);
      } 
    } else {
      console.error("Failed to save markdown: ", response);
    }
  };

  return (
    <>
      <section className="flex flex-col items-center justify-center p-12">
        <h1 className="text-4xl">Страница создания wiki-страниц</h1>
        <button onClick={() => console.log(ref.current?.getMarkdown())}>
          Отладка через консоль
        </button>
        <div className="Editor min-h-3/4">
          <div className="w-full h-full ">
            <Suspense fallback={<>Loading...</>}>
              <EditorComp markdown={markdown} editorRef={ref} />
            </Suspense>
          </div>
          <form className="w-full">
            <div className="grid grid-cols-2">
              <div>
                <input
                  type="text"
                  id="title"
                  className="bg-white p-2 rounded-md w-full"
                  placeholder="Заголовок"
                  required
                  onChange={(e) => setTitle(e.target.value)}
                  defaultValue={title}
                />
              </div>
              <div>
                <select
                  id="category"
                  className="bg-white p-2 rounded-md w-full"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Выберите категорию</option>
                  {categories && categories?.length > 0 ? (
                    categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Категории не найдены</option>
                  )}
                </select>
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  id="short"
                  className="bg-white p-2 rounded-md w-full"
                  placeholder="Короткое описание"
                  required
                  onChange={(e) => setShort(e.target.value)}
                  defaultValue={short}
                />
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  id="image"
                  className="bg-white p-2 rounded-md w-1/2"
                  placeholder="Ссылка на Изображение"
                  onChange={(e) => setImage(e.target.value)}
                  defaultValue={image}
                />
                <input
                  type="text"
                  id="imageAlt"
                  className="bg-white p-2 rounded-md w-1/2"
                  placeholder="Описание изображения"
                  onChange={(e) => setImageAlt(e.target.value)}
                  defaultValue={imageAlt}
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-white p-2 rounded-xl"
              onClick={EditorSave}
            >
              Сохранить
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

