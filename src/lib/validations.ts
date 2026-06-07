import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required").trim(),
  lastName: z.string().min(1, "Last name is required").trim(),
  fatherName: z.string().trim().optional(),
  tribalName: z.string().trim().optional(),
  role: z.enum(["Buyer", "Seller", "Admin"]).default("Buyer"),
  phone: z.string().trim().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const vehicleSchema = z.object({
  make: z.string().min(1, "Make is required").trim(),
  model: z.string().min(1, "Model is required").trim(),
  description: z.string().trim().optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  condition: z.enum(["New", "Used", "Refurbished"]),
  price: z.number().min(0),
  mileage: z.number().min(0).optional().default(0),
  fuelType: z.string().trim().optional(),
  bodyStyle: z.string().trim().optional(),
  engineType: z.string().trim().optional(),
  phoneNumber: z.string().trim().optional(),
  imageUrl: z
    .string()
    .optional()
    .refine((val) => !val || /^https?:\/\//i.test(val) || /^data:image\//i.test(val), {
      message: "imageUrl must be a valid URL or uploaded image data",
    }),
  horsepower: z.number().int().min(0).optional(),
  torque: z.number().min(0).optional(),
  location: z.string().min(1, "Location is required").trim(),
  listingType: z.enum(["fixed", "auction"]).default("fixed"),
  auctionEndsAt: z.string().datetime().optional(),
  images: z.array(z.string().url()).optional().default([]),
});

export const orderSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle ID is required"),
  amount: z.number().min(0).optional(),
  paymentMethod: z.enum(["mpesa", "paypal", "bank"]).optional(),
});

export const bidSchema = z.object({
  vehicleId: z.string().min(1),
  amount: z.number().min(0),
});

export const searchVehiclesSchema = z.object({
  q: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  bodyStyle: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  location: z.string().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VehicleInput = z.infer<typeof vehicleSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type BidInput = z.infer<typeof bidSchema>;
export type SearchVehiclesQuery = z.infer<typeof searchVehiclesSchema>;
