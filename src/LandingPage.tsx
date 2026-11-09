/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion, useReducedMotion } from 'motion/react';
import { Sparkles, Star, ChevronRight, Instagram, ArrowRight, Heart, Cake, Users, Clock, ShoppingCart } from 'lucide-react';
import { useEcommerceStore } from './store/useEcommerceStore';
import heroDessert from './assets/hero-dessert.png';
import heroMobile from './assets/hero-mobile.png';

const INSTAGRAM_URL = 'https://www.instagram.com/lyndoraartisanbakes/';
const entranceEase = [0.22, 1, 0.36, 1] as const;

export function LandingPage({ onStart, onOpenProduct }: { onStart: () => void; onOpenProduct: (productId: string) => void }) {
  const products = useEcommerceStore((state) => state.products);
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const reduceMotion = useReducedMotion();
  const photoTransition = reduceMotion ? { duration: 0 } : { duration: 1.1, ease: entranceEase };
  const rise = (delay: number) => ({
    initial: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: reduceMotion ? { duration: 0 } : { duration: 0.8, ease: entranceEase, delay },
  });

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FFFBFB] text-gray-900 font-sans selection:bg-pink-100 selection:text-pink-900 pb-8">
      <section className="relative flex min-h-[calc(100dvh-4rem)] items-start justify-center overflow-hidden px-4 pt-8 md:min-h-[70vh] md:items-center md:pt-0">
        <motion.div
          className="absolute inset-0 bg-cover bg-bottom md:hidden"
          style={{ backgroundImage: `url(${heroMobile})` }}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={photoTransition}
        />
        <motion.div
          className="absolute inset-0 hidden bg-cover bg-center md:block"
          style={{ backgroundImage: `url(${heroDessert})` }}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={photoTransition}
        />
        <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full border border-white/80 md:top-1/2 md:h-80 md:w-[min(100%,34rem)] md:-translate-y-1/2 md:border-0 md:bg-pink-50/70 md:blur-3xl" />
        <div className="relative z-10 text-center space-y-6 max-w-3xl">
          <motion.div
            {...rise(0)}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/75 backdrop-blur-sm rounded-full border border-pink-100"
          >
            <Sparkles className="h-4 w-4 text-pink-500" />
            <span className="text-xs font-bold text-pink-600 uppercase tracking-widest">Premium Custom Cakes</span>
          </motion.div>
          
          <motion.h1 {...rise(0.12)} className="text-4xl sm:text-5xl md:text-[72px] leading-tight md:leading-[0.95] font-black text-pink-950">
            THE CAKE YOU <br />
            <span className="text-pink-500 italic">IMAGINED</span>, <br />
            <span className="relative inline-block pb-4 md:pb-3">
              BAKED REAL.
              <span className="absolute left-1/2 bottom-0 hidden h-1.5 w-28 -translate-x-1/2 rounded-full bg-pink-400 md:block" />
              <span className="absolute -bottom-1 left-1/2 w-36 -translate-x-1/2 text-pink-500 md:hidden" aria-hidden>
                <svg viewBox="0 0 144 20" className="h-4 w-full">
                  <path d="M6 8 C 36 18, 86 18, 128 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <Heart className="absolute -right-3 -top-2 h-4 w-4 fill-pink-500" />
              </span>
            </span>
          </motion.h1>
          
          <motion.p {...rise(0.24)} className="text-gray-600 text-lg max-w-sm mx-auto font-medium leading-relaxed">
            From classic favorites to high-end custom designs. Experience Malaysia's first 3D cake designer.
          </motion.p>

          <motion.div {...rise(0.36)}>
          <Button 
            onClick={onStart}
            className="h-14 sm:h-16 rounded-full bg-pink-600 hover:bg-pink-700 text-white text-base sm:text-lg font-bold shadow-2xl shadow-pink-200 gap-3 px-8 sm:px-10 group transition-all active:scale-95"
          >
            <span>Custom Design Now</span>
            <div className="bg-white/20 p-2 rounded-full group-hover:translate-x-1 transition-transform">
               <ArrowRight className="h-5 w-5" />
            </div>
          </Button>
          </motion.div>
        </div>
      </section>

      <main className="px-4 sm:px-6 pt-8 sm:pt-12">
        {/* Featured Products Listing */}
        <section className="max-w-7xl mx-auto space-y-8 mb-24">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                 <h2 className="text-3xl font-black text-gray-900 tracking-tight">Ready-to-Order</h2>
                 <p className="text-gray-500 font-medium italic">Our most loved signature collections</p>
              </div>
              <Button
                variant="ghost"
                className="text-pink-600 font-bold gap-2 self-start rounded-2xl bg-pink-50 hover:bg-pink-100 border border-pink-100 h-11 px-6"
                onClick={() => document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                 Browse All
                 <ChevronRight className="h-4 w-4" />
              </Button>
           </div>

           <div id="product-grid" className="grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 scroll-mt-24">
              {products.map((product) => {
                 const priceLabel = Number.isInteger(product.price) ? `RM${product.price}` : `RM${product.price.toFixed(2)}`;
                 const isSaved = !!saved[product.id];
                 return (
                 <motion.div
                    key={product.id}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="h-full w-full max-w-[20rem]"
                 >
                    <article
                       className="relative h-full cursor-pointer overflow-hidden rounded-[1.75rem] bg-white shadow-lg shadow-gray-200/40"
                       onClick={() => onOpenProduct(product.id)}
                    >
                       <div className="relative aspect-[6/5] overflow-hidden">
                          <img
                             src={product.image}
                             alt={product.name}
                             className="h-full w-full object-cover"
                          />
                          <button
                             type="button"
                             aria-label={isSaved ? `Unsave ${product.name}` : `Save ${product.name}`}
                             aria-pressed={isSaved}
                             onClick={(event) => {
                                event.stopPropagation();
                                setSaved((current) => ({ ...current, [product.id]: !current[product.id] }));
                             }}
                             className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg"
                          >
                             <Heart className={isSaved ? "h-6 w-6 fill-pink-500 text-pink-500" : "h-6 w-6 text-pink-500"} />
                          </button>
                       </div>
                       <div className="relative z-10 min-h-[10.5rem] px-5 pb-5 pt-4">
                          <h3 className="line-clamp-2 text-base font-bold leading-tight text-gray-900">{product.name}</h3>
                          <p className="mt-1.5 line-clamp-1 text-sm text-gray-400">{product.description}</p>
                          <p className="mt-3 text-2xl font-extrabold leading-none text-pink-500">{priceLabel}</p>
                          <div className="mt-5 flex items-center gap-4 pr-20 text-gray-500">
                             <Cake className="h-5 w-5 shrink-0" />
                             <span className="h-6 w-px bg-gray-300" />
                             <Users className="h-5 w-5 shrink-0" />
                             <span className="h-6 w-px bg-gray-300" />
                             <Clock className="h-5 w-5 shrink-0" />
                          </div>
                          <button
                             type="button"
                             aria-label={`Add ${product.name}`}
                             onClick={(event) => {
                                event.stopPropagation();
                                onOpenProduct(product.id);
                             }}
                             className="absolute bottom-5 right-5 flex h-16 w-16 items-center justify-center rounded-full bg-pink-600 text-white shadow-xl shadow-pink-200"
                          >
                             <ShoppingCart className="h-8 w-8" />
                          </button>
                       </div>
                    </article>
                 </motion.div>
                 );
              })}
           </div>
        </section>

        {/* Brand Story Section */}
        <section className="bg-gray-900 rounded-3xl sm:rounded-[4rem] p-6 sm:p-12 md:p-20 text-white mb-16 sm:mb-24 relative overflow-hidden">
           <div className="relative z-10 max-w-2xl">
              <span className="text-pink-500 font-bold uppercase tracking-[.3em] text-xs mb-6 block">Our Craft</span>
              <h2 className="text-3xl sm:text-5xl md:text-[60px] leading-tight md:leading-[0.95] font-black mb-6 sm:mb-8">
                 EVERY CAKE HAS A <br /> 
                 <span className="text-pink-500">STORY TO TELL.</span>
              </h2>
              <p className="text-gray-400 text-lg font-medium mb-10 leading-relaxed">
                 We believe that cakes are more than just dessert. They are the centerpiece of your most precious memories. That's why we combine traditional baking with modern technology.
              </p>
              <div className="flex flex-wrap gap-4">
                 <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-3xl">
                    <p className="text-3xl font-black text-pink-500 mb-1">100%</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Halal Ingredients</p>
                 </div>
                 <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-3xl">
                    <p className="text-3xl font-black text-pink-500 mb-1">24h</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Fast Delivery</p>
                 </div>
                 <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-3xl">
                    <p className="text-3xl font-black text-pink-500 mb-1">4.9/5</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Customer Rating</p>
                 </div>
              </div>
           </div>
           <Star className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] text-white/5 rotate-12" />
        </section>

        <div className="space-y-8 mb-24 max-w-7xl mx-auto">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                 <h2 className="text-3xl font-black text-gray-900 tracking-tight">On Instagram</h2>
                 <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 font-medium hover:text-pink-600"
                 >
                    @lyndoraartisanbakes
                 </a>
              </div>
              <Button
                 variant="ghost"
                 className="text-pink-600 font-bold gap-2 rounded-2xl bg-pink-50 h-11 px-6 shadow-sm"
                 render={<a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" />}
              >
                 <Instagram className="h-4 w-4" />
                 Follow IG
              </Button>
           </div>

           <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col sm:flex-row sm:items-center gap-6 rounded-[2.5rem] bg-gradient-to-br from-pink-500 to-rose-400 p-8 md:p-12 text-white shadow-xl shadow-pink-200/60 transition-transform hover:-translate-y-1"
           >
              <div className="bg-white/15 p-4 rounded-3xl w-fit">
                 <Instagram className="h-10 w-10" />
              </div>
              <div>
                 <p className="text-2xl font-black tracking-tight">Latest cakes and behind-the-scenes bakes</p>
                 <p className="mt-2 text-white/85 font-medium">Follow @lyndoraartisanbakes</p>
              </div>
           </a>
        </div>
      </main>
    </div>
  );
}
