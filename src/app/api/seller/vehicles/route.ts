import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Vehicle from "@/models/Vehicle";
import { getCurrentUser } from "@/lib/auth";
import mongoose from "mongoose";

interface SellerVehicle {
  _id: mongoose.Types.ObjectId;
  make: string;
  model: string;
  year: number;
  condition: string;
  price: number;
  location: string;
  listingType: string;
  isSold: boolean;
  currentBid?: number;
  createdAt: Date;
  images?: string[];
}

/** List vehicles for the current seller (protected: Seller or Admin only) */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getCurrentUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "Seller" && user.role !== "Admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const vehicles = await Vehicle.find({ sellerId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    const list = (vehicles as unknown as SellerVehicle[]).map((v) => ({
      id: v._id.toString(),
      make: v.make,
      model: v.model,
      year: v.year,
      condition: v.condition,
      price: v.price,
      location: v.location,
      listingType: v.listingType,
      isSold: v.isSold,
      currentBid: v.currentBid,
      createdAt: v.createdAt,
      images: v.images,
    }));

    return NextResponse.json({ vehicles: list });
  } catch (err) {
    console.error("Seller vehicles GET error:", err);
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}
