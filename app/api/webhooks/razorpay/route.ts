import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature found" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET as string;
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Parse the payload
    const event = JSON.parse(rawBody);

    // Handle payment capture
    if (event.event === "payment.captured" || event.event === "order.paid") {
      const paymentEntity = event.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      
      const notes = paymentEntity.notes;
      const userId = notes?.userId;
      const planName = notes?.plan;

      if (userId && planName) {
        // Find user by Clerk ID
        const user = await prisma.user.findUnique({ where: { id: userId } });
        
        if (user && user.razorpayOrderId !== orderId) {
          // Update user if they weren't already updated by the frontend callback
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscriptionTier: planName.toUpperCase(),
              subscriptionStatus: "ACTIVE",
              razorpayOrderId: orderId
            }
          });
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Razorpay Webhook Error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
