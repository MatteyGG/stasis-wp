import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function DELETE(req: NextRequest) {
  const promocodeId = parseInt(req.url.split("/").pop() || "", 10);
  console.log(promocodeId);
  const prisma = new PrismaClient();

  const promocode = await prisma.promocode.delete({
    where: { id: promocodeId },
  });
  if (!promocode) {
    return NextResponse.error();
  }
  console.log(promocode);
  return NextResponse.json(promocode);
}


