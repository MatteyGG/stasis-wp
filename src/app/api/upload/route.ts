import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { prisma } from "../../prisma";
export const POST = async (req, res) => {
  const formData = await req.formData();

  const file = formData.get("file");
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = file.name.replaceAll(" ", "_");
  console.log(filename);

  // Create the uploads directory if it does not exist
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  try {
    await mkdir(uploadsDir, { recursive: true });
  } catch (error) {
    console.error("Error creating uploads directory:", error);
  }

  try {
    await writeFile(path.join(uploadsDir, filename), buffer);
    await prisma.image.create({
      data: {
        filename: filename,
        filepath: uploadsDir,
      },
    });
    return NextResponse.json({ Message: "Success", status: 201 });
  } catch (error) {
    console.log("Error occured ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};