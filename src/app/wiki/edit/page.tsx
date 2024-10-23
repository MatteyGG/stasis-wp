"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import React from "react";
import { useState, useRef, FormEvent } from "react";

const EditorComp = dynamic(() => import("../../components/EditorComponent"), {
  ssr: false,
});

export default function Editor() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");	
  const [short, setShort] = useState("");
  const [image, setImage] = useState({ src: "placeholder.png", alt: "placeholder" });
  const [markdown, setMarkdown] = useState("# Начните *писать*");

  const ref = React.useRef<MDXEditorMethods>(null);

  const EditorSave = async function (ev: FormEvent) {
    ev.preventDefault();
    const response = await fetch("/api/markdownNew", {
      method: "POST",
      body: JSON.stringify({
        title,
        short,
        markdown: ref.current?.getMarkdown(),
        category,
        image: image.src,
        imageAlt: image.alt,
      }),
    });
    if (response.ok) {
      console.log("Saved markdown: ", response);
    } else {
      console.error("Failed to save markdown: ", response);
    }
  };
  return (
    <>
      <section className="flex flex-col items-center justify-center">
        <h1 className="text-4xl">Edit wiki page</h1>
        <p>Enter your markdown here</p>
        <button onClick={() => console.log(ref.current?.getMarkdown())}>
          Get markdown
        </button>
        <div className="Editor">
          <Suspense fallback={<>Loading...</>}>
            <EditorComp editorRef={ref} markdown={markdown} />
          </Suspense>
          <form>
            <div className="grid grid-cols-2">
              <div>
                <input
                  type="text"
                  id="title"
                  className="bg-white p-2 rounded-md w-full"
                  placeholder="Название"
                  required
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="text"
                  id="title"
                  className="bg-white p-2 rounded-md w-full"
                  placeholder="Категория"
                  required
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  id="short"
                  className="bg-white p-2 rounded-md w-full"
                  placeholder="Короткое описание"
                  required
                  onChange={(e) => setShort(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  id="image"
                  className="bg-white p-2 rounded-md w-1/2"
                  placeholder="Ссылка на Изображение"
                  onChange={(e) =>
                    setImage({ src: e.target.value, alt: e.target.value })
                  }
                />
                <input
                  type="text"
                  id="imageAlt"
                  className="bg-white p-2 rounded-md w-1/2"
                  placeholder="Описание изображения"
                  onChange={(e) =>
                    setImage({ src: image.src, alt: e.target.value })
                  }
                />
              </div>
            </div>
          </form>

          <button
            type="submit"
            className="w-full bg-white p-2 rounded-xl"
            onClick={EditorSave}
          >
            Опубликовать
          </button>
        </div>
      </section>
    </>
  );
}
