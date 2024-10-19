'use client'

import Image from "next/image";
import dynamic from "next/dynamic";
import { Suspense } from "react";


const EditorComp = dynamic(() => import("../../components/EditorComponent"), { ssr: false });

const markdown = `
# Hello **world**!
`;

export default function Editor() {
  const EditorSave = async function (ev) {
    ev.preventDefault();
    console.log({ markdown });
    const response = await fetch("/api/markdownNew", {
      method: "POST",
      body: JSON.stringify({ markdown }),
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
          <button className="w-full bg-white p-2 rounded-2xl" onClick={EditorSave}>Опубликовать</button>
        </div>
      </section>
    </>
  );
}
