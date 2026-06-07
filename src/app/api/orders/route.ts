import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Vehicle from "@/models/Vehicle";
import { getCurrentUser } from "@/lib/auth";
import { orderSchema } from "@/lib/validations";

interface PopulatedUser {
  firstName: string;
  lastName: string;
}

interface PopulatedVehicle {
  _id: mongoose.Types.ObjectId;
  make: string;
  model: string;
  year: number;
  price: number;
  images?: string[];
}

interface LeanOrder {
  _id: mongoose.Types.ObjectId;
  vehicleId?: PopulatedVehicle | null;
  amount: number;
  currency: string;
  status: string;
  paymentMethod?: string;
  isAuction: boolean;
  createdAt: Date;
  buyerId?: PopulatedUser | null;
  sellerId?: PopulatedUser | null;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getCurrentUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const orders = await Order.find({ $or: [{ buyerId: user._id }, { sellerId: user._id }] })
      .sort({ createdAt: -1 })
      .populate("vehicleId", "make model year price images")
      .populate("buyerId", "firstName lastName email")
      .populate("sellerId", "firstName lastName email")
      .lean();

    const list = (orders as unknown as LeanOrder[]).map((o) => ({
      id: o._id.toString(),
      vehicleId: o.vehicleId?._id?.toString(),
      vehicle: o.vehicleId
        ? {
            make: o.vehicleId.make,
            model: o.vehicleId.model,
            year: o.vehicleId.year,
            price: o.vehicleId.price,
            image: o.vehicleId.images?.[0],
          }
        : null,
      amount: o.amount,
      currency: o.currency,
      status: o.status,
      paymentMethod: o.paymentMethod,
      isAuction: o.isAuction,
      createdAt: o.createdAt,
      buyer: o.buyerId
        ? { firstName: o.buyerId.firstName, lastName: o.buyerId.lastName }
        : null,
      seller: o.sellerId
        ? { firstName: o.sellerId.firstName, lastName: o.sellerId.lastName }
        : null,
    }));

    return NextResponse.json({ orders: list });
  } catch (err) {
    console.error("Orders GET error:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getCurrentUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { vehicleId, amount, paymentMethod } = parsed.data;

    if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
      return NextResponse.json({ error: "Invalid vehicle ID" }, { status: 400 });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    if (vehicle.isSold) return NextResponse.json({ error: "Vehicle is already sold" }, { status: 400 });
    if (vehicle.sellerId.toString() === user._id.toString()) {
      return NextResponse.json({ error: "Cannot order your own listing" }, { status: 400 });
    }

    let orderAmount = vehicle.price;
    let isAuction = false;

    if (vehicle.listingType === "auction") {
      isAuction = true;
      orderAmount = vehicle.currentBid ?? vehicle.price;
      if (amount != null && amount > (vehicle.currentBid ?? 0)) {
        orderAmount = amount;
      }
    } else if (amount != null && amount > 0) {
      orderAmount = amount;
    }

    const order = await Order.create({
      vehicleId: vehicle._id,
      buyerId: user._id,
      sellerId: vehicle.sellerId,
      amount: orderAmount,
      currency: "USD",
      status: "pending",
      paymentMethod: paymentMethod || undefined,
      isAuction,
    });

    return NextResponse.json({
      order: {
        id: order._id,
        vehicleId: order.vehicleId,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
        isAuction: order.isAuction,
      },
    });
  } catch (err) {
    console.error("Orders POST error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}