import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: { kyc: { select: { status: true } } },
    });

    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      emailVerified: user.emailVerified,
      role: user.role,
      balance: user.balance ?? 0,
      totalDeposit: user.totalDeposit ?? 0,
      bonusRewards: user.bonusRewards ?? 0,
      createdAt: user.createdAt,
      kycStatus: user.kyc?.status ?? "NONE",
    });
  } catch (error) {
    console.error("GET /api/admin/users/[id] failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
