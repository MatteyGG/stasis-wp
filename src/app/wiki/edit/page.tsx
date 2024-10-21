"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

import { useState, FormEvent } from "react";

const EditorComp = dynamic(() => import("../../components/EditorComponent"), {
  ssr: false,
});

const markdown = `
# Hello **world**!
`;

export default function Editor() {
  const [title, setTitle] = useState("");
  const [short, setShort] = useState("");
  const [image, setImage] = useState("");

  const EditorSave = async function (ev: FormEvent) {
    ev.preventDefault();
    console.log({ markdown });
    const response = await fetch("/api/markdownNew", {
      method: "POST",
      body: JSON.stringify({ title, short, markdown }),
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
        <div className="Editor">
          <Suspense fallback={null}>
            <EditorComp markdown={markdown} />
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
                  id="short"
                  className="bg-white p-2 rounded-md w-full"
                  placeholder="Короткое описание"
                  required
                  onChange={(e) => setShort(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <input
                  className="block w-full text-sm text-gray-900 border border-gray-700 rounded-lg cursor-pointer bg-gray-50 focus:outline-none bg-gradient-to-br from-blue-200 to-blue-100"
                  aria-describedby="file_input_help"
                  id="file_input"
                  type="file"
                  onChange={(e) => setImage(e.target.files[0].name)}
                />
                <p
                  className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                  id="file_input_help"
                >
                  SVG, PNG, JPG.
                </p>
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
