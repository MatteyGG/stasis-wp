import { readdirSync, readFileSync } from "fs";
import { join } from "path";

import Image from "next/image";

export default async function gallery() {
  const images = readdirSync(join(process.cwd(), "public")).filter((file) =>
    file.endsWith(".png") || file.endsWith(".jpg")
  );
  return (
    <div className="container h-full min-h-64 md:h-2/3 shadow-sm shadow-black mx-auto p-4 rounded-xl  backdrop-blur-3xl">
      <h1 className="text-2xl text-center">Gallery</h1>
      <div className="h-full  text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="h-full">
              <Image
                src={"/" + image}
                alt={image}
                height={128}
                width={128}
              />
              <span className="text-sm">{image}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

