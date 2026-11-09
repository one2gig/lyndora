/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { CakeDesign, CakeShape, CakeTier, TierSize, FrostingType } from '../types';
import { FROSTING_COLORS, FLAVORS } from '../constants';

interface CakeState {
  design: CakeDesign;
  setShape: (shape: CakeShape) => void;
  addTier: () => void;
  removeTier: () => void;
  updateTier: (index: number, updates: Partial<CakeTier>) => void;
  toggleDrip: (enabled: boolean) => void;
  setDripColor: (color: string) => void;
  toggleDecoration: (type: any) => void;
  setWording: (text: string) => void;
  setWordingColor: (color: string) => void;
  setNotes: (notes: string) => void;
}

const TIER_SIZE_STEPS: TierSize[] = ['XL', 'L', 'M', 'S'];

const DEFAULT_TIER: CakeTier = {
  id: Math.random().toString(36).substr(2, 9),
  size: 'XL',
  flavor: FLAVORS[0].id,
  frostingColor: FROSTING_COLORS[0].hex,
  frostingType: 'smooth',
};

export const useCakeStore = create<CakeState>((set) => ({
  design: {
    id: Math.random().toString(36).substr(2, 9),
    shape: 'round',
    tiers: [{ ...DEFAULT_TIER, size: 'XL' }],
    decorations: [],
    drip: {
      enabled: false,
      color: FROSTING_COLORS[2].hex,
    },
    wording: {
      text: '',
      color: FROSTING_COLORS[9].hex, // Default to a darker color like Rose
    },
    notes: '',
  },
  setShape: (shape) => 
    set((state) => ({ design: { ...state.design, shape } })),
  addTier: () => 
    set((state) => {
      if (state.design.tiers.length >= 4) return state;
      const nextSize = TIER_SIZE_STEPS[state.design.tiers.length] || 'S';
      return {
        design: {
          ...state.design,
          tiers: [...state.design.tiers, { ...DEFAULT_TIER, id: Math.random().toString(36).substr(2, 9), size: nextSize }]
        }
      };
    }),
  removeTier: () => 
    set((state) => {
      if (state.design.tiers.length <= 1) return state;
      return {
        design: {
          ...state.design,
          tiers: state.design.tiers.slice(0, -1)
        }
      };
    }),
  updateTier: (index, updates) =>
    set((state) => ({
      design: {
        ...state.design,
        tiers: state.design.tiers.map((t, i) => (i === index ? { ...t, ...updates } : t))
      }
    })),
  toggleDrip: (enabled) =>
    set((state) => ({ design: { ...state.design, drip: { ...state.design.drip, enabled } } })),
  setDripColor: (color) =>
    set((state) => ({ design: { ...state.design, drip: { ...state.design.drip, color } } })),
  toggleDecoration: (type) =>
    set((state) => {
      const exists = state.design.decorations.find(d => d.type === type);
      if (exists) {
        return { design: { ...state.design, decorations: state.design.decorations.filter(d => d.type !== type) } };
      }
      return { design: { ...state.design, decorations: [...state.design.decorations, { type }] } };
    }),
  setWording: (text) =>
    set((state) => ({ design: { ...state.design, wording: { ...state.design.wording, text } } })),
  setWordingColor: (color) =>
    set((state) => ({ design: { ...state.design, wording: { ...state.design.wording, color } } })),
  setNotes: (notes) =>
    set((state) => ({ design: { ...state.design, notes } })),
}));
