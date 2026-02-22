import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiResponse, apiError, parseDateParam } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return apiError("Unauthorized", 401);

  const date = parseDateParam(req.nextUrl.searchParams.get("date"));

  const entries = await prisma.exerciseEntry.findMany({
    where: { userId: session.user.id, date },
    orderBy: { createdAt: "desc" },
  });

  return apiResponse(entries);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return apiError("Unauthorized", 401);

  const body = await req.json();
  const date = parseDateParam(body.date);

  if (!body.type) return apiError("Exercise type is required", 400);

  const entry = await prisma.exerciseEntry.create({
    data: {
      userId: session.user.id,
      date,
      type: body.type,
      durationMins: body.durationMins ?? 0,
    },
  });

  return apiResponse(entry, 201);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return apiError("Unauthorized", 401);

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return apiError("ID is required", 400);

  await prisma.exerciseEntry.deleteMany({
    where: { id, userId: session.user.id },
  });

  return apiResponse({ deleted: true });
}
