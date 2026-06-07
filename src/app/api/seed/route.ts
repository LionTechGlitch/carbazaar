import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Vehicle from "@/models/Vehicle";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

/**
 * Optional: POST /api/seed to create a demo seller and sample vehicles.
 * Only runs when the database is empty (no vehicles).
 */
export async function POST() {
  try {
    await connectDB();
    const existing = await Vehicle.countDocuments();
    if (existing > 0) {
      return NextResponse.json({ message: "Database already has vehicles", count: existing });
    }

    let seller = await User.findOne({ email: "seller@carbazaar.com" });
    if (!seller) {
      const hashed = await bcrypt.hash("seller123", 12);
      seller = await User.create({
        email: "seller@carbazaar.com",
        password: hashed,
        firstName: "Demo",
        lastName: "Seller",
        role: "Seller",
      });
    }

    const sampleVehicles = [
      { _id: new mongoose.Types.ObjectId(), make: "Nissan", model: "Note Nismo", year: 2017, condition: "Used" as const, price: 9800, mileage: 83000, fuelType: "Gasoline", bodyStyle: "Hatchback", engineType: "1.2L I3", location: "Nairobi", description: "Nissan Note Nismo 2017, economical city hatchback.", imageUrl: "/api/assets/car/nissan-note-nismo", images: ["/api/assets/car/nissan-note-nismo"], sellerId: seller._id },
      { _id: new mongoose.Types.ObjectId(), make: "Toyota", model: "Corolla", year: 2021, condition: "Used" as const, price: 18900, mileage: 32000, fuelType: "Gasoline", bodyStyle: "Sedan", engineType: "1.8L I4", location: "Nairobi", description: "Reliable daily sedan in great condition.", imageUrl: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&q=80", images: ["https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&q=80"], sellerId: seller._id },
      { _id: new mongoose.Types.ObjectId(), make: "Toyota", model: "RAV4", year: 2022, condition: "Used" as const, price: 27900, mileage: 21000, fuelType: "Hybrid", bodyStyle: "SUV", engineType: "2.5L Hybrid", location: "Mombasa", description: "Fuel-efficient family SUV.", imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&q=80", images: ["https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&q=80"], sellerId: seller._id },
      { _id: new mongoose.Types.ObjectId(), make: "Nissan", model: "X-Trail", year: 2020, condition: "Used" as const, price: 21900, mileage: 44000, fuelType: "Gasoline", bodyStyle: "SUV", engineType: "2.5L I4", location: "Kisumu", description: "Spacious SUV with smooth ride.", imageUrl: "https://images.unsplash.com/photo-1493238792000-8113da705763?w=800&q=80", images: ["https://images.unsplash.com/photo-1493238792000-8113da705763?w=800&q=80"], sellerId: seller._id },
      { _id: new mongoose.Types.ObjectId(), make: "Nissan", model: "Navara", year: 2023, condition: "New" as const, price: 35900, mileage: 3000, fuelType: "Diesel", bodyStyle: "Pickup", engineType: "2.3L Turbo Diesel", location: "Nakuru", description: "Tough pickup for work and travel.", imageUrl: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800&q=80", images: ["https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800&q=80"], sellerId: seller._id },
      { _id: new mongoose.Types.ObjectId(), make: "BMW", model: "M5", year: 2021, condition: "Used" as const, price: 32900, mileage: 26000, fuelType: "Gasoline", bodyStyle: "Sedan", engineType: "4.4L V8 Twin Turbo", location: "Nairobi", description: "Sporty luxury sedan.", imageUrl: "/api/assets/car/bmw-m5", images: ["/api/assets/car/bmw-m5"], sellerId: seller._id },
      { _id: new mongoose.Types.ObjectId(), make: "BMW", model: "X5", year: 2024, condition: "New" as const, price: 65900, mileage: 2000, fuelType: "Hybrid", bodyStyle: "SUV", engineType: "3.0L Hybrid", location: "Eldoret", description: "Premium SUV with modern tech.", imageUrl: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&q=80", images: ["https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&q=80"], sellerId: seller._id },
      { _id: new mongoose.Types.ObjectId(), make: "Mercedes-Benz", model: "CLS 63", year: 2022, condition: "Used" as const, price: 41900, mileage: 19000, fuelType: "Gasoline", bodyStyle: "Sedan", engineType: "5.5L V8 BiTurbo", location: "Nairobi", description: "Elegant sedan with premium interior.", imageUrl: "/api/assets/car/mercedes-cls-63", images: ["/api/assets/car/mercedes-cls-63"], sellerId: seller._id },
      { _id: new mongoose.Types.ObjectId(), make: "Mercedes-Benz", model: "GLE 350", year: 2021, condition: "Used" as const, price: 58900, mileage: 28000, fuelType: "Diesel", bodyStyle: "SUV", engineType: "2.9L Diesel", location: "Mombasa", description: "Comfortable luxury SUV.", imageUrl: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80", images: ["https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80"], sellerId: seller._id },
      { _id: new mongoose.Types.ObjectId(), make: "Audi", model: "A4", year: 2020, condition: "Used" as const, price: 28900, mileage: 39000, fuelType: "Gasoline", bodyStyle: "Sedan", engineType: "2.0L TFSI", location: "Kisii", description: "Balanced performance and comfort.", imageUrl: "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=800&q=80", images: ["https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=800&q=80"], sellerId: seller._id },
      { _id: new mongoose.Types.ObjectId(), make: "Audi", model: "Q7", year: 2024, condition: "Used" as const, price: 58900, mileage: 16000, fuelType: "Diesel", bodyStyle: "SUV", engineType: "3.0L V6", location: "Nairobi", description: "Seven-seater premium SUV.", imageUrl: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=800&q=80", images: ["https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=800&q=80"], sellerId: seller._id },
      { _id: new mongoose.Types.ObjectId(), make: "Volkswagen", model: "Golf GTI", year: 2019, condition: "Used" as const, price: 24900, mileage: 47000, fuelType: "Gasoline", bodyStyle: "Hatchback", engineType: "2.0L Turbo", location: "Thika", description: "Fun and practical hot hatch.", imageUrl: "/api/assets/car/vw-golf-gti", images: ["/api/assets/car/vw-golf-gti"], sellerId: seller._id },
      { _id: new mongoose.Types.ObjectId(), make: "Volkswagen", model: "Tiguan", year: 2022, condition: "Used" as const, price: 30900, mileage: 22000, fuelType: "Gasoline", bodyStyle: "SUV", engineType: "2.0L TSI", location: "Nyeri", description: "Well-kept compact SUV.", imageUrl: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80", images: ["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80"], sellerId: seller._id },
      { _id: new mongoose.Types.ObjectId(), make: "Mazda", model: "CX-5", year: 2021, condition: "Used" as const, price: 26900, mileage: 31000, fuelType: "Gasoline", bodyStyle: "SUV", engineType: "2.5L Skyactiv", location: "Nairobi", description: "Refined crossover with great handling.", imageUrl: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80", images: ["https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80"], sellerId: seller._id },
      { _id: new mongoose.Types.ObjectId(), make: "Mazda", model: "Demio", year: 2018, condition: "Used" as const, price: 11900, mileage: 62000, fuelType: "Gasoline", bodyStyle: "Hatchback", engineType: "1.5L I4", location: "Machakos", description: "Affordable and economical commuter.", imageUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80", images: ["https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80"], sellerId: seller._id },
      { _id: new mongoose.Types.ObjectId(), make: "Subaru", model: "Forester", year: 2020, condition: "Used" as const, price: 23900, mileage: 41000, fuelType: "Gasoline", bodyStyle: "SUV", engineType: "2.5L Boxer", location: "Nakuru", description: "AWD SUV ready for any road.", imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80", images: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80"], sellerId: seller._id },
      { _id: new mongoose.Types.ObjectId(), make: "Subaru", model: "Legacy", year: 2019, condition: "Used" as const, price: 17900, mileage: 52000, fuelType: "Gasoline", bodyStyle: "Sedan", engineType: "2.5L Boxer", location: "Kericho", description: "Comfortable AWD sedan.", imageUrl: "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=800&q=80", images: ["https://images.unsplash.com/photo-1508974239320-0a029497e820?w=800&q=80"], sellerId: seller._id },
      { _id: new mongoose.Types.ObjectId(), make: "Honda", model: "Civic", year: 2021, condition: "Used" as const, price: 21900, mileage: 27000, fuelType: "Gasoline", bodyStyle: "Sedan", engineType: "2.0L I4", location: "Nairobi", description: "Clean and sporty compact sedan.", imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80", images: ["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80"], sellerId: seller._id },
      { _id: new mongoose.Types.ObjectId(), make: "Honda", model: "CR-V", year: 2022, condition: "Used" as const, price: 29900, mileage: 23000, fuelType: "Hybrid", bodyStyle: "SUV", engineType: "2.0L Hybrid", location: "Mombasa", description: "Spacious and fuel efficient.", imageUrl: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&q=80", images: ["https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&q=80"], sellerId: seller._id },
      { _id: new mongoose.Types.ObjectId(), make: "Lexus", model: "RX 350", year: 2023, condition: "Used" as const, price: 48900, mileage: 18000, fuelType: "Hybrid", bodyStyle: "SUV", engineType: "3.5L Hybrid", location: "Nairobi", description: "Luxury SUV with smooth drive.", imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80", images: ["https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80"], sellerId: seller._id },
      { _id: new mongoose.Types.ObjectId(), make: "Porsche", model: "911", year: 2023, condition: "Used" as const, price: 113000, mileage: 5000, fuelType: "Gasoline", bodyStyle: "Coupe", engineType: "3.0L Flat-6", location: "Nairobi", description: "Iconic high-performance sports car.", imageUrl: "/api/assets/car/porsche", images: ["/api/assets/car/porsche"], sellerId: seller._id },
      { _id: new mongoose.Types.ObjectId(), make: "Tesla", model: "Model S", year: 2024, condition: "Used" as const, price: 79900, mileage: 12000, fuelType: "Electric", bodyStyle: "Sedan", engineType: "Dual Motor EV", location: "Nairobi", description: "Fast EV in excellent condition.", imageUrl: "/api/assets/car/tesla", images: ["/api/assets/car/tesla"], sellerId: seller._id },
    ];

    await Vehicle.insertMany(sampleVehicles);
    return NextResponse.json({ message: "Seed complete", vehicles: sampleVehicles.length, sellerEmail: "seller@carbazaar.com" });
  } catch (err) {
    console.error("Seed error:", err);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
