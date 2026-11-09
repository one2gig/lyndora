import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEcommerceStore } from '../../store/useEcommerceStore';
import { PickupDetails } from '../Orders/PickupDetails';
import type { CartItem } from '../../types';

const money = (amount: number) => `RM ${amount.toFixed(2)}`;

function formatPickupDate(value: string) {
  const parsed = parseISO(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return format(parsed, 'MMM d, yyyy');
}

export function CartPage({
  onShop,
  onPlaced,
}: {
  onShop: () => void;
  onPlaced: (message: string) => void;
}) {
  const cart = useEcommerceStore((state) => state.cart);
  const removeFromCart = useEcommerceStore((state) => state.removeFromCart);
  const clearCart = useEcommerceStore((state) => state.clearCart);
  const placeOrder = useEcommerceStore((state) => state.placeOrder);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = cart.find((line) => line.id === selectedId) ?? null;

  const total = cart.reduce((sum, line) => sum + line.price * line.quantity, 0);

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
    if (cart.length === 0) return;

    placeOrder({
      customerName,
      customerEmail,
      items: cart.map((line) => ({
        productId: line.productId,
        name: line.name,
        price: line.price,
        quantity: line.quantity,
        pickupDate: line.pickupDate,
        pickupTime: line.pickupTime,
        notes: line.notes || undefined,
      })),
      total,
    });
    clearCart();
    setError('');
    onPlaced(`Order placed for ${customerName}.`);
  };

  if (cart.length === 0) {
    return (
      <div className="px-4 sm:px-6 py-16 max-w-lg mx-auto text-center">
        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 p-10">
          <ShoppingBag className="h-12 w-12 text-pink-200 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-gray-900">Your cart is empty</h1>
          <p className="text-gray-500 mt-2 mb-6">Pick a cake, choose a pickup time, and it will wait here.</p>
          <Button onClick={onShop} className="rounded-2xl bg-pink-600 hover:bg-pink-700 h-12 px-8">
            Back to shop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Cart</h1>
        <p className="text-gray-500">Review pickup times, then check out.</p>
      </div>

      <ul className="space-y-3">
        {cart.map((line) => (
          <li key={line.id} className="flex gap-1 rounded-3xl bg-white p-2 shadow-lg shadow-gray-200/40">
            <button
              type="button"
              onClick={() => setSelectedId(line.id)}
              className="flex min-w-0 flex-1 gap-3 rounded-2xl p-2 text-left hover:bg-pink-50/70"
              aria-label={`View details for ${line.name}`}
            >
              <img src={line.image} alt="" className="h-20 w-20 rounded-2xl object-cover shrink-0 bg-gray-100" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-bold text-gray-900">{line.quantity}x {line.name}</p>
                  <p className="font-black text-pink-600 shrink-0">{money(line.price * line.quantity)}</p>
                </div>
                <PickupDetails pickupDate={line.pickupDate} pickupTime={line.pickupTime} notes={line.notes} />
              </div>
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full shrink-0 text-gray-400 hover:text-rose-600 self-center"
              aria-label={`Remove ${line.name}`}
              onClick={() => removeFromCart(line.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>

      <div className="rounded-3xl bg-white p-5 shadow-lg shadow-gray-200/40 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">Total</span>
          <span className="text-2xl font-black text-pink-600">{money(total)}</span>
        </div>
        <div className="grid gap-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest" htmlFor="cart-name">Name</label>
          <Input
            id="cart-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            className="rounded-2xl h-12"
          />
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest" htmlFor="cart-email">Email</label>
          <Input
            id="cart-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@email.com"
            className="rounded-2xl h-12"
          />
          {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
        </div>
        <Button
          onClick={handleCheckout}
          className="w-full h-14 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold"
        >
          Place order
        </Button>
      </div>

      <CartDetails line={selected} onOpenChange={(open) => { if (!open) setSelectedId(null); }} />
    </div>
  );
}

function CartDetails({
  line,
  onOpenChange,
}: {
  line: CartItem | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={line !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        {line && (
          <>
            <DialogHeader>
              <DialogTitle>{line.name}</DialogTitle>
              <DialogDescription>Details added for this cake.</DialogDescription>
            </DialogHeader>
            <img src={line.image} alt={line.name} className="w-full h-48 object-cover rounded-2xl bg-gray-100" />
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
              <dt className="font-bold text-gray-400 uppercase tracking-widest text-xs self-center">Quantity</dt>
              <dd className="font-medium text-gray-900">{line.quantity}</dd>
              <dt className="font-bold text-gray-400 uppercase tracking-widest text-xs self-center">Price</dt>
              <dd className="font-medium text-gray-900">{money(line.price)} each · {money(line.price * line.quantity)}</dd>
              <dt className="font-bold text-gray-400 uppercase tracking-widest text-xs self-center">Pickup date</dt>
              <dd className="font-medium text-gray-900">{formatPickupDate(line.pickupDate)}</dd>
              <dt className="font-bold text-gray-400 uppercase tracking-widest text-xs self-center">Pickup time</dt>
              <dd className="font-medium text-gray-900">{line.pickupTime}</dd>
              <dt className="font-bold text-gray-400 uppercase tracking-widest text-xs self-center">Notes</dt>
              <dd className="font-medium text-gray-900 whitespace-pre-wrap">{line.notes || 'None'}</dd>
            </dl>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
