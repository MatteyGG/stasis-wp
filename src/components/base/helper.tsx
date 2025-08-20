"use client";

import Image from "next/image";
import React, { useState } from "react";

export default function MakeHelper({
  text,
  imagesrc,
}: {
  text: string;
  imagesrc: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      {isVisible && (
        <div className="fixed w-1/2 h-1/2 inset-0 z-30 bg-black bg-opacity-50">
          <Image
            className="object-contain "
            src={imagesrc}
            width={1000}
            height={1000}
            alt="helpimage"
          />
        </div>
      )}
      <div
        onMouseEnter={handleClick}
        onMouseLeave={handleClick}
        className="p-2"
      >
        <span className="text-sm bg-transparent border-none outline-none underline  focus:outline-none ">
          {text}
        </span>
      </div>
    </>
  );
}

