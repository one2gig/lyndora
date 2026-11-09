import { useEcommerceStore } from '../../store/useEcommerceStore';
import { Button } from '@/components/ui/button';
import { User, ShoppingCart, ShoppingBag, Home, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar({ currentView, onNavigate }: { currentView: string, onNavigate: (view: any) => void }) {
  const { currentUserRole, setRole, cart } = useEcommerceStore();
  const cartCount = (cart ?? []).reduce((sum, line) => sum + line.quantity, 0);
  const showBottomNav = currentView !== 'configurator';

  const links = (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigate('landing')}
        className={cn("rounded-full px-3 h-9 font-bold text-xs uppercase tracking-wider", currentView === 'landing' ? "bg-pink-50 text-pink-600" : "text-gray-500")}
        aria-label="Shop"
      >
        <Home className="h-4 w-4 mr-2" />
        Shop
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigate('customer_dashboard')}
        className={cn("rounded-full px-3 h-9 font-bold text-xs uppercase tracking-wider", currentView === 'customer_dashboard' ? "bg-pink-50 text-pink-600" : "text-gray-500")}
        aria-label="My Orders"
      >
        <User className="h-4 w-4 mr-2" />
        My Orders
      </Button>
      {currentUserRole === 'manager' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('manager_dashboard')}
          className={cn("rounded-full px-3 h-9 font-bold text-xs uppercase tracking-wider", currentView === 'manager_dashboard' ? "bg-pink-50 text-pink-600" : "text-gray-500")}
          aria-label="Admin Panel"
        >
          <LayoutDashboard className="h-4 w-4 mr-2" />
          Admin
        </Button>
      )}
    </>
  );

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-8 min-w-0">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 group min-w-0"
          >
            <div className="bg-gradient-to-br from-pink-500 to-rose-400 p-2 rounded-xl group-hover:scale-105 transition-transform duration-300 shrink-0">
              <ShoppingCart className="text-white h-5 w-5" />
            </div>
            <span className="font-black text-lg sm:text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-500">
              LYNDORA
            </span>
          </button>

          <div className="hidden sm:flex items-center gap-1">
            {links}
          </div>
        </div>

        <div className="flex items-center shrink-0 gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('cart')}
            aria-label={`Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
            className={cn("relative rounded-full h-9 w-9", currentView === 'cart' ? "bg-pink-50 text-pink-600" : "text-gray-600")}
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-pink-600 text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>
          <div className="bg-gray-50 p-1 rounded-full border border-gray-100 flex gap-1">
            <Button
              variant={currentUserRole === 'customer' ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full h-8 px-3 text-[10px] font-bold uppercase tracking-tight"
              onClick={() => setRole('customer')}
            >
              Buyer
            </Button>
            <Button
              variant={currentUserRole === 'manager' ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full h-8 px-3 text-[10px] font-bold uppercase tracking-tight"
              onClick={() => setRole('manager')}
            >
              Seller
            </Button>
          </div>
        </div>
      </nav>

      {showBottomNav && (
        <nav className="sm:hidden fixed bottom-0 inset-x-0 z-50 border-t border-gray-100 bg-white/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
          <div className={cn("grid", currentUserRole === 'manager' ? "grid-cols-3" : "grid-cols-2")}>
            <button
              type="button"
              onClick={() => onNavigate('landing')}
              className={cn("flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold uppercase tracking-wide", currentView === 'landing' ? "text-pink-600" : "text-gray-500")}
            >
              <Home className="h-5 w-5" />
              Shop
            </button>
            <button
              type="button"
              onClick={() => onNavigate('customer_dashboard')}
              className={cn("flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold uppercase tracking-wide", currentView === 'customer_dashboard' ? "text-pink-600" : "text-gray-500")}
            >
              <User className="h-5 w-5" />
              Orders
            </button>
            {currentUserRole === 'manager' && (
              <button
                type="button"
                onClick={() => onNavigate('manager_dashboard')}
                className={cn("flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold uppercase tracking-wide", currentView === 'manager_dashboard' ? "text-pink-600" : "text-gray-500")}
              >
                <LayoutDashboard className="h-5 w-5" />
                Admin
              </button>
            )}
          </div>
        </nav>
      )}
    </>
  );
}
