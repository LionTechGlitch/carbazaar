export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  condition?: string;
  price: number;
  mileage: number;
  fuelType: string;
  bodyStyle: string;
  engineType?: string;
  description?: string;
  location?: string;
  phoneNumber?: string;
  image?: string;
  imageUrl?: string;
  images?: string[];
  listingType?: string;
  auctionEndsAt?: string | Date | null;
  currentBid?: number | null;
  isSold?: boolean;
  sellerId?: string;
  seller?: { email?: string; firstName?: string; lastName?: string };
}
