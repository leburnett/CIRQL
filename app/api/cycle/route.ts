import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiResponse, apiError, parseDateParam } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return apiError("Unauthorized", 401);

  const date = parseDateParam(req.nextUrl.searchParams.get("date"));

  const entry = await prisma.cycleEntry.findUnique({
    where: { userId_date: { userId: session.user.id, date } },
  });

  return apiResponse(entry);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return apiError("Unauthorized", 401);

  const body = await req.json();
  const date = parseDateParam(body.date);

  const entry = await prisma.cycleEntry.upsert({
    where: { userId_date: { userId: session.user.id, date } },
    update: {
      onPeriod: body.onPeriod ?? undefined,
      flow: body.flow ?? undefined,
      cramps: body.cramps ?? undefined,
      notes: body.notes ?? undefined,
    },
    create: {
      userId: session.user.id,
      date,
      onPeriod: body.onPeriod ?? false,
      flow: body.flow ?? null,
      cramps: body.cramps ?? null,
      notes: body.notes ?? null,
    },
  });

  return apiResponse(entry);
}
