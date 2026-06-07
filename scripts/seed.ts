import * as dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/models/User";
import Vehicle from "../src/models/Vehicle";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/carbazaar";
const SEED_EMAIL = "demo.seller@carbazaar.local";
const SEED_PASSWORD = "DemoSeller123!";

const SAMPLES = [
  {
    make: "Ford",
    model: "Mustang",
    year: 2021,
    condition: "Used" as const,
    price: 78000,
    mileage: 42000,
    fuelType: "Gasoline",
    bodyStyle: "Coupe",
    engineType: "5.0L V8",
    location: "Nairobi",
    description: "Full service history, one owner. Premium trim.",
    imageUrl: "https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?w=1200&q=80&auto=format&fit=crop",
  },
  {
    make: "Mercedes-Benz",
    model: "S 63",
    year: 2020,
    condition: "Used" as const,
    price: 38500,
    mileage: 58000,
    fuelType: "Gasoline",
    bodyStyle: "Sedan",
    engineType: "4.0L V8 Biturbo",
    location: "Mombasa",
    description: "AMG line, panoramic roof, excellent condition.",
    imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80&auto=format&fit=crop",
  },
  {
    make: "BMW",
    model: "M5",
    year: 2019,
    condition: "Used" as const,
    price: 52000,
    mileage: 71000,
    fuelType: "Gasoline",
    bodyStyle: "Sedan",
    engineType: "4.4L V8 Biturbo",
    location: "Nairobi",
    description: "Competition package, leather seats, navigation.",
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80&auto=format&fit=crop",
  },
  {
    make: "Porsche",
    model: "GT3",
    year: 2022,
    condition: "Used" as const,
    price: 41000,
    mileage: 22000,
    fuelType: "Gasoline",
    bodyStyle: "Coupe",
    engineType: "4.0L Flat-6",
    location: "Kisumu",
    description: "Track ready, PDK, ceramic brakes.",
    imageUrl: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&q=80&auto=format&fit=crop",
  },
  {
    make: "Dodge",
    model: "Challenger SRT Hellcat",
    year: 2020,
    condition: "Used" as const,
    price: 29500,
    mileage: 65000,
    fuelType: "Gasoline",
    bodyStyle: "Sedan",
    engineType: "6.2L Supercharged V8",
    location: "Nakuru",
    description: "717hp supercharged beast, heads turning everywhere.",
    imageUrl: "https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=1200&q=80&auto=format&fit=crop",
  },
  {
    make: "Volkswagen",
    model: "Golf GTI",
    year: 2021,
    condition: "Used" as const,
    price: 33500,
    mileage: 38000,
    fuelType: "Gasoline",
    bodyStyle: "Hatchback",
    engineType: "2.0L turbo",
    location: "Eldoret",
    description: "Hot hatch, DSG, performance pack.",
    imageUrl: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1200&q=80&auto=format&fit=crop",
  },
];

async function main() {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
  console.log("Connected to MongoDB");

  let seller = await User.findOne({ email: SEED_EMAIL });
  if (!seller) {
    const hashed = await bcrypt.hash(SEED_PASSWORD, 10);
    seller = await User.create({
      email: SEED_EMAIL,
      password: hashed,
      firstName: "Demo",
      lastName: "Seller",
      role: "Seller",
    });
    console.log(`Created seed seller: ${SEED_EMAIL} / ${SEED_PASSWORD}`);
  } else {
    console.log(`Seed seller already exists: ${SEED_EMAIL}`);
  }

  const sellerId = seller._id;

  await Vehicle.deleteMany({});
  console.log("Cleared existing vehicles.");

  for (const row of SAMPLES) {
    await Vehicle.create({
      ...row,
      images: [row.imageUrl],
      listingType: "fixed",
      sellerId,
      isSold: false,
    });
  }

  console.log(`Inserted ${SAMPLES.length} vehicle(s) with correct images.`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});