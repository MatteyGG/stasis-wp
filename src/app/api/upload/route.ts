// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand, ListObjectsCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3URL = "https://s3.timeweb.cloud";
const Bucket = "576b093c-bf65d329-1603-4121-b476-e46d7ce3cb2a";
const accessKeyId = "3FMQPR3J6M0RXQ4ZRPCZ";
const secretAccessKey = "LcJv5Uw9K8kuzNV5WuE6ESVY5612UJOiA7zhwMSE";
const region = "ru-1";

const s3Client = new S3Client({
  forcePathStyle: true,
  endpoint: s3URL,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const POST = async (req: any) => {
  console.log("Handling POST request");
  const formData = await req.formData();
  const endPath = formData.get("endPath");
  const userId = formData.get("userId");

  const file = formData.get("file");
  if (!file) {
    console.error("No files received.");
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const filename = file.name;
  const fileBuffer = await file.arrayBuffer();

  try {
    const command = new PutObjectCommand({
      ACL: "public-read",
      Bucket,
      Key: endPath === "gallery" ? `${endPath}/${filename}` : `${endPath}/${userId}.${file.type.split("/")[1]}`,
      Body: fileBuffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    return NextResponse.json({ Message: "Success", status: 201 });
  } catch (e) {
    console.log("upload error", e);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};

export const GET = async () => {
  console.log("Handling GET request");
  const command = new ListObjectsCommand({
    Bucket,
    Prefix: "gallery/",
  });

  try {
    const data = await s3Client.send(command);
    const files: (string | undefined)[] = data.Contents?.map((file) => file.Key).filter((key) => key!.includes("gallery/")) || [];
    return NextResponse.json({ files });
  } catch (e) {
    console.log("Error:", e);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};

export const DELETE = async (req: Request) => {
  const { file } = await req.json();
  if (!file) {
    console.error("No file provided.");
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket,
      Key: file.toString(),
    });

    await s3Client.send(command);
    return NextResponse.json({ Message: `Deleted successfully ${file.split("/")[1]}`, status: 200 });
  } catch (e) {
    console.log("Delete error", e);
    return NextResponse.json({ Message: "Failed to delete", status: 500 });
  }
};

