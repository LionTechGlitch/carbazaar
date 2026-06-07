import mongoose, { Document, Schema } from "mongoose";

export type OrderStatus = "pending" | "paid" | "completed" | "cancelled";
export type PaymentMethod = "mpesa" | "paypal" | "bank";

export interface IOrder extends Document {
  vehicleId: mongoose.Types.ObjectId;
  buyerId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  /** For auction: winning bid amount */
  isAuction: boolean;
  /** M-Pesa / PayPal placeholder reference */
  paymentReference?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "KES" },
    status: { type: String, enum: ["pending", "paid", "completed", "cancelled"], default: "pending" },
    paymentMethod: { type: String, enum: ["mpesa", "paypal", "bank"] },
    isAuction: { type: Boolean, default: false },
    paymentReference: { type: String },
  },
  { timestamps: true }
);

OrderSchema.index({ buyerId: 1 });
OrderSchema.index({ sellerId: 1 });
OrderSchema.index({ vehicleId: 1 });

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
