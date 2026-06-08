"use server";

import Razorpay from "razorpay";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { currentUser, auth } from "@clerk/nextjs/server";

export async function createRazorpayOrder(planName: string, isAnnual: boolean) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });

    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Determine price in USD cents. Razorpay requires amounts in the smallest currency unit.
    // For INR, it's paise. For USD, it's cents.
    let amount = 0;
    if (planName === "Basic") amount = isAnnual ? 159 : 199;
    else if (planName === "Pro") amount = isAnnual ? 799 : 999;
    else if (planName === "Flex") amount = isAnnual ? 1919 : 2399;

    if (amount === 0) throw new Error("Invalid plan selected");

    // Create an order via Razorpay API
    const options = {
      amount: amount * 100 * 80, // Approximate conversion to INR for test mode (1 USD = 80 INR)
      currency: "INR",
      receipt: `rcpt_${Date.now().toString().slice(-8)}_${Math.floor(Math.random() * 1000)}`,
      notes: {
        userId: userId,
        plan: planName,
        billing: isAnnual ? "annual" : "monthly"
      }
    };

    const order = await razorpay.orders.create(options);

    return { success: true, orderId: order.id, amount: options.amount, currency: options.currency };
  } catch (error: any) {
    console.error("Razorpay Order Error:", error);
    const msg = error?.error?.description || error.message || "Failed to create order";
    return { success: false, error: msg };
  }
}

export async function verifyPayment(
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
  planName: string
) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Verify Signature
    const secret = process.env.RAZORPAY_KEY_SECRET as string;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new Error("Invalid signature");
    }

    // Payment is valid, update user in database
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: planName.toUpperCase(),
        subscriptionStatus: "ACTIVE",
        razorpayOrderId: razorpay_order_id,
        // Optional: save customer id if using Razorpay Customers API
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Razorpay Verification Error:", error);
    return { success: false, error: error.message || "Failed to verify payment" };
  }
}

export async function getUserSubscription() {
  try {
    const { userId } = await auth();
    if (!userId) return { tier: "FREE", status: "INACTIVE" };

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionTier: true, subscriptionStatus: true }
    });

    return { 
      tier: dbUser?.subscriptionTier || "FREE", 
      status: dbUser?.subscriptionStatus || "INACTIVE" 
    };
  } catch (error) {
    console.error("Failed to get subscription:", error);
    return { tier: "FREE", status: "INACTIVE" };
  }
}
