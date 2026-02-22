import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiResponse, apiError, parseDateParam } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return apiError("Unauthorized", 401);

  const date = parseDateParam(req.nextUrl.searchParams.get("date"));

  const entries = await prisma.moodEntry.findMany({
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

  const entry = await prisma.moodEntry.create({
    data: {
      userId: session.user.id,
      date,
      positivity: body.positivity ?? null,
      melancholy: body.melancholy ?? null,
      tiredness: body.tiredness ?? null,
      focus: body.focus ?? null,
      socialWilling: body.socialWilling ?? null,
      creativity: body.creativity ?? null,
      anxiety: body.anxiety ?? null,
      calm: body.calm ?? null,
      motivation: body.motivation ?? null,
      gratitude: body.gratitude ?? null,
    },
  });

  return apiResponse(entry, 201);
}
