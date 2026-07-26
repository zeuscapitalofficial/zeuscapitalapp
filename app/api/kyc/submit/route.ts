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

    const userId = session.user.id;
    const body = await request.json();

    const {
      gender,
      countryCode,
      country,
      phoneNumber,
      documentId,
      frontOfId,
      backOfId,
      proofOfAddress,
      password,
      addressLine1,
      city,
      state,
      postalCode,
      nationality,
      sourceOfFunds,
      extraNotes,
    } = body;

    // Validate essential compliance inputs
    if (
      !gender ||
      !countryCode ||
      !country ||
      !phoneNumber ||
      !documentId ||
      !frontOfId ||
      !backOfId ||
      !proofOfAddress ||
      !addressLine1 ||
      !city ||
      !state ||
      !postalCode ||
      !nationality ||
      !sourceOfFunds
    ) {
      return NextResponse.json(
        { error: "Missing required KYC information" },
        { status: 400 },
      );
    }

    // Save record to the database via upsert
    const kyc = await prisma.kyc.upsert({
      where: { userId },
      create: {
        userId,
        gender,
        countryCode,
        country,
        phoneNumber,
        documentId,
        frontOfId,
        backOfId,
        proofOfAddress,
        password: password || null,
        addressLine1,
        city,
        state,
        postalCode,
        nationality,
        sourceOfFunds,
        extraNotes: extraNotes || null,
        status: "PENDING",
      },
      update: {
        gender,
        countryCode,
        country,
        phoneNumber,
        documentId,
        frontOfId,
        backOfId,
        proofOfAddress,
        password: password || null,
        addressLine1,
        city,
        state,
        postalCode,
        nationality,
        sourceOfFunds,
        extraNotes: extraNotes || null,
        status: "PENDING",
        rejectionReason: null, // Reset rejection reason on re-submission
      },
    });

    return NextResponse.json({ success: true, kyc });
  } catch (error: any) {
    console.error("KYC submission handler error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit KYC data" },
      { status: 500 },
    );
  }
}
