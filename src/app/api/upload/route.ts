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
  const fileExtension = file.name.split('.').pop();
  const filename = `${endPath}_${userId}.${fileExtension}`;
  console.log(filename);

  // Create the uploads directory if it does not exist
  try {
    await mkdir(uploadsDir, { recursive: true });
    console.log("Directory created successfully");
  } catch (error) {
    console.error("Error creating uploads directory:", error);
  }

  try {
    console.log("Writing file to:", path.join(uploadsDir, filename));
    await writeFile(path.join(uploadsDir, filename), buffer);
    await prisma.image.upsert({
      where: { id: userId },
      update: {
        filename: filename,
        filepath: uploadsDir,
        user: {
          connect: { id: userId },
        },
      },
      create: {
        filename: filename,
        filepath: uploadsDir,
        user: {
          connect: { id: userId },
        },
      },
    });
    return NextResponse.json({ Message: "Success", status: 201 });
  } catch (error) {
    console.log("Error occured ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
