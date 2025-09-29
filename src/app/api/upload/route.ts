// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { 
  S3Client, 
  PutObjectCommand, 
  ListObjectVersionsCommand,
  DeleteObjectCommand 
} from "@aws-sdk/client-s3";
import { auth } from "@/lib/auth";
import sharp from "sharp";
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  region: process.env.S3_REGION!,
});

// Функция для удаления старых версий
async function cleanupOldVersions(bucket: string, key: string, maxVersions: number = 3) {
  try {
    const listCommand = new ListObjectVersionsCommand({
      Bucket: bucket,
      Prefix: key,
    });
    
    const versionsData = await s3Client.send(listCommand);
    
    if (!versionsData.Versions || versionsData.Versions.length <= maxVersions) {
      return;
    }

    const sortedVersions = versionsData.Versions
      .filter(version => version.Key === key)
      .sort((a, b) => 
        new Date(b.LastModified!).getTime() - new Date(a.LastModified!).getTime()
      );

    const versionsToDelete = sortedVersions.slice(maxVersions);
    
    for (const version of versionsToDelete) {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
        VersionId: version.VersionId,
      });
      await s3Client.send(deleteCommand);
      console.log(`Deleted old version: ${version.VersionId}`);
    }
    
    console.log(`Cleaned up ${versionsToDelete.length} old versions for ${key}`);
  } catch (error) {
    console.error("Error cleaning up old versions:", error);
  }
}

// Функция для удаления файлов других форматов
async function cleanupOtherFormats(bucket: string, userId: string, endPath: string) {
  const formats = ['.jpg', '.jpeg', '.gif'];
  
  for (const format of formats) {
    const key = `${endPath}/${userId}${format}`;
    try {
      // Удаляем все версии этого файла
      const listCommand = new ListObjectVersionsCommand({
        Bucket: bucket,
        Prefix: key,
      });
      
      const versionsData = await s3Client.send(listCommand);
      
      if (versionsData.Versions) {
        for (const version of versionsData.Versions) {
          if (version.Key === key) {
            await s3Client.send(new DeleteObjectCommand({
              Bucket: bucket,
              Key: key,
              VersionId: version.VersionId,
            }));
          }
        }
        console.log(`Cleaned up other format: ${key}`);
      }
    } catch (error) {
      // Файл может не существовать - это нормально
      if ((error as Error).name !== 'NoSuchKey') {
        console.error(`Error cleaning up ${key}:`, error);
      }
    }
  }
}

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

    // 3. Валидация файла на сервере
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
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

    // 4. Конвертация в PNG с оптимизацией
    const buffer = await file.arrayBuffer();
    
    let optimizedImage: Buffer;
    
    try {
      // Создаем sharp instance и оптимизируем изображение
      const sharpInstance = sharp(Buffer.from(buffer));
      
      // Получаем метаданные для принятия решений об оптимизации
      const metadata = await sharpInstance.metadata();
      
      // Оптимизация для аватаров
      optimizedImage = await sharpInstance
        .resize(512, 512, {  // Ресайз до максимального размера
          fit: 'cover',
          position: 'center',
          withoutEnlargement: true  // Не увеличиваем маленькие изображения
        })
        .png({
          quality: 80,          // Качество 80% - хороший баланс
          compressionLevel: 6,  // Уровень сжатия
          palette: true,        // Использовать палитру для уменьшения размера
        })
        .toBuffer();
        
      console.log(`Image optimized: ${metadata.width}x${metadata.height} -> 512x512, ${file.size} -> ${optimizedImage.length} bytes`);
      
    } catch (sharpError) {
      console.error("Sharp processing error:", sharpError);
      // Если sharp не смог обработать, используем оригинал
      optimizedImage = Buffer.from(buffer);
    }

    // 4. Генерация хеша
    const fileHash = createHash('md5').update(optimizedImage).digest('hex').substring(0, 8);

    const avatarVersion = `${fileHash}`;

    await prisma.user.update({
      where: { id: userId },
      data: { avatarVersion },
    });

    revalidatePath('/', 'layout');

    // 5. Всегда используем PNG расширение
    const key = `${endPath}/${userId}.png`;

    // 6. Настройка Cache-Control
    let cacheControl = "public, max-age=300";
    if (endPath === "gallery") {
      cacheControl = "public, max-age=3600";
    }

    // 7. Загрузка в S3
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      Body: optimizedImage,
      ContentType: 'image/png', // Всегда image/png
      ACL: "public-read",
      CacheControl: cacheControl,
    }));

    // 8. Очистка старых версий PNG (оставляем только 3 последние)
    await cleanupOldVersions(process.env.S3_BUCKET!, key, 3);

    // 9. Очистка файлов других форматов для этого пользователя
    await cleanupOtherFormats(process.env.S3_BUCKET!, userId, endPath);

    return NextResponse.json({ 
      success: true, 
      message: "File uploaded successfully",
      fileHash: fileHash,
      format: 'png',
      size: optimizedImage.length
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}