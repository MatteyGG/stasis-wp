import Image from "next/image";
import dynamic from "next/dynamic";
import { Suspense } from "react";


const EditorComp = dynamic(() => import("../components/EditorComponent"), { ssr: false });

const markdown = `
# Hello **world**!
`;

export default function Home() {
  return (
    <>
      <section className="flex flex-col items-center justify-center">
        <h1 className="text-4xl">Edit wiki page</h1>
        <p>Enter your markdown here</p>
        <div className="Editor">
          <Suspense fallback={null}>
            <EditorComp markdown={markdown} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
