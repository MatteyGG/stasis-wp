import { prisma } from "../prisma";

import Image from "next/image";
import UploadForm from "./upload";

export default async function gallery() {
  const image_array = await prisma.image.findMany({
    where: {
      filename: { not: "" },
    },
  });
  console.log(image_array);
  return (
    <div className="w-full">
      <h1 className="text-2xl text-center">Gallery</h1>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
        {image_array.map((image, index) => (
          <div key={index}>
            <Image
              src={"/" + image.filename}
              alt={image.filename}
              height={128}
              width={128}
            />
            <span>{image.filename}</span>
          </div>
        ))}
      </div>
      <UploadForm />
    </div>
  );
}
