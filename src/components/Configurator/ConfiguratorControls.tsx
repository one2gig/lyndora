/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCakeStore } from '../../store/useCakeStore';
import { SHAPES, FROSTING_COLORS, FLAVORS, TOPPINGS } from '../../constants';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Check, Droplets, Cherry, Type } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export function ConfiguratorControls() {
  const { design, setShape, addTier, removeTier, updateTier, toggleDrip, setDripColor, toggleDecoration, setWording, setWordingColor } = useCakeStore();

  return (
    <div className="flex flex-col h-full bg-white rounded-t-[2.5rem] shadow-[0_-15px_30px_-5px_rgba(0,0,0,0.05)] border-t border-pink-50 overflow-hidden">
      <div className="flex items-center justify-between p-4 pt-6 sm:p-5 sm:pt-7 sm:px-7 gap-3">
        <div>
          <h2 className="text-lg font-black text-gray-900 tracking-tight leading-none mb-1">DESIGN YOUR CAKE</h2>
          <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest leading-none">Lyndora Custom Bake</p>
        </div>
        <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl p-1 gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={removeTier} 
            disabled={design.tiers.length <= 1}
            className="h-10 w-10 p-0 rounded-xl hover:bg-white active:scale-90 transition-transform"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="px-2 flex flex-col items-center justify-center min-w-[3rem]">
            <span className="text-sm font-black text-gray-900 leading-none">{design.tiers.length}</span>
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter leading-none mt-1">Tier{design.tiers.length > 1 ? 's' : ''}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={addTier} 
            disabled={design.tiers.length >= 4}
            className="h-10 w-10 p-0 text-pink-600 rounded-xl hover:bg-white active:scale-90 transition-transform"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="shape" className="flex-1 flex flex-col min-h-0">
        <div className="px-4 mb-4">
          <TabsList className="w-full flex items-center bg-gray-50/80 p-1.5 rounded-[2rem] border border-gray-100/50 overflow-x-auto scrollbar-hide gap-1.5 h-[3.5rem] justify-start shadow-inner">
            <TabsTrigger value="shape" className="flex-shrink-0 min-w-[80px] rounded-2xl text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-md transition-all h-11 whitespace-nowrap">Shape</TabsTrigger>
            <TabsTrigger value="tiers" className="flex-shrink-0 min-w-[80px] rounded-2xl text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-md transition-all h-11 whitespace-nowrap">Tiers</TabsTrigger>
            <TabsTrigger value="drip" className="flex-shrink-0 min-w-[80px] rounded-2xl text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-md transition-all h-11 whitespace-nowrap">Drip</TabsTrigger>
            <TabsTrigger value="decor" className="flex-shrink-0 min-w-[90px] rounded-2xl text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-md transition-all h-11 whitespace-nowrap">Toppings</TabsTrigger>
            <TabsTrigger value="word" className="flex-shrink-0 min-w-[95px] rounded-2xl text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-md transition-all h-11 whitespace-nowrap">Wordings</TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1 min-h-0 overflow-hidden px-4 sm:px-8">
          <div className="pb-48 pt-4 space-y-10">
            <TabsContent value="shape" className="m-0 outline-none">
               <section>
                  <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Base Shape</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {SHAPES.map((s) => (
                      <Button
                        key={s.id}
                        variant={design.shape === s.id ? 'default' : 'outline'}
                        onClick={() => setShape(s.id as any)}
                        className={cn(
                          "h-16 flex flex-col gap-1 border-2 transition-all",
                          design.shape === s.id ? "border-pink-500 bg-pink-50 text-pink-700 hover:bg-pink-100" : "border-gray-100"
                        )}
                      >
                        <span className="text-sm font-semibold">{s.name}</span>
                      </Button>
                    ))}
                  </div>
               </section>
            </TabsContent>

            <TabsContent value="tiers" className="m-0 space-y-8 outline-none">
              {design.tiers.map((tier, idx) => {
                const tierRole = design.tiers.length === 1 ? 'base' : idx === 0 ? 'base' : idx === design.tiers.length - 1 ? 'top' : '';
                return (
                <div key={tier.id} className="space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="bg-pink-100 text-pink-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                     </div>
                     <h3 className="font-semibold text-gray-800">Tier {idx + 1} ({tier.size}){tierRole ? ` · ${tierRole}` : ''}</h3>
                  </div>
                  
                  <div className="space-y-4 pl-11">
                     <div>
                       <label className="text-xs font-medium text-gray-500 block mb-2">Flavor</label>
                       <div className="flex flex-wrap gap-2">
                         {FLAVORS.map(f => (
                           <Button
                              key={f.id}
                              variant="outline"
                              size="sm"
                              onClick={() => updateTier(idx, { flavor: f.id })}
                              className={cn(
                                "rounded-full border px-4 py-1 h-auto text-xs",
                                tier.flavor === f.id ? "bg-gray-800 text-white border-gray-800" : "text-gray-600 border-gray-200"
                              )}
                           >
                             {f.name}
                           </Button>
                         ))}
                       </div>
                     </div>

                     <div>
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-4">Frosting Color</label>
                       <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
                          {FROSTING_COLORS.map(c => (
                            <button
                              key={c.hex}
                              onClick={() => updateTier(idx, { frostingColor: c.hex })}
                              className={cn(
                                "flex-shrink-0 w-12 h-12 rounded-full border-2 transition-all active:scale-90 flex items-center justify-center shadow-sm",
                                tier.frostingColor === c.hex ? "border-pink-500 scale-110 ring-4 ring-pink-50" : "border-gray-50"
                              )}
                              style={{ backgroundColor: c.hex }}
                            >
                               {tier.frostingColor === c.hex && <Check className={cn("w-6 h-6", c.hex === '#ffffff' ? "text-gray-400" : "text-white shadow-sm")} />}
                            </button>
                          ))}
                       </div>
                     </div>
                  </div>
                  {idx < design.tiers.length - 1 && <Separator className="my-8 opacity-50" />}
                </div>
              );
              })}
            </TabsContent>

            <TabsContent value="drip" className="m-0 space-y-6 outline-none">
               <div className="flex items-center justify-between p-4 bg-pink-50 rounded-2xl border border-pink-100">
                  <div className="flex items-center gap-3">
                     <div className="bg-white p-2 rounded-xl shadow-sm">
                        <Droplets className="text-pink-500 h-6 w-6" />
                     </div>
                     <div>
                        <p className="font-semibold text-pink-900">Add Chocolate Drip</p>
                        <p className="text-xs text-pink-700 opacity-80">Available on top tier</p>
                     </div>
                  </div>
                  <Button 
                     variant={design.drip.enabled ? "default" : "outline"}
                     onClick={() => toggleDrip(!design.drip.enabled)}
                     className={cn(
                        "rounded-full transition-all",
                        design.drip.enabled ? "bg-pink-600 hover:bg-pink-700" : "border-pink-200 text-pink-600"
                     )}
                  >
                     {design.drip.enabled ? 'Enabled' : 'Add +'}
                  </Button>
               </div>

               {design.drip.enabled && (
                  <section className="animate-in fade-in slide-in-from-top-4 duration-300">
                     <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Drip Color</h3>
                     <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
                        {FROSTING_COLORS.map(c => (
                          <button
                            key={c.hex}
                            onClick={() => setDripColor(c.hex)}
                            className={cn(
                              "flex-shrink-0 w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center shadow-sm",
                              design.drip.color === c.hex ? "border-pink-500 scale-110 ring-4 ring-pink-50" : "border-gray-50"
                            )}
                            style={{ backgroundColor: c.hex }}
                          >
                             {design.drip.color === c.hex && <Check className={cn("w-6 h-6", c.hex === '#ffffff' ? "text-gray-400" : "text-white")} />}
                          </button>
                        ))}
                     </div>
                  </section>
               )}
            </TabsContent>
            
            <TabsContent value="decor" className="m-0 space-y-6 outline-none">
               <section className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="bg-orange-100 p-2 rounded-xl">
                        <Cherry className="text-orange-500 h-6 w-6" />
                     </div>
                     <div>
                        <h3 className="font-bold text-gray-800">Toppings</h3>
                        <p className="text-xs text-gray-500">Pick delicious items for your top tier</p>
                     </div>
                  </div>

                  <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
                     {TOPPINGS.map(topping => {
                        const isSelected = design.decorations.some(d => d.type === topping.id);
                        return (
                          <button
                            key={topping.id}
                            onClick={() => toggleDecoration(topping.id as any)}
                            className={cn(
                              "flex-shrink-0 w-32 flex flex-col items-center gap-3 p-4 rounded-3xl border-2 transition-all",
                              isSelected ? "border-pink-500 bg-pink-50 shadow-sm ring-4 ring-pink-50" : "border-gray-50 hover:border-pink-100"
                            )}
                          >
                            <div 
                              className="w-14 h-14 rounded-2xl shadow-inner border border-white/50 flex items-center justify-center relative" 
                              style={{ backgroundColor: topping.color }}
                            >
                               {isSelected && (
                                  <div className="absolute -top-2 -right-2 bg-pink-600 rounded-full p-1 shadow-lg border-2 border-white">
                                     <Check className="h-3 w-3 text-white" />
                                  </div>
                               )}
                            </div>
                            <div className="text-center">
                               <p className="text-[11px] font-black text-gray-900 uppercase tracking-tight leading-none mb-1">{topping.name}</p>
                               <p className="text-[10px] text-pink-600 font-bold tracking-tighter leading-none">+ RM {topping.price.toFixed(0)}</p>
                            </div>
                          </button>
                        );
                     })}
                  </div>
               </section>
            </TabsContent>
            
            <TabsContent value="word" className="m-0 space-y-6 outline-none">
               <section className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="bg-blue-100 p-2 rounded-xl">
                        <Type className="text-blue-500 h-6 w-6" />
                     </div>
                     <div>
                        <h3 className="font-bold text-gray-800">Cake Wording</h3>
                        <p className="text-xs text-gray-500">Add a custom message on your cake</p>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Message</label>
                        <Input 
                           placeholder="Happy Birthday!" 
                           value={design.wording.text}
                           onChange={(e) => setWording(e.target.value)}
                           className="rounded-2xl border-2 border-gray-100 focus:border-pink-500 transition-all h-12 px-4 shadow-sm"
                           maxLength={30}
                        />
                        <p className="text-[10px] text-gray-400 mt-2 text-right font-medium">{design.wording.text.length}/30 characters</p>
                     </div>

                     <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4">Text Color</label>
                        <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
                           {FROSTING_COLORS.map(c => (
                             <button
                               key={c.hex}
                               onClick={() => setWordingColor(c.hex)}
                               className={cn(
                                 "flex-shrink-0 w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center shadow-sm",
                                 design.wording.color === c.hex ? "border-pink-500 scale-110 ring-4 ring-pink-50" : "border-gray-50"
                               )}
                               style={{ backgroundColor: c.hex }}
                             >
                                {design.wording.color === c.hex && <Check className={cn("w-6 h-6", c.hex === '#ffffff' ? "text-gray-400" : "text-white")} />}
                             </button>
                           ))}
                        </div>
                     </div>
                  </div>
               </section>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
