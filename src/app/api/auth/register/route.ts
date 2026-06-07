import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { registerSchema } from "@/lib/validations";
import { signToken, setAuthCookie } from "@/lib/auth";

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { email, password, firstName, lastName, fatherName, tribalName, role, phone } = parsed.data;

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      fatherName: fatherName?.trim(),
      tribalName: tribalName?.trim(),
      role: role || "Buyer",
      phone: phone?.trim(),
    });

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
  } catch (err: unknown) {
    console.error("Register error:", err);
    const error = err as Error & { code?: string; name?: string };
    const message =
      error.code === "ECONNREFUSED" || error.name === "MongoNetworkError"
        ? "Cannot connect to database. Check MONGODB_URI in .env.local and that MongoDB is running."
        : (error as Error).message?.includes("auth")
        ? "Database authentication failed. Check username and password in MONGODB_URI (URL-encode special characters in password)."
        : "Registration failed. Check server logs for details.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
