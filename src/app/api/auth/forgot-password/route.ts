import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendResetPasswordEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    await connectDB();
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select("_id email");

    // Always return success to avoid account enumeration.
    if (!user) return NextResponse.json({ ok: true });

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);

    await User.updateOne(
      { _id: user._id },
      { resetPasswordTokenHash: tokenHash, resetPasswordExpires }
    );

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
    const resetLink = `${baseUrl}/reset-password/${token}`;
    await sendResetPasswordEmail(user.email, resetLink);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
