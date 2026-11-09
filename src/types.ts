/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CakeShape = 'round' | 'square';
export type FrostingType = 'smooth' | 'textured' | 'fondant' | 'naked';
export type TierSize = 'S' | 'M' | 'L' | 'XL';

export interface CakeTier {
  id: string;
  size: TierSize;
  flavor: string;
  frostingColor: string;
  frostingType: FrostingType;
}

export interface Decoration {
  type: 'sprinkles' | 'pearls' | 'flowers' | 'candles' | 'topper' | 'strawberry' | 'macaron' | 'chocolate_shard';
  count?: number;
  color?: string;
  variation?: string;
}

export interface CakeDesign {
  id: string;
  shape: CakeShape;
  tiers: CakeTier[];
  decorations: Decoration[];
  drip: {
    enabled: boolean;
    color: string;
  };
  wording: {
    text: string;
    color: string;
  };
  notes: string;
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface OrderItem {
  productId?: string;
  customDesign?: CakeDesign;
  quantity: number;
  price: number;
  name: string;
  pickupDate?: string;
  pickupTime?: string;
  notes?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  pickupDate: string;
  pickupTime: string;
  notes: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'ready-made' | 'custom-base' | 'seasonal';
}

export type UserRole = 'customer' | 'manager';
