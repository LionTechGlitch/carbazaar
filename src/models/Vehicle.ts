import mongoose, { Document, Schema } from "mongoose";

export type VehicleCondition = "New" | "Used" | "Refurbished";
export type ListingType = "fixed" | "auction";

export interface IVehicle extends Omit<Document, "model"> {
  make: string;
  model: string;
  description?: string;
  year: number;
  condition: VehicleCondition;
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
  images: string[];
  listingType: ListingType;
  /** For auction: end time (ISO string) */
  auctionEndsAt?: Date;
  /** For auction: current highest bid amount */
  currentBid?: number;
  sellerId: mongoose.Types.ObjectId;
  isSold: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VehicleSchema = new Schema<IVehicle>(
  {
    make: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    year: { type: Number, required: true },
    condition: { type: String, enum: ["New", "Used", "Refurbished"], required: true },
    price: { type: Number, required: true },
    mileage: { type: Number, default: 0 },
    fuelType: { type: String, trim: true },
    bodyStyle: { type: String, trim: true },
    engineType: { type: String },
    horsepower: { type: Number },
    torque: { type: Number },
    location: { type: String, required: true, trim: true },
    phoneNumber: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    images: [{ type: String }],
    listingType: { type: String, enum: ["fixed", "auction"], default: "fixed" },
    auctionEndsAt: { type: Date },
    currentBid: { type: Number },
    sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isSold: { type: Boolean, default: false },
  },
  { timestamps: true }
);

VehicleSchema.index({ make: 1, model: 1 });
VehicleSchema.index({ description: "text", make: "text", model: "text" });
VehicleSchema.index({ price: 1 });
VehicleSchema.index({ bodyStyle: 1 });
VehicleSchema.index({ location: 1 });
VehicleSchema.index({ sellerId: 1 });

export default mongoose.models.Vehicle || mongoose.model<IVehicle>("Vehicle", VehicleSchema);
