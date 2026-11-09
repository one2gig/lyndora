import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Order, OrderStatus, UserRole, CartItem } from '../types';

interface EcommerceState {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  currentUserRole: UserRole;
  setRole: (role: UserRole) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  placeOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

const RED_VELVET_IMAGE = 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=800&q=80';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Strawberry Dream',
    description: 'Fresh strawberries with vanilla sponge and whipped cream.',
    price: 85,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80',
    category: 'ready-made',
  },
  {
    id: 'p2',
    name: 'Chocolate Decadence',
    description: 'Triple layer dark chocolate cake with ganache filling.',
    price: 95,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
    category: 'ready-made',
  },
  {
    id: 'p3',
    name: 'Red Velvet Classic',
    description: 'The classic red velvet with cream cheese frosting.',
    price: 75,
    image: RED_VELVET_IMAGE,
    category: 'ready-made',
  },
  {
    id: 'p4',
    name: 'Blueberry Cheesecake',
    description: 'Creamy cheesecake with a biscuit base and blueberry topping.',
    price: 78,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80',
    category: 'ready-made',
  },
  {
    id: 'p5',
    name: 'Tiramisu Cake',
    description: 'Coffee-soaked layers with mascarpone cream and cocoa.',
    price: 96,
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800&q=80',
    category: 'ready-made',
  },
  {
    id: 'p6',
    name: 'Black Forest',
    description: 'Dark chocolate layers with cherries and whipped cream.',
    price: 98,
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&q=80',
    category: 'ready-made',
  },
  {
    id: 'p7',
    name: 'Funfetti Party',
    description: 'Vanilla sprinkle cake with pink drip frosting.',
    price: 80,
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&q=80',
    category: 'ready-made',
  },
  {
    id: 'p8',
    name: 'Cookies and Cream',
    description: 'Cookies-and-cream cake with pink drip and cookie crumbs.',
    price: 90,
    image: 'https://images.unsplash.com/photo-1616690710400-a16d146927c5?w=800&q=80',
    category: 'ready-made',
  },
  {
    id: 'p9',
    name: 'Salted Caramel',
    description: 'Vanilla cake with a glossy salted caramel glaze.',
    price: 92,
    image: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=800&q=80',
    category: 'ready-made',
  },
];

export const useEcommerceStore = create<EcommerceState>()(persist((set) => ({
  products: INITIAL_PRODUCTS,
  orders: [
    {
      id: 'ord-123',
      customerName: 'Redzuan Hiew',
      customerEmail: 'redzuan@example.com',
      items: [
        { name: 'Strawberry Dream', price: 85, quantity: 1, productId: 'p1' }
      ],
      total: 85,
      status: 'completed',
      createdAt: new Date().toISOString(),
    }
  ],
  cart: [],
  currentUserRole: 'customer',
  setRole: (role) => set({ currentUserRole: role }),
  addToCart: (item) => set((state) => ({
    cart: [...(state.cart ?? []), { ...item, id: Math.random().toString(36).substr(2, 9) }]
  })),
  removeFromCart: (id) => set((state) => ({
    cart: state.cart.filter((item) => item.id !== id)
  })),
  clearCart: () => set({ cart: [] }),
  addProduct: (product) => set((state) => ({
    products: [...state.products, { ...product, id: Math.random().toString(36).substr(2, 9) }]
  })),
  updateProduct: (id, updates) => set((state) => ({
    products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter(p => p.id !== id)
  })),
  placeOrder: (order) => set((state) => ({
    orders: [
      ...state.orders,
      {
        ...order,
        id: `ord-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        createdAt: new Date().toISOString(),
        status: 'pending'
      }
    ]
  })),
  updateOrderStatus: (id, status) => set((state) => ({
    orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
  })),
}), {
  name: 'lyndora-bake',
  version: 1,
  migrate: (persistedState, version) => {
    const persisted = (persistedState ?? {}) as Partial<EcommerceState>;
    const saved = persisted.products ?? INITIAL_PRODUCTS;
    const products = version < 1
      ? [
          ...saved.map((product) =>
            product.image.includes('photo-1586788680434-30d324671ff6')
              ? { ...product, image: RED_VELVET_IMAGE }
              : product
          ),
          ...INITIAL_PRODUCTS.filter((seed) => !saved.some((product) => product.id === seed.id)),
        ]
      : saved;
    return {
      products,
      orders: persisted.orders ?? [],
      cart: persisted.cart ?? [],
    };
  },
  partialize: (state) => ({ products: state.products, orders: state.orders, cart: state.cart }),
  merge: (persistedState, currentState) => {
    const persisted = persistedState as Partial<EcommerceState> | undefined;
    return {
      ...currentState,
      ...persisted,
      cart: persisted?.cart ?? [],
    };
  },
}));
