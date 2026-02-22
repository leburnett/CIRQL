import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiResponse, apiError, parseDateParam } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return apiError("Unauthorized", 401);

  const date = parseDateParam(req.nextUrl.searchParams.get("date"));

  const entry = await prisma.sleepEntry.findUnique({
    where: { userId_date: { userId: session.user.id, date } },
  });

  return apiResponse(entry);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return apiError("Unauthorized", 401);

  const body = await req.json();
  const date = parseDateParam(body.date);

  const entry = await prisma.sleepEntry.upsert({
    where: { userId_date: { userId: session.user.id, date } },
    update: {
      hours: body.hours ?? undefined,
      restless: body.restless ?? undefined,
      sleepTalking: body.sleepTalking ?? undefined,
      hot: body.hot ?? undefined,
    },
    create: {
      userId: session.user.id,
      date,
      hours: body.hours ?? null,
      restless: body.restless ?? false,
      sleepTalking: body.sleepTalking ?? false,
      hot: body.hot ?? false,
    },
  });

  return apiResponse(entry);
}
