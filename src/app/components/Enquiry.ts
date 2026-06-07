import mongoose, { Document, Schema } from "mongoose";

export interface IEnquiry extends Document {
  vehicleId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    buyerName: { type: String, required: true },
    buyerEmail: { type: String, required: true },
    buyerPhone: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

EnquirySchema.index({ sellerId: 1 });
EnquirySchema.index({ vehicleId: 1 });

export default mongoose.models.Enquiry || mongoose.model<IEnquiry>("Enquiry", EnquirySchema);