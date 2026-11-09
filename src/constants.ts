/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CakeDesign } from './types';

export const FLAVORS = [
  { id: 'vanilla', name: 'Vanilla', color: '#f3e5ab' },
  { id: 'chocolate', name: 'Chocolate', color: '#3d1e1e' },
  { id: 'red_velvet', name: 'Red Velvet', color: '#7b1113' },
  { id: 'pandan', name: 'Pandan', color: '#90ee90' },
  { id: 'matcha', name: 'Matcha', color: '#8db600' },
];

export const FROSTING_COLORS = [
  { name: 'White', hex: '#ffffff' },
  { name: 'Cream', hex: '#fffdd0' },
  { name: 'Soft Pink', hex: '#ffb7c5' },
  { name: 'Lavender', hex: '#e6e6fa' },
  { name: 'Mint', hex: '#98ff98' },
  { name: 'Lemon', hex: '#fff44f' },
  { name: 'Peach', hex: '#ffdab9' },
  { name: 'Sky Blue', hex: '#87ceeb' },
  { name: 'Gold', hex: '#ffd700' },
  { name: 'Rose', hex: '#ff007f' },
  { name: 'Tiffany', hex: '#0abab5' },
  { name: 'Slate', hex: '#708090' },
];

export const TIER_SIZES: Record<string, number> = {
  'S': 1.5,
  'M': 2.2,
  'L': 3.0,
  'XL': 3.8,
};

export const TIER_PRICES: Record<string, number> = {
  S: 40,
  M: 55,
  L: 70,
  XL: 90,
};

export const DRIP_PRICE = 10;

export const SHAPES = [
  { id: 'round', name: 'Round' },
  { id: 'square', name: 'Square' },
];

export const FROSTING_TYPES = [
  { id: 'smooth', name: 'Smooth Buttercream' },
  { id: 'textured', name: 'Textured' },
  { id: 'fondant', name: 'Fondant' },
  { id: 'naked', name: 'Naked' },
];

export const TOPPINGS = [
  { id: 'strawberry', name: 'Strawberry', color: '#ff0000', price: 15 },
  { id: 'macaron', name: 'Macaron', color: '#ffb7c5', price: 20 },
  { id: 'chocolate_shard', name: 'Choco Shard', color: '#3d1e1e', price: 10 },
  { id: 'flowers', name: 'Edible Flowers', color: '#e6e6fa', price: 25 },
];

export function priceCake(design: CakeDesign) {
  const tierTotal = design.tiers.reduce((sum, tier) => sum + (TIER_PRICES[tier.size] ?? 0), 0);
  const toppingTotal = design.decorations.reduce((sum, decor) => {
    const topping = TOPPINGS.find((item) => item.id === decor.type);
    return sum + (topping?.price ?? 0);
  }, 0);
  const dripTotal = design.drip.enabled ? DRIP_PRICE : 0;

  return {
    tierTotal,
    toppingTotal,
    dripTotal,
    total: tierTotal + toppingTotal + dripTotal,
  };
}
