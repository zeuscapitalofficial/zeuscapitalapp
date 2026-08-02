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

    // Get address from KYC
    const kyc = await prisma.kyc.findUnique({
      where: { userId: session.user.id },
      select: {
        addressLine1: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
        countryCode: true,
        phoneNumber: true,
      },
    });

    return NextResponse.json({ address: kyc });
  } catch (error: any) {
    console.error("GET address failed:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      addressLine1,
      city,
      state,
      postalCode,
      country,
      countryCode,
      phoneNumber,
    } = body;

    // Update KYC with address info
    const kyc = await prisma.kyc.upsert({
      where: { userId: session.user.id },
      update: {
        addressLine1: addressLine1 || "",
        city: city || "",
        state: state || "",
        postalCode: postalCode || "",
        country: country || "",
        countryCode: countryCode || "",
        phoneNumber: phoneNumber || "",
      },
      create: {
        userId: session.user.id,
        gender: "",
        countryCode: countryCode || "",
        country: country || "",
        phoneNumber: phoneNumber || "",
        documentId: "",
        frontOfId: "",
        backOfId: "",
        proofOfAddress: "",
        addressLine1: addressLine1 || "",
        city: city || "",
        state: state || "",
        postalCode: postalCode || "",
        nationality: "",
        sourceOfFunds: "",
      },
    });

    return NextResponse.json({ success: true, address: kyc });
  } catch (error: any) {
    console.error("POST address failed:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
