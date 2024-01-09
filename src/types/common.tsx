
type MediaItem = {
  id: number;
  start_day: number;
  end_day: number;
  growing_img: [];
}

export type Plant = {
  id: number;
  seed_id: number;
  user_id: number;
  name: string;
  image: string;
  date: string;
  current_period: number;
  seed_price: number;
  seed_weight: number;
  harvest_rate: number;
  seed_media: MediaItem[];
  profit: number;
  clone_rooting_period: number;
  vegetation_mass_period: number;
  flowering_preharvest_period: number;
  harvest_period: number;
  est_harvest_at: string;
  payment_method: number;
  price_sum: number;
  method_botanicare: number;
  method_rhizo: number;
  method_silica: number;
}

export type CoinInfo = {
  id: number;
  icon: string;
  name: string;
  symbol: string;
  unit: string;
  currency: string;
}

export type OptionInfo = {
  value: string;
  label: any;
}