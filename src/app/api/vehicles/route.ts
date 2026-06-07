import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Vehicle from "@/models/Vehicle";
import { getCurrentUser } from "@/lib/auth";
import { vehicleSchema, searchVehiclesSchema } from "@/lib/validations";
import { Types } from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const query = {
      q: searchParams.get("q") ?? undefined,
      minPrice: searchParams.get("minPrice") ?? undefined,
      maxPrice: searchParams.get("maxPrice") ?? undefined,
      bodyStyle: searchParams.get("bodyStyle") ?? undefined,
      make: searchParams.get("make") ?? undefined,
      model: searchParams.get("model") ?? undefined,
      location: searchParams.get("location") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    };
    const parsed = searchVehiclesSchema.safeParse(query);
    const opts = parsed.success ? parsed.data : { q: undefined, minPrice: undefined, maxPrice: undefined, bodyStyle: undefined, make: undefined, model: undefined, location: undefined, page: 1, limit: 20 };
    const { q, minPrice, maxPrice, bodyStyle, make, model, location, page, limit } = opts;

    const filter: Record<string, unknown> = { isSold: false };
    if (minPrice != null || maxPrice != null) {
      filter.price = {};
      if (minPrice != null) (filter.price as Record<string, number>).$gte = minPrice;
      if (maxPrice != null) (filter.price as Record<string, number>).$lte = maxPrice;
    }
    if (bodyStyle) filter.bodyStyle = new RegExp(bodyStyle, "i");
    if (make) filter.make = new RegExp(make, "i");
    if (model) filter.model = new RegExp(model, "i");
    if (location) filter.location = new RegExp(location, "i");
    if (q?.trim()) {
      const keyword = new RegExp(q.trim(), "i");
      filter.$or = [{ make: keyword }, { model: keyword }, { description: keyword }];
    }

    const skip = ((page ?? 1) - 1) * (limit ?? 20);
    const limitNum = limit ?? 20;
    const [vehicles, total] = await Promise.all([
      Vehicle.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).populate("sellerId", "firstName lastName email").lean(),
      Vehicle.countDocuments(filter),
    ]);

    const list = vehicles.map((v) => ({
      id: (v._id as Types.ObjectId).toString(),
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
      sellerId: (v.sellerId as { _id?: Types.ObjectId } | undefined)?._id?.toString(),
    }));

    return NextResponse.json({ vehicles: list, total, page: page ?? 1, limit: limitNum });
  } catch (err) {
    console.error("Vehicles GET error:", err);
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getCurrentUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const parsed = vehicleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const vehicle = await Vehicle.create({
      ...parsed.data,
      sellerId: user._id,
      imageUrl: parsed.data.imageUrl || parsed.data.images?.[0] || null,
      images: parsed.data.images?.length ? parsed.data.images : parsed.data.imageUrl ? [parsed.data.imageUrl] : [],
      auctionEndsAt: parsed.data.auctionEndsAt ? new Date(parsed.data.auctionEndsAt) : undefined,
    });

    return NextResponse.json({
      vehicle: {
        id: vehicle._id,
        make: vehicle.make,
        model: vehicle.model,
        imageUrl: vehicle.imageUrl,
        year: vehicle.year,
        condition: vehicle.condition,
        price: vehicle.price,
        location: vehicle.location,
        listingType: vehicle.listingType,
      },
    });
  } catch (err) {
    console.error("Vehicles POST error:", err);
    return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 });
  }
}
