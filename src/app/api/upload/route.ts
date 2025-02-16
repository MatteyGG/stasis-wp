import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { prisma } from "../../prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const POST = async (req: any) => {
  const formData = await req.formData();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require("path");
  
  const endPath = formData.get("endPath");
  const userId = formData.get("userId");

  const uploadsDir = path.join(process.cwd(), 'public', endPath);
  const file = formData.get("file");
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  let filename = file.name;
  if (endPath !== "gallery") {
    const fileExtension = file.name.split('.').pop();
    filename = `${endPath}_${userId}.${fileExtension}`;
  }

  try {
    await mkdir(uploadsDir, { recursive: true });
  } catch (error) {
    console.error("Error creating uploads directory:", error);
    return NextResponse.json({ Message: "Failed to create directory", status: 500 });
  }

  try {
    await writeFile(path.join(uploadsDir, filename), buffer);

    if (endPath !== "gallery") {
      await prisma.image.upsert({
        where: { id: userId },
        update: {
          filename: filename,
          filepath: uploadsDir,
          user: { connect: { id: userId } },
        },
        create: {
          filename: filename,
          filepath: uploadsDir,
          user: { connect: { id: userId } },
        },
      });
    }

    return NextResponse.json({ Message: "Success", status: 201 });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};

