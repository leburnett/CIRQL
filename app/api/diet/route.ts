import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiResponse, apiError, parseDateParam } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return apiError("Unauthorized", 401);

  const date = parseDateParam(req.nextUrl.searchParams.get("date"));

  const entry = await prisma.dietEntry.findUnique({
    where: { userId_date: { userId: session.user.id, date } },
  });

  return apiResponse(entry);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return apiError("Unauthorized", 401);

  const body = await req.json();
  const date = parseDateParam(body.date);

  const entry = await prisma.dietEntry.upsert({
    where: { userId_date: { userId: session.user.id, date } },
    update: {
      breakfast: body.breakfast ?? undefined,
      lunch: body.lunch ?? undefined,
      dinner: body.dinner ?? undefined,
      snacks: body.snacks ?? undefined,
      coffeeCount: body.coffeeCount ?? undefined,
      waterCount: body.waterCount ?? undefined,
    },
    create: {
      userId: session.user.id,
      date,
      breakfast: body.breakfast ?? null,
      lunch: body.lunch ?? null,
      dinner: body.dinner ?? null,
      snacks: body.snacks ?? null,
      coffeeCount: body.coffeeCount ?? 0,
      waterCount: body.waterCount ?? 0,
    },
  });

  return apiResponse(entry);
}
