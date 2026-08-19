import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const workspace = await prisma.workspace.upsert({
    where: {
      id: "demo-workspace",
    },
    update: {},
    create: {
      id: "demo-workspace",
      name: "LOOP Demo Workspace",
    },
  });

  console.log("Workspace ready:", workspace);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });