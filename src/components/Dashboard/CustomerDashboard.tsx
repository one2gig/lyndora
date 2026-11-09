import { useEcommerceStore } from '../../store/useEcommerceStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ChevronRight, Clock, Star, MapPin, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DesignSummary } from '../Orders/DesignSummary';
import { PickupDetails } from '../Orders/PickupDetails';

export function CustomerDashboard({
  onShop,
  notice,
  onDismissNotice,
}: {
  onShop: () => void;
  notice?: string | null;
  onDismissNotice?: () => void;
}) {
  const { orders } = useEcommerceStore();
  const recentOrders = [...orders].reverse();

  const getStatusBadge = (status: string) => {
     switch (status) {
       case 'completed': return <Badge className="bg-green-100 text-green-700 border-green-200">Delivered</Badge>;
       case 'processing': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Baking</Badge>;
       case 'pending': return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Pending</Badge>;
       case 'cancelled': return <Badge className="bg-rose-100 text-rose-700 border-rose-200">Cancelled</Badge>;
       default: return <Badge variant="outline">{status}</Badge>;
     }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Profile Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-gray-200/50 bg-white overflow-hidden p-8 text-center">
           <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-pink-50">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>RH</AvatarFallback>
           </Avatar>
           <h2 className="text-xl font-bold text-gray-900">Redzuan Hiew</h2>
           <p className="text-xs font-bold text-pink-600 uppercase tracking-widest mt-1">Diamond Member</p>
           
           <div className="mt-8 space-y-4 text-left border-t border-gray-50 pt-8">
              <div className="flex items-center gap-3 text-gray-500">
                 <Mail className="h-4 w-4" />
                 <span className="text-xs font-medium">redzuan@example.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500">
                 <Phone className="h-4 w-4" />
                 <span className="text-xs font-medium">+60 12-345 6789</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500">
                 <MapPin className="h-4 w-4" />
                 <span className="text-xs font-medium line-clamp-1">Kuala Lumpur, Malaysia</span>
              </div>
           </div>
        </Card>

        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-gray-200/50 bg-gradient-to-br from-pink-500 to-rose-400 overflow-hidden p-8 text-white">
           <Star className="h-8 w-8 mb-4 opacity-50 fill-white" />
           <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Your Points</p>
           <p className="text-3xl font-black mb-4">1,240 pts</p>
           <Button variant="secondary" className="w-full rounded-2xl font-bold h-11 text-pink-600 shadow-lg">
              Redeem Rewards
           </Button>
        </Card>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3 space-y-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order History</h1>
          <p className="text-gray-500 font-medium italic">Track your delicious moments</p>
        </div>

        {notice && (
          <div className="flex items-start justify-between gap-4 rounded-3xl bg-pink-50 border border-pink-100 px-6 py-4">
            <p className="font-medium text-pink-900">{notice}</p>
            <Button variant="ghost" className="text-pink-700" onClick={onDismissNotice}>
              Dismiss
            </Button>
          </div>
        )}

        {orders.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 flex flex-col items-center">
              <div className="bg-gray-50 p-6 rounded-full mb-6">
                 <ShoppingBag className="h-12 w-12 text-gray-200" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">No orders yet</h3>
              <p className="text-gray-500 mt-2 mb-8 max-w-xs mx-auto">You haven't ordered any cakes yet. Let's design your first dream cake!</p>
              <Button 
                onClick={onShop}
                className="rounded-2xl bg-pink-600 hover:bg-pink-700 h-12 px-8 shadow-lg shadow-pink-200"
              >
                 Start Shopping
              </Button>
           </div>
        ) : (
           <div className="grid grid-cols-1 gap-6">
             {recentOrders.map((order) => (
               <Card key={order.id} className="rounded-3xl sm:rounded-[2.5rem] border-none shadow-xl shadow-gray-200/50 bg-white overflow-hidden p-5 sm:p-8 hover:ring-2 hover:ring-pink-100 transition-all group">
                 <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 sm:gap-6">
                   <div className="flex gap-4 sm:gap-6 items-start min-w-0">
                     <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gray-50 rounded-3xl flex items-center justify-center shrink-0 border border-gray-100">
                        <ShoppingBag className="h-8 w-8 text-pink-200" />
                     </div>
                     <div className="min-w-0">
                       <div className="flex items-center gap-3 mb-2">
                         <span className="font-mono text-xs font-black text-gray-400 group-hover:text-pink-600 transition-colors uppercase">{order.id}</span>
                         {getStatusBadge(order.status)}
                       </div>
                       <h3 className="font-bold text-lg text-gray-900">
                         {order.items.map(i => i.name).join(', ')}
                       </h3>
                       <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-tight flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {format(new Date(order.createdAt), 'MMM dd, yyyy')} • RM {order.total}
                       </p>
                       <div className="mt-4 space-y-3">
                         {order.items.map((item, index) => (
                           <div key={index}>
                             {item.customDesign ? (
                               <DesignSummary design={item.customDesign} />
                             ) : (
                               <div>
                                 <p className="text-sm font-medium text-gray-700">{item.quantity}x {item.name}</p>
                                 <PickupDetails pickupDate={item.pickupDate} pickupTime={item.pickupTime} notes={item.notes} />
                               </div>
                             )}
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                   <div className="flex flex-col sm:flex-row gap-3">
                      <Button variant="outline" className="rounded-2xl h-11 px-6 font-bold border-2 hover:border-pink-200 hover:bg-pink-50 transition-all text-xs w-full sm:w-auto">
                         View Details
                      </Button>
                      <Button className="rounded-2xl h-11 px-6 font-bold bg-gray-900 hover:bg-black shadow-lg transition-all text-xs w-full sm:w-auto">
                         Reorder
                      </Button>
                   </div>
                 </div>
               </Card>
             ))}
           </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <Card className="rounded-[2.5rem] border-none shadow-xl shadow-gray-200/50 bg-blue-600 overflow-hidden group">
              <CardContent className="p-10 relative text-white">
                 <div className="relative z-10">
                    <h3 className="text-2xl font-black mb-2 tracking-tight">Support Center</h3>
                    <p className="text-white/80 font-medium text-sm mb-6 max-w-[200px]">Need help with an order or have questions?</p>
                    <Button variant="secondary" className="rounded-2xl px-6 h-11 font-bold text-blue-600">
                       Chat With Us
                    </Button>
                 </div>
                 <Phone className="absolute bottom-[-20%] right-[-10%] h-48 w-48 text-white/5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700" />
              </CardContent>
           </Card>

           <Card className="rounded-[2.5rem] border-none shadow-xl shadow-gray-200/50 bg-amber-500 overflow-hidden group">
              <CardContent className="p-10 relative text-white">
                 <div className="relative z-10">
                    <h3 className="text-2xl font-black mb-2 tracking-tight">Refer a Friend</h3>
                    <p className="text-white/80 font-medium text-sm mb-6 max-w-[200px]">Get RM 20 discount for each friend you refer.</p>
                    <Button variant="secondary" className="rounded-2xl px-6 h-11 font-bold text-amber-600">
                       Invite Now
                    </Button>
                 </div>
                 <Star className="absolute bottom-[-20%] right-[-10%] h-48 w-48 text-white/5 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700" />
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
