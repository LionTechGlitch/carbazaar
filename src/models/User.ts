import mongoose, { Document, Schema } from "mongoose";

export type UserRole = "Buyer" | "Seller" | "Admin";

export interface IUser extends Document {
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  /** Optional: father's name (e.g. Pashtun "walad" naming) */
  fatherName?: string;
  /** Optional: tribal or family name */
  tribalName?: string;
  phone?: string;
  resetPasswordTokenHash?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ["Buyer", "Seller", "Admin"], default: "Buyer" },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    fatherName: { type: String, trim: true },
    tribalName: { type: String, trim: true },
    phone: { type: String, trim: true },
    resetPasswordTokenHash: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
