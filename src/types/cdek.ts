export interface PickupPoint {
  address: string;
  allowed_cod: boolean;
  city: string;
  city_code: number;
  code: string;
  country_code: string;
  dimensions: [number, number, number] | null; // Assuming dimensions could have width, height, and length in future
  have_cash: boolean;
  have_cashless: boolean;
  is_dressing_room: boolean;
  location: [number, number];
  name: string;
  postal_code: string;
  region: string;
  type: string; // e.g., "PVZ" for pickup points
  weight_max: number;
  weight_min: number;
  work_time: string;
}
