import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Vehicle from "@/models/Vehicle";
import { getCurrentUser } from "@/lib/auth";

type VehicleDocument = {
  _id: mongoose.Types.ObjectId;
  make: string;
  model: string;
  description?: string;
  year: number;
  condition: string;
  price: number;
  mileage: number;
  fuelType: string;
  bodyStyle: string;
  engineType?: string;
  horsepower?: number;
  torque?: number;
  location: string;
  phoneNumber?: string;
  imageUrl?: string;
  images?: string[];
  listingType?: string;
  auctionEndsAt?: Date | null;
  currentBid?: number | null;
  isSold?: boolean;
  sellerId?: {
    _id?: mongoose.Types.ObjectId;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid vehicle ID" }, { status: 400 });
    }
    await connectDB();
    const vehicle = await Vehicle.findById(id).populate("sellerId", "firstName lastName email").lean();
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }
    const v = vehicle as unknown as VehicleDocument;
    return NextResponse.json({
      id: v._id.toString(),
      make: v.make,
      model: v.model,
      description: v.description,
      year: v.year,
      condition: v.condition,
      price: v.price,
      mileage: v.mileage,
      fuelType: v.fuelType,
      bodyStyle: v.bodyStyle,
      engineType: v.engineType,
      horsepower: v.horsepower,
      torque: v.torque,
      location: v.location,
      phoneNumber: v.phoneNumber,
      imageUrl: v.imageUrl,
      images: v.images || [],
      image: v.imageUrl || v.images?.[0] || null,
      listingType: v.listingType,
      auctionEndsAt: v.auctionEndsAt,
      currentBid: v.currentBid,
      isSold: v.isSold,
      sellerId: v.sellerId?._id?.toString(),
      seller: v.sellerId ? { firstName: v.sellerId.firstName, lastName: v.sellerId.lastName, email: v.sellerId.email } : null,
    });
  } catch (err) {
    console.error("Vehicle GET error:", err);
    return NextResponse.json({ error: "Failed to fetch vehicle" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid vehicle ID" }, { status: 400 });
    }
    await connectDB();
    const user = await getCurrentUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    if (vehicle.sellerId.toString() !== user._id.toString() && user.role !== "Admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const allowed = ["make", "model", "description", "year", "condition", "price", "mileage", "fuelType", "bodyStyle", "engineType", "horsepower", "torque", "location", "phoneNumber", "imageUrl", "images", "listingType", "auctionEndsAt", "isSold"];
    for (const key of allowed) {
      if (body[key] !== undefined) {
        (vehicle as Record<string, unknown>)[key] =
          key === "auctionEndsAt" && body[key] ? new Date(body[key]) : body[key];
      }
    }
    await vehicle.save();

    return NextResponse.json({ vehicle: { id: vehicle._id, make: vehicle.make, model: vehicle.model } });
  } catch (err) {
    console.error("Vehicle PUT error:", err);
    return NextResponse.json({ error: "Failed to update vehicle" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid vehicle ID" }, { status: 400 });
    }
    await connectDB();
    const user = await getCurrentUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    if (vehicle.sellerId.toString() !== user._id.toString() && user.role !== "Admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await Vehicle.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Vehicle DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete vehicle" }, { status: 500 });
  }
}
