import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Middleware security check for Admin privilege
async function checkAdminSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function GET() {
  try {
    const adminSession = await checkAdminSession();
    if (!adminSession) {
      return NextResponse.json(
        { error: "Unauthorized access: admin level required" },
        { status: 401 },
      );
    }

    const users = await prisma.user.findMany({
      include: {
        kyc: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(users);
  } catch (error: any) {
    console.error("GET users list failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const adminSession = await checkAdminSession();
    if (!adminSession) {
      return NextResponse.json(
        { error: "Unauthorized access: admin level required" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 },
      );
    }

    if (role !== "USER" && role !== "ADMIN") {
      return NextResponse.json(
        { error: "Invalid role specified" },
        { status: 400 },
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("POST modify user role failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
