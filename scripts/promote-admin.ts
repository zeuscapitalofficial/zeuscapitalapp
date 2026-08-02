import { PrismaClient } from "../generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Error: DATABASE_URL environment variable is missing.");
  process.exit(1);
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error("Error: Please provide the email address to promote.");
    console.log("Usage: bun scripts/promote-admin.ts <user-email>");
    process.exit(1);
  }

  console.log(`Connecting to Neon database...`);
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.trim() },
    });

    if (!user) {
      console.error(`Error: User with email '${email}' not found in database.`);
      process.exit(1);
    }

    console.log(`Promoting user '${user.name}' (${user.email}) to ADMIN...`);
    const updatedUser = await prisma.user.update({
      where: { email: email.trim() },
      data: { role: "ADMIN" },
    });

    console.log(`Success! User role updated to ${updatedUser.role}.`);
  } catch (error: any) {
    console.error("Database query failed:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
