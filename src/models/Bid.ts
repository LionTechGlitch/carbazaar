import mongoose, { Document, Schema } from "mongoose";

export interface IBid extends Document {
  vehicleId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amount: number;
  createdAt: Date;
}

const BidSchema = new Schema<IBid>(
  {
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

BidSchema.index({ vehicleId: 1, amount: -1 });

export default mongoose.models.Bid || mongoose.model<IBid>("Bid", BidSchema);
