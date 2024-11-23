import { prisma } from "../../prisma";

import Image from "next/image";
// import UploadForm from "../upload";

export default async function gallery() {
  const image_array = await prisma.image.findMany({
    where: {
      filename: { not: "" },
    },
  });
  return (
    <div className="container h-full min-h-64 md:h-2/3 shadow-sm shadow-black mx-auto p-4 rounded-xl  backdrop-blur-3xl">
      <h1 className="text-2xl text-center">Gallery</h1>
      <div className="h-full  text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {image_array.map((image, index) => (
            <div key={index} className="h-full">
              <Image
                src={
                  "/" + image.filepath.split("\\").pop() + "/" + image.filename
                }
                alt={image.filename}
                height={128}
                width={128}
              />
              <span>{image.filename}</span>
            </div>
          ))}
        </div>
        {/* <UploadForm /> */}
      </div>
    </div>
  );
}
