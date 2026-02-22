import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DEFAULT_OPTIONS } from "@/lib/defaultOptions";
import { apiResponse, apiError } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return apiError("Unauthorized", 401);

  const category = req.nextUrl.searchParams.get("category");
  if (!category) return apiError("Category is required", 400);

  const customOptions = await prisma.customOption.findMany({
    where: { userId: session.user.id, category },
    orderBy: { createdAt: "asc" },
  });

  const defaults = DEFAULT_OPTIONS[category] ?? [];

  return apiResponse({ defaults, customOptions });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return apiError("Unauthorized", 401);

  const { category, value } = await req.json();

  if (!category || !value) {
    return apiError("Category and value are required", 400);
  }

  const option = await prisma.customOption.upsert({
    where: {
      userId_category_value: {
        userId: session.user.id,
        category,
        value,
      },
    },
    update: {},
    create: {
      userId: session.user.id,
      category,
      value,
    },
  });

  return apiResponse(option, 201);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return apiError("Unauthorized", 401);

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return apiError("ID is required", 400);

  await prisma.customOption.deleteMany({
    where: { id, userId: session.user.id },
  });

  return apiResponse({ deleted: true });
}
