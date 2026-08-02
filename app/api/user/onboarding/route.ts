import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { image, name, phoneNumber, country, currency } = body;

    const updateData: Record<string, any> = {};

    if (image) updateData.image = image;
    if (name) updateData.name = name;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    // Update or create Kyc record if personal info provided
    if (country || phoneNumber) {
      await prisma.kyc.upsert({
        where: { userId: session.user.id },
        update: {
          country: country || "United States",
          phoneNumber: phoneNumber || "",
        },
        create: {
          userId: session.user.id,
          gender: "Not specified",
          nationality: country || "United States",
          countryCode: "US",
          country: country || "United States",
          phoneNumber: phoneNumber || "",
          documentId: "PENDING_ONBOARDING",
          frontOfId: "PENDING",
          backOfId: "PENDING",
          proofOfAddress: "PENDING",
          addressLine1: "Pending setup",
          city: "Pending",
          state: "Pending",
          postalCode: "00000",
          sourceOfFunds: "Employment",
          status: "PENDING",
        },
      });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("POST onboarding failed:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
