import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET() {
  const prisma = new PrismaClient();

  try {
    const categories = await prisma.wikicategory.findMany();

    await prisma.$disconnect();

    return NextResponse.json(
      { data: categories }
    );
  } catch (error) {
    console.error("Error getting categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const prisma = new PrismaClient();

  try {
    const body = await req.json();
    const { name } = body;

    const newCategory = await prisma.wikicategory.create({
      data: {
        name: name,
      },
    });

    await prisma.$disconnect();

    return NextResponse.json(
      { category: newCategory, message: "Category created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

