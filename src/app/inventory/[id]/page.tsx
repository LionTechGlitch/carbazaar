import type { Metadata } from "next";
import VehicleDetailClient from "@/app/components/VehicleDetailClient";
import { getServerUserId } from "@/lib/auth";
import { getVehicleById } from "@/lib/vehicle-queries";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const vehicle = await getVehicleById(id);
    if (!vehicle) {
      return { title: "Vehicle Not Found | Car Bazaar", description: "Requested vehicle could not be found." };
    }
    return {
      title: `${vehicle.year} ${vehicle.make} ${vehicle.model} | Car Bazaar`,
      description:
        vehicle.description || `${vehicle.make} ${vehicle.model} available on Car Bazaar.`,
    };
  } catch {
    return { title: "Vehicle Details | Car Bazaar", description: "Browse vehicle details." };
  }
}

export default async function InventoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [car, userId] = await Promise.all([getVehicleById(id), getServerUserId()]);

  return <VehicleDetailClient id={id} car={car} userId={userId} />;
}
