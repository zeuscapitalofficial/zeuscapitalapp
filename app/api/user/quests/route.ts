import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch user quests & streak from DB
    const [quests, streak] = await Promise.all([
      prisma.userQuest.findMany({ where: { userId } }),
      prisma.userStreak.findUnique({ where: { userId } }),
    ]);

    return NextResponse.json({
      quests: quests || [],
      streak: streak
        ? {
            currentDay: streak.currentDay,
            claimedDays: JSON.parse(streak.claimedDays || "[]"),
          }
        : { currentDay: 1, claimedDays: [] },
    });
  } catch (error: any) {
    console.error("GET user quests error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { action, questId, day } = body;

    if (action === "toggleQuest") {
      const existing = await prisma.userQuest.findUnique({
        where: { userId_questId: { userId, questId } },
      });

      const nextCompleted = !existing?.completed;

      const updated = await prisma.userQuest.upsert({
        where: { userId_questId: { userId, questId } },
        create: {
          userId,
          questId,
          completed: true,
          claimed: false,
        },
        update: {
          completed: nextCompleted,
        },
      });

      return NextResponse.json(updated);
    }

    if (action === "claimQuest") {
      const updated = await prisma.userQuest.upsert({
        where: { userId_questId: { userId, questId } },
        create: {
          userId,
          questId,
          completed: true,
          claimed: true,
        },
        update: {
          claimed: true,
        },
      });

      return NextResponse.json(updated);
    }

    if (action === "claimStreak") {
      const streak = await prisma.userStreak.findUnique({ where: { userId } });
      const currentClaimed: number[] = streak ? JSON.parse(streak.claimedDays || "[]") : [];
      if (!currentClaimed.includes(day)) {
        currentClaimed.push(day);
      }

      const updated = await prisma.userStreak.upsert({
        where: { userId },
        create: {
          userId,
          currentDay: day,
          claimedDays: JSON.stringify(currentClaimed),
        },
        update: {
          claimedDays: JSON.stringify(currentClaimed),
        },
      });

      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("POST user quests error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
