/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { CakeScene } from '../Three/CakeScene';
import { ConfiguratorControls } from './ConfiguratorControls';
import { DesignSummary } from '../Orders/DesignSummary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ShoppingBag, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCakeStore } from '../../store/useCakeStore';
import { useEcommerceStore } from '../../store/useEcommerceStore';
import { priceCake } from '../../constants';

const money = (amount: number) => `RM ${amount.toFixed(2)}`;

export function ConfiguratorPage({ onBack, onPlaced }: { onBack: () => void; onPlaced: (message: string) => void }) {
  const [showSummary, setShowSummary] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const design = useCakeStore((state) => state.design);
  const setNotes = useCakeStore((state) => state.setNotes);
  const placeOrder = useEcommerceStore((state) => state.placeOrder);
  const quote = priceCake(design);

  const handleCheckout = () => {
    const customerName = name.trim();
    const customerEmail = email.trim();
    if (!customerName || !customerEmail) {
      setError('Name and email are required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      setError('Enter a valid email.');
      return;
    }

    const trimmedNote = note.trim();
    setNotes(trimmedNote);
    const latest = useCakeStore.getState().design;
    const total = priceCake(latest).total;

    placeOrder({
      customerName,
      customerEmail,
      items: [
        {
          customDesign: latest,
          name: 'Custom Designed Cake',
          price: total,
          quantity: 1,
        },
      ],
      total,
    });
    setShowSummary(false);
    setError('');
    onPlaced(`Order placed for ${customerName}. We'll start on your custom cake.`);
  };

  return (
    <div className="relative h-[calc(100dvh-4rem)] w-full flex flex-col bg-white overflow-hidden selection:bg-pink-100">
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-4 pointer-events-none">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          className="rounded-full bg-white/90 backdrop-blur-md pointer-events-auto border-gray-100 shadow-md active:scale-90 transition-transform"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex gap-2 pointer-events-auto">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white/90 backdrop-blur-md border-gray-100 shadow-md active:scale-90 transition-transform"
            aria-label="Share"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            className="rounded-full bg-pink-600 hover:bg-pink-700 text-white shadow-lg pointer-events-auto gap-2 px-4 sm:px-6 font-bold shadow-pink-200 active:scale-95 transition-transform"
            onClick={() => setShowSummary(true)}
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="sm:hidden">Order</span>
            <span className="hidden sm:inline">Order · {money(quote.total)}</span>
          </Button>
        </div>
      </div>

      <div className="h-[32dvh] sm:h-[40dvh] w-full relative z-10">
        <CakeScene />
        <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none">
          <div className="bg-white/50 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] text-gray-600 font-bold uppercase tracking-widest shadow-sm border border-white/20">
            Live Preview
          </div>
        </div>
      </div>

      <div className="flex-1 relative z-20 min-h-0 bg-white">
        <ConfiguratorControls />
      </div>

      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute inset-0 z-50 bg-white flex flex-col"
          >
            <div className="flex-1 overflow-y-auto px-4 sm:px-8 pt-20 pb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Order Summary</h2>
              <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-pink-600 uppercase mb-2">Your Design</p>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Custom Cake</h3>
                    <DesignSummary design={design} />
                  </div>
                  <p className="text-sm text-gray-500">Delivery: Estimated 3 days</p>
                </div>

                <div className="grid gap-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest" htmlFor="order-name">Name</label>
                  <Input
                    id="order-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                    className="rounded-2xl h-12"
                  />
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest" htmlFor="order-email">Email</label>
                  <Input
                    id="order-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@email.com"
                    className="rounded-2xl h-12"
                  />
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest" htmlFor="order-note">Note</label>
                  <Input
                    id="order-note"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Pickup time, allergies, or a message for the baker"
                    className="rounded-2xl h-12"
                  />
                  {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
                </div>

                <div className="flex justify-between items-center py-4 border-b">
                  <span className="text-gray-600">Tiers</span>
                  <span className="font-bold">{money(quote.tierTotal)}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b">
                  <span className="text-gray-600">Toppings</span>
                  <span className="font-bold">{money(quote.toppingTotal)}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b">
                  <span className="text-gray-600">Drip</span>
                  <span className="font-bold">{money(quote.dripTotal)}</span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-black text-pink-600">{money(quote.total)}</span>
                </div>
              </div>
            </div>
            <div className="p-8 pt-4 space-y-4 border-t border-gray-100">
              <Button
                className="w-full h-16 rounded-2xl bg-black text-white text-lg font-bold"
                onClick={handleCheckout}
              >
                Place Custom Order
              </Button>
              <Button
                variant="ghost"
                className="w-full h-12 text-gray-400"
                onClick={() => setShowSummary(false)}
              >
                Keep designing
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
