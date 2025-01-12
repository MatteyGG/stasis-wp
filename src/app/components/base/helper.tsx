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
        <Image
          className="absolute  object-contain z-30  w-2/3 transition-all duration-500 ease-in-out "
          src={imagesrc}
          width={1000}
          height={1000}
          alt="helpimage"
        />
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
