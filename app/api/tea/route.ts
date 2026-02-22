import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiResponse, apiError, parseDateParam } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return apiError("Unauthorized", 401);

  const date = parseDateParam(req.nextUrl.searchParams.get("date"));

  const entries = await prisma.teaEntry.findMany({
    where: { userId: session.user.id, date },
  });

  return apiResponse(entries);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return apiError("Unauthorized", 401);

  const body = await req.json();
  const date = parseDateParam(body.date);
  const type = body.teaType;

  if (!type) return apiError("Tea type is required", 400);

  const entry = await prisma.teaEntry.upsert({
    where: {
      userId_date_type: { userId: session.user.id, date, type },
    },
    update: { cups: body.teaCups ?? 1 },
    create: {
      userId: session.user.id,
      date,
      type,
      cups: body.teaCups ?? 1,
    },
  });

  return apiResponse(entry);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return apiError("Unauthorized", 401);

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return apiError("ID is required", 400);

  await prisma.teaEntry.deleteMany({
    where: { id, userId: session.user.id },
  });

  return apiResponse({ deleted: true });
}
