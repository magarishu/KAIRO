"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Sync user on demand (if they don't exist yet)
async function ensureUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  let user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const clerkUser = await currentUser();
    user = await prisma.user.create({
      data: {
        id: userId,
        email: clerkUser?.emailAddresses[0]?.emailAddress || "",
        name: clerkUser?.firstName || clerkUser?.username || "User",
      },
    });
  }
  return user;
}

export async function getGroups() {
  const user = await ensureUser();

  const groups = await prisma.group.findMany({
    where: { userId: user.id },
    include: { slaves: true },
    orderBy: { createdAt: "asc" },
  });

  return groups;
}

export async function seedInitialData() {
  const user = await ensureUser();

  const count = await prisma.group.count({ where: { userId: user.id } });
  if (count > 0) return { success: true, message: "Already seeded" };

  // Create mock groups for the user
  await prisma.group.create({
    data: {
      name: "Alpha Fleet Prop Accounts",
      accountId: "#MA-8829",
      subtitle: "Apex Trader (MT5) • Created Today",
      icon: "Rocket",
      iconColor: "text-blue-400",
      iconBg: "bg-blue-900/40 border-blue-800",
      status: "ACTIVE",
      userId: user.id,
      slaves: {
        create: [
          { name: "Prop Firm Account 1", accountId: "#SL-1011", broker: "Apex Trader (MT5)", status: "SYNCED", balance: 100000, pnl: 850.50, multiplier: 1.0 },
          { name: "Prop Firm Account 2", accountId: "#SL-1012", broker: "Apex Trader (MT5)", status: "SYNCED", balance: 50000, pnl: 425.25, multiplier: 0.5 },
        ]
      }
    }
  });

  await prisma.group.create({
    data: {
      name: "Crypto High Risk",
      accountId: "#MA-9910",
      subtitle: "Binance Futures • Created 2d ago",
      icon: "Zap",
      iconColor: "text-yellow-400",
      iconBg: "bg-yellow-900/40 border-yellow-800",
      status: "ACTIVE",
      userId: user.id,
      slaves: {
        create: [
          { name: "Bybit Test", accountId: "#SL-2021", broker: "Binance Futures", status: "SYNCED", balance: 1200, pnl: -150.75, multiplier: 2.0, copySl: false },
        ]
      }
    }
  });

  revalidatePath("/");
  return { success: true, message: "Seeded successfully" };
}
