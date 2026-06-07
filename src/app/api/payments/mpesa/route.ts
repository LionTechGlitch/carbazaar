import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";

/**
 * M-Pesa payment placeholder.
 * In production: integrate with Safaricom Daraja API (STK Push, B2C, etc.)
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getCurrentUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { orderId, phone, amount } = body;
    if (!orderId || !phone || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: orderId, phone, amount" },
        { status: 400 }
      );
    }

    // Placeholder: simulate M-Pesa request
    // Real integration would call Safaricom API and return CheckoutRequestID, etc.
    const reference = `MPESA-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    return NextResponse.json({
      success: true,
      message: "M-Pesa payment initiated (placeholder)",
      reference,
      instruction: "In production, STK Push would be sent to the provided phone number.",
    });
  } catch (err) {
    console.error("M-Pesa error:", err);
    return NextResponse.json({ error: "Payment failed" }, { status: 500 });
  }
}
