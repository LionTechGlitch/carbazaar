import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { loginSchema } from "@/lib/validations";
import { signToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { email, password } = parsed.data;

    await connectDB();

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail })
      .select("+password firstName lastName fatherName tribalName role email")
      .lean<{
        _id: { toString(): string };
        email: string;
        role: "Buyer" | "Seller" | "Admin";
        password: string;
        firstName: string;
        lastName: string;
        fatherName?: string;
        tribalName?: string;
      } | null>();
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role as "Buyer" | "Seller" | "Admin",
    });

    const res = NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        fatherName: user.fatherName,
        tribalName: user.tribalName,
      },
    });
    setAuthCookie(res, token);
    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
