import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiResponse, apiError, parseDateParam } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return apiError("Unauthorized", 401);

  const date = parseDateParam(req.nextUrl.searchParams.get("date"));

  const entries = await prisma.alcoholEntry.findMany({
    where: { userId: session.user.id, date },
  });

  return apiResponse(entries);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return apiError("Unauthorized", 401);

  const body = await req.json();
  const date = parseDateParam(body.date);
  const type = body.alcoholType;

  if (!type) return apiError("Alcohol type is required", 400);

  const entry = await prisma.alcoholEntry.upsert({
    where: {
      userId_date_type: { userId: session.user.id, date, type },
    },
    update: { units: body.alcoholUnits ?? 1 },
    create: {
      userId: session.user.id,
      date,
      type,
      units: body.alcoholUnits ?? 1,
    },
  });

  return apiResponse(entry);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return apiError("Unauthorized", 401);

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return apiError("ID is required", 400);

  await prisma.alcoholEntry.deleteMany({
    where: { id, userId: session.user.id },
  });

  return apiResponse({ deleted: true });
}
