// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@/lib/auth";

// Проверяем переменные окружения
const s3Endpoint = process.env.S3_ENDPOINT;
const s3AccessKey = process.env.S3_ACCESS_KEY;
const s3SecretKey = process.env.S3_SECRET_KEY;
const s3Bucket = process.env.S3_BUCKET;
const s3Region = process.env.S3_REGION;

if (!s3Endpoint || !s3AccessKey || !s3SecretKey || !s3Bucket || !s3Region) {
  console.error("Missing S3 environment variables");
}

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  region: process.env.S3_REGION!,
});

export async function POST(req: Request) {
  try {
    // 1. Аутентификация
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const requestedPath = formData.get("endPath") as string;

    // 2. Валидация пути
    const allowedPaths = ["userProfile", "gallery"];
    const endPath = allowedPaths.includes(requestedPath) ? requestedPath : "userProfile";
    
    const userId = session.user.id;

    // 4. Валидация файла на сервере
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
    const MAX_SIZE = 5 * 1024 * 1024;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    // 5. Безопасное имя файла
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'png';
    const safeExtension = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension) 
      ? fileExtension : 'png';
    
    const key = `${endPath}/${userId}.${safeExtension}`;

    // 6. Загрузка в S3
    const buffer = await file.arrayBuffer();
    
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: file.type,
      ACL: "public-read",
    }));

    return NextResponse.json({ 
      success: true, 
      message: "File uploaded successfully",
      // Простое решение для инвалидации кэша - timestamp
      timestamp: Date.now()
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}