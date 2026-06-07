import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Enquiry from "@/models/Enquiry";
import Vehicle from "@/models/Vehicle";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { vehicleId, buyerName, buyerEmail, buyerPhone, message } = body;

    if (!vehicleId || !buyerName || !buyerEmail || !buyerPhone || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const vehicle = await Vehicle.findById(vehicleId).lean();
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    const enquiry = await Enquiry.create({
      vehicleId,
      sellerId: (vehicle as unknown as { sellerId: unknown }).sellerId,
      buyerName,
      buyerEmail,
      buyerPhone,
      message,
    });

    return NextResponse.json({ success: true, enquiryId: enquiry._id });
  } catch (err) {
    console.error("Enquiry POST error:", err);
    return NextResponse.json({ error: "Failed to submit enquiry" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const enquiries = await Enquiry.find({ sellerId: user._id })
      .populate("vehicleId", "make model year images")
      .sort({ createdAt: -1 })
      .lean();

    const list = enquiries.map((e) => {
      const v = e.vehicleId as {
        _id: unknown;
        make: string;
        model: string;
        year: number;
        images?: string[];
      } | null;

      return {
        id: String(e._id),
        buyerName: e.buyerName,
        buyerEmail: e.buyerEmail,
        buyerPhone: e.buyerPhone,
        message: e.message,
        createdAt: e.createdAt,
        vehicle: v
          ? {
              id: String(v._id),
              make: v.make,
              model: v.model,
              year: v.year,
              image: v.images?.[0] || "",
            }
          : null,
      };
    });

    return NextResponse.json({ enquiries: list });
  } catch (err) {
    console.error("Enquiry GET error:", err);
    return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 });
  }
}