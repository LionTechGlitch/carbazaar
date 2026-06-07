import { cache } from "react";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Vehicle from "@/models/Vehicle";
import type { Vehicle as VehicleDTO } from "@/types/vehicle";

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

function serializeVehicle(v: VehicleDocument): VehicleDTO {
  return {
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
    location: v.location,
    phoneNumber: v.phoneNumber,
    imageUrl: v.imageUrl,
    images: v.images || [],
    image: v.imageUrl || v.images?.[0] || undefined,
    listingType: v.listingType,
    auctionEndsAt: v.auctionEndsAt,
    currentBid: v.currentBid,
    isSold: v.isSold,
    sellerId: v.sellerId?._id?.toString(),
    seller: v.sellerId
      ? { firstName: v.sellerId.firstName, lastName: v.sellerId.lastName, email: v.sellerId.email }
      : undefined,
  };
}

/** Cached per-request — shared by generateMetadata and the page component. */
export const getVehicleById = cache(async (id: string): Promise<VehicleDTO | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  await connectDB();
  const vehicle = await Vehicle.findById(id).populate("sellerId", "firstName lastName email").lean();
  if (!vehicle) return null;
  return serializeVehicle(vehicle as unknown as VehicleDocument);
});
