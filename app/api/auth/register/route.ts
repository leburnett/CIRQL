import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { apiResponse, apiError } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return apiError("Email and password are required", 400);
    }

    if (password.length < 8) {
      return apiError("Password must be at least 8 characters", 400);
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return apiError("An account with this email already exists", 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, passwordHash, name: name || null },
      select: { id: true, email: true, name: true },
    });

    return apiResponse(user, 201);
  } catch {
    return apiError("Registration failed", 500);
  }
}
