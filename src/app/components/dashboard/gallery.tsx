"use client";

import Image from "next/image";
import UploadImage from "../userImageUpload";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/upload", { method: "GET" });
        const data = await response.json();
        console.log(data);
        if (Array.isArray(data.files) && data.files.length > 0) {
          setImages(data.files.slice(1));
        } else {
          console.error("Data is not an array or is empty");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchImages();
  }, [refresh]);

  const copyImage = (image: string) => {
    navigator.clipboard.writeText(
      "https://s3.timeweb.cloud/576b093c-bf65d329-1603-4121-b476-e46d7ce3cb2a/" +
        image
    );
    toast.success(`Картинка ${image.split("/")[1]} скопирована`);
  };

  const deleteImage = async (image: string) => {
    try {
      const response = await fetch("/api/upload", {
        method: "DELETE",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: JSON.stringify({ file: image }),
      });
      if (response.ok) {
        setImages(images.filter((img) => img !== image));
        toast.success(`Картинка ${image.split("/")[1]} удалена`);
      } else {
        console.error("Error deleting image");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="container flex flex-col shadow-sm shadow-black mx-auto p-4 rounded-xl backdrop-blur-3xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image: string, index) => (
            <div
              key={index}
              className="flex flex-col py-2 justify-center items-center bg-slate-200 rounded-md shadow-sm shadow-slate-400"
            >
              <Image
                src={
                  "https://s3.timeweb.cloud/576b093c-bf65d329-1603-4121-b476-e46d7ce3cb2a/" +
                  image
                }
                alt={image}
                height={256}
                width={256}
                quality={100}
              />
              <p className="mt-2 text-sm text-balance">{image.split("/")[1]}</p>
              <div className="flex gap-4">
                <button
                  className="mt-2 text-sm text-blue-500"
                  onClick={() => copyImage(image)}
                >
                  Копировать
                </button>
                <button
                  className="mt-2 text-sm text-red-500"
                  onClick={() => deleteImage(image)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
        <div>
          <UploadImage
            userId={"all"}
            method="gallery"
            onUploadComplete={() => {
              setRefresh(!refresh);
              toast.success("Картинка загружена!");
            }}
          >
            Загрузить
          </UploadImage>
        </div>
      </div>
    </>
  );
}

