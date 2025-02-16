import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { prisma } from "../../prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const POST = async (req: any) => {
  console.log("Handling POST request");
  const formData = await req.formData();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require("path");
  
  const endPath = formData.get("endPath");
  const userId = formData.get("userId");
  console.log(`Received file for endPath: ${endPath}, userId: ${userId}`);

  const uploadsDir = path.join(process.cwd(), 'public', endPath);
  const file = formData.get("file");
  if (!file) {
    console.error("No files received.");
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  let filename = file.name;
  if (endPath !== "gallery") {
    const fileExtension = file.name.split('.').pop();
    filename = `${endPath}_${userId}.${fileExtension}`;
  }
  console.log(`Filename determined as: ${filename}`);

  try {
    console.log(`Creating directory at: ${uploadsDir}`);
    await mkdir(uploadsDir, { recursive: true });
  } catch (error) {
    console.error("Error creating uploads directory:", error);
    return NextResponse.json({ Message: "Failed to create directory", status: 500 });
  }

  try {
    console.log(`Writing file to ${path.join(uploadsDir, filename)}`);
    await writeFile(path.join(uploadsDir, filename), buffer);

    if (endPath !== "gallery") {
      console.log(`Updating database record for userId: ${userId}`);
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

    console.log("File upload successful");
    return NextResponse.json({ Message: "Success", status: 201 });
  } catch (error) {
    console.error("Error occurred during file handling:", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};

