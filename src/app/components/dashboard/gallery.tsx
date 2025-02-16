import { readdirSync } from "fs";
import { join } from "path";

import Image from "next/image";
import UploadImage from "../userImageUpload";

export default async function gallery() {
  const images = readdirSync(join(process.cwd(), "public/gallery")).filter(
    (file) => file.endsWith(".png") || file.endsWith(".jpg")
  );
  return (
    <div className="container flex flex-col shadow-sm shadow-black mx-auto p-4 rounded-xl  backdrop-blur-3xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="flex flex-col py-2 justify-center items-center  bg-slate-200 rounded-md shadow-sm shadow-slate-400"
          >
            <Image
              src={"/gallery/" + image}
              alt={image}
              height={128}
              width={128}
            />
            <p className="mt-2 text-sm text-balance">{image}</p>
          </div>
        ))}
      </div>
      <div>
        <UploadImage userId={"all"} method="gallery">
          Загрузить
        </UploadImage>
      </div>
    </div>
  );
}
