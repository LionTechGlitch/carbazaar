import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Vehicle from "@/models/Vehicle";
import Bid from "@/models/Bid";
import { getCurrentUser } from "@/lib/auth";
import { bidSchema } from "@/lib/validations";

/** Place a bid on an auction listing (Live Auction) */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getCurrentUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = bidSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { vehicleId, amount } = parsed.data;

    if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
      return NextResponse.json({ error: "Invalid vehicle ID" }, { status: 400 });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    if (vehicle.listingType !== "auction") {
      return NextResponse.json({ error: "This vehicle is not listed for auction" }, { status: 400 });
    }
    if (vehicle.isSold) return NextResponse.json({ error: "Auction has ended" }, { status: 400 });
    if (vehicle.auctionEndsAt && new Date() > vehicle.auctionEndsAt) {
      vehicle.isSold = true;
      await vehicle.save();
      return NextResponse.json({ error: "Auction has ended" }, { status: 400 });
    }
    const minBid = (vehicle.currentBid ?? vehicle.price) + (vehicle.currentBid ? 0 : 1);
    if (amount < minBid) {
      return NextResponse.json({ error: `Minimum bid is ${minBid}` }, { status: 400 });
    }

    await Bid.create({ vehicleId: vehicle._id, userId: user._id, amount });
    vehicle.currentBid = amount;
    await vehicle.save();

    return NextResponse.json({
      bid: { amount, vehicleId, currentBid: amount },
      message: "Bid placed successfully",
    });
  } catch (err) {
    console.error("Bids POST error:", err);
    return NextResponse.json({ error: "Failed to place bid" }, { status: 500 });
  }
}
