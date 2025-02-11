import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function DELETE(req: NextRequest) {
  const categoryId = parseInt(req.url.split("/").pop() || "", 10);
  console.log(categoryId);
  const prisma = new PrismaClient();

  const category = await prisma.wikicategory.delete({
    where: { id: categoryId },
  });
  if (!category) {
    return NextResponse.error();
  }
  console.log(category);
  return NextResponse.json(category);
}

