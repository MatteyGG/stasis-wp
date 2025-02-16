"use client";

import { useState, ChangeEvent } from "react";

export default function UploadImage({
  children,
  userId,
  method,
}: Readonly<{
  children: React.ReactNode;
  userId: string;
  method: "userScreen" | "userProfile" | "gallery";
}>) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    if (!target.files || target.files.length === 0) {
      console.warn("No files selected");
      return;
    }

    const selectedFile = target.files[0];
    if (!selectedFile) {
      console.error("File is null");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (file === null) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    formData.append("endPath", method);

    fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => console.log("data is:", data))
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="upload">
      <input id="image" type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>{children}</button>
    </div>
  );
}


