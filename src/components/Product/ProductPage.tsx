import { useState } from 'react';
import { ChevronLeft, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useEcommerceStore } from '../../store/useEcommerceStore';

const money = (amount: number) => `RM ${amount.toFixed(2)}`;

function tomorrowValue() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function ProductPage({
  productId,
  onBack,
}: {
  productId: string;
  onBack: () => void;
}) {
  const product = useEcommerceStore((state) => state.products.find((item) => item.id === productId));
  const addToCart = useEcommerceStore((state) => state.addToCart);
  const [quantity, setQuantity] = useState(1);
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const earliest = tomorrowValue();

  if (!product) {
    return (
      <div className="px-4 sm:px-6 py-16 text-center">
        <p className="text-gray-500 mb-6">This cake is no longer available.</p>
        <Button onClick={onBack} className="rounded-2xl bg-pink-600 hover:bg-pink-700">
          Back to shop
        </Button>
      </div>
    );
  }

  const handleAdd = () => {
    if (!pickupDate || pickupDate < earliest) {
      setError('Choose a pickup date from tomorrow onward.');
      setAdded(false);
      return;
    }
    if (!pickupTime) {
      setError('Choose a pickup time.');
      setAdded(false);
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      pickupDate,
      pickupTime,
      notes: notes.trim(),
    });
    setError('');
    setAdded(true);
  };

  return (
    <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="rounded-full mb-4 -ml-2 gap-1">
        <ChevronLeft className="h-4 w-4" />
        Shop
      </Button>

      <div className="grid gap-6 md:grid-cols-2 md:gap-10">
        <button
          type="button"
          onClick={() => setViewerOpen(true)}
          className="rounded-3xl overflow-hidden bg-gray-100 cursor-zoom-in"
          aria-label={`View ${product.name}`}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full aspect-square object-cover"
          />
        </button>

        <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
          <DialogContent
            showCloseButton={false}
            overlayClassName="z-[70] bg-black/90"
            className="z-[70] w-auto max-w-[calc(100%-2rem)] border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-[min(100%-2rem,56rem)]"
          >
            <DialogTitle className="sr-only">{product.name}</DialogTitle>
            <img
              src={product.image}
              alt={product.name}
              className="max-h-[85dvh] w-full object-contain"
            />
            <DialogClose
              aria-label="Close image"
              render={<Button variant="secondary" size="icon" className="absolute top-3 right-3 rounded-full" />}
            >
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogContent>
        </Dialog>

        <div className="space-y-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-pink-600 mb-2">{product.category}</p>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">{product.name}</h1>
            <p className="text-2xl font-black text-pink-600 mt-2">{money(product.price)}</p>
            <p className="text-gray-500 mt-3 leading-relaxed">{product.description}</p>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-white border border-gray-100 px-4 py-3">
            <span className="text-sm font-bold text-gray-700">Quantity</span>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-full h-9 w-9"
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-6 text-center font-bold">{quantity}</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-full h-9 w-9"
                aria-label="Increase quantity"
                onClick={() => setQuantity((value) => value + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-3">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest" htmlFor="pickup-date">
              Pickup date
            </label>
            <Input
              id="pickup-date"
              type="date"
              min={earliest}
              value={pickupDate}
              onChange={(event) => setPickupDate(event.target.value)}
              className="rounded-2xl h-12"
            />
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest" htmlFor="pickup-time">
              Pickup time
            </label>
            <Input
              id="pickup-time"
              type="time"
              value={pickupTime}
              onChange={(event) => setPickupTime(event.target.value)}
              className="rounded-2xl h-12"
            />
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest" htmlFor="pickup-notes">
              Notes
            </label>
            <textarea
              id="pickup-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Allergies, message on the cake, or anything else"
              className="min-h-24 rounded-2xl border border-input bg-transparent px-3 py-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
            {added && <p className="text-sm font-medium text-pink-700">Added to cart</p>}
          </div>

          <Button
            onClick={handleAdd}
            className="w-full h-14 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-bold gap-2"
          >
            <ShoppingBag className="h-4 w-4" />
            Add to cart · {money(product.price * quantity)}
          </Button>
        </div>
      </div>
    </div>
  );
}
