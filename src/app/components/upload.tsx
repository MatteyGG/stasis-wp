'use client'

import { useEffect, useState } from "react";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("file", file);

    fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };

  return (
    <div>
      {isClient && <input id="image" type="file" onChange={handleFileChange} />}
      <button onClick={handleUpload}>Загрузить</button>
    </div>
  );
}