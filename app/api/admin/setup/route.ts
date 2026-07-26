import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Create the native Role enum type in Postgres if it doesn't exist
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role') THEN 
          CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN'); 
        END IF; 
      END $$;
    `);

    // 2. Drop the old default constraint first
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;
    `);

    // 3. Alter the column type to native "Role" using migration type casting
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "user" ALTER COLUMN "role" TYPE "Role" USING "role"::"Role";
    `);

    // 4. Set the new native default constraint
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'USER'::"Role";
    `);

    // 5. Create price_override table if it doesn't already exist
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "price_override" (
        "coinId" TEXT NOT NULL,
        "priceUsd" DOUBLE PRECISION NOT NULL,
        "isEnabled" BOOLEAN NOT NULL DEFAULT false,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "price_override_pkey" PRIMARY KEY ("coinId")
      );
    `);

    // 6. Create notification table if it doesn't already exist
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "notification" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "isRead" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "notification_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    
    // Create index on notification(userId)
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "notification_userId_idx" ON "notification"("userId");
    `);

    return NextResponse.json({ 
      success: true, 
      message: "Database successfully migrated and notifications table created."
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
