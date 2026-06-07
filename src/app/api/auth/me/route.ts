import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        fatherName: user.fatherName,
        tribalName: user.tribalName,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("Me error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
