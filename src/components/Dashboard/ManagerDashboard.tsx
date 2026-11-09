import { useState, type ChangeEvent } from 'react';
import { useEcommerceStore } from '../../store/useEcommerceStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Package, ShoppingBag, CheckCircle, Clock, XCircle, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DesignSummary } from '../Orders/DesignSummary';
import { PickupDetails } from '../Orders/PickupDetails';
import { CakeScene } from '../Three/CakeScene';
import { CakeDesign, OrderItem, Product } from '../../types';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80';

type ProductForm = {
  name: string;
  description: string;
  price: string;
  image: string;
  category: Product['category'];
};

const emptyForm: ProductForm = {
  name: '',
  description: '',
  price: '',
  image: '',
  category: 'ready-made',
};

type CakePreview = {
  customerName: string;
  itemName: string;
  design: CakeDesign;
};

function OrderLine({
  item,
  customerName,
  onViewCake,
}: {
  item: OrderItem;
  customerName: string;
  onViewCake: (preview: CakePreview) => void;
}) {
  return (
    <>
      <p>{item.quantity}x {item.name}</p>
      {item.customDesign && (
        <div className="mt-2">
          <DesignSummary design={item.customDesign} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 rounded-full"
            onClick={() => onViewCake({
              customerName,
              itemName: item.name,
              design: item.customDesign as CakeDesign,
            })}
          >
            View 3D
          </Button>
        </div>
      )}
      <PickupDetails pickupDate={item.pickupDate} pickupTime={item.pickupTime} notes={item.notes} />
    </>
  );
}

function readProductImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Choose an image file.'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that image.'));
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 800;
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const context = canvas.getContext('2d');
        if (!context) {
          reject(new Error('Could not read that image.'));
          return;
        }
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = () => reject(new Error('Choose an image file.'));
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function ManagerDashboard() {
  const { orders, products, updateOrderStatus, deleteProduct, addProduct, updateProduct } = useEcommerceStore();
  const [productOpen, setProductOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [formError, setFormError] = useState('');
  const [cakePreview, setCakePreview] = useState<CakePreview | null>(null);

  const activeOrders = orders.filter((order) => order.status !== 'cancelled');
  const pendingCount = orders.filter((order) => order.status === 'pending').length;
  const revenue = activeOrders.reduce((total, order) => total + order.total, 0);
  const recentOrders = [...orders].reverse();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">Completed</Badge>;
      case 'processing': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">Processing</Badge>;
      case 'pending': return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200">Pending</Badge>;
      case 'cancelled': return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setProductOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      image: product.image,
      category: product.category,
    });
    setFormError('');
    setProductOpen(true);
  };

  const onImageSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const image = await readProductImage(file);
      setForm((current) => ({ ...current, image }));
      setFormError('');
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Choose an image file.');
    }
  };

  const saveProduct = () => {
    const price = Number(form.price);
    if (!form.name.trim() || !form.description.trim() || !Number.isFinite(price) || price <= 0) {
      setFormError('Name, description, and a price above 0 are required.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      image: form.image.trim() || FALLBACK_IMAGE,
      category: form.category,
    };

    if (editingId) {
      updateProduct(editingId, payload);
    } else {
      addProduct(payload);
    }
    setProductOpen(false);
  };

  const OrderActions = ({ orderId }: { orderId: string }) => (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
        aria-label={`Update status for ${orderId}`}
      >
        <MoreVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[160px]">
        <DropdownMenuItem
          onClick={() => updateOrderStatus(orderId, 'processing')}
          className="rounded-xl font-bold text-xs uppercase tracking-tight py-3 px-4"
        >
          <Clock className="h-4 w-4 mr-2 text-blue-500" />
          Processing
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => updateOrderStatus(orderId, 'completed')}
          className="rounded-xl font-bold text-xs uppercase tracking-tight py-3 px-4"
        >
          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
          Complete
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => updateOrderStatus(orderId, 'cancelled')}
          className="rounded-xl font-bold text-xs uppercase tracking-tight py-3 px-4 text-rose-600"
        >
          <XCircle className="h-4 w-4 mr-2" />
          Cancel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Control Panel</h1>
          <p className="text-gray-500 font-medium">Manage your boutique's operations and sales</p>
        </div>
        <div className="flex gap-3">
          <Button
            className="rounded-2xl bg-pink-600 hover:bg-pink-700 h-11 px-6 shadow-lg shadow-pink-200 transition-all active:scale-95"
            onClick={openCreate}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-gray-200/50 bg-white overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-2xl">
                <ShoppingBag className="text-blue-600 h-6 w-6" />
              </div>
              <p className="font-bold text-gray-500 uppercase tracking-widest text-[10px]">Total Orders</p>
            </div>
            <p className="text-4xl font-black text-gray-900">{orders.length}</p>
            <p className="text-xs text-amber-600 font-bold mt-2">{pendingCount} pending</p>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-gray-200/50 bg-white overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-pink-50 p-3 rounded-2xl">
                <Package className="text-pink-600 h-6 w-6" />
              </div>
              <p className="font-bold text-gray-500 uppercase tracking-widest text-[10px]">Active Products</p>
            </div>
            <p className="text-4xl font-black text-gray-900">{products.length}</p>
            <p className="text-xs text-gray-400 font-bold mt-2">Ready for sale</p>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-gray-200/50 bg-white overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-50 p-3 rounded-2xl">
                <CheckCircle className="text-green-600 h-6 w-6" />
              </div>
              <p className="font-bold text-gray-500 uppercase tracking-widest text-[10px]">Revenue</p>
            </div>
            <p className="text-4xl font-black text-gray-900">RM {revenue}</p>
            <p className="text-xs text-green-600 font-bold mt-2">{activeOrders.length} active orders</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100/50 p-1.5 rounded-2xl mb-6 sm:mb-8 border border-gray-100">
          <TabsTrigger value="orders" className="rounded-xl px-2 sm:px-8 py-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Orders</TabsTrigger>
          <TabsTrigger value="products" className="rounded-xl px-2 sm:px-8 py-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-3">
          <div className="md:hidden space-y-3">
            {recentOrders.map((order) => (
              <Card key={order.id} className="rounded-3xl border-none shadow-lg bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900">{order.customerName}</p>
                    <p className="text-xs text-gray-500 truncate">{order.customerEmail}</p>
                    <p className="font-mono text-[10px] text-gray-400 mt-1">{order.id}</p>
                  </div>
                  <OrderActions orderId={order.id} />
                </div>
                <div className="mt-3 space-y-2 text-sm font-medium text-gray-600">
                  {order.items.map((item, idx) => (
                    <div key={idx}>
                      <OrderLine item={item} customerName={order.customerName} onViewCake={setCakePreview} />
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  {getStatusBadge(order.status)}
                  <p className="font-black text-gray-900">RM {order.total}</p>
                </div>
              </Card>
            ))}
            {orders.length === 0 && (
              <p className="text-center py-12 text-gray-400 font-medium italic">No orders yet...</p>
            )}
          </div>

          <Card className="hidden md:block rounded-[2.5rem] border-none shadow-xl shadow-gray-200/50 bg-white overflow-hidden">
            <CardHeader className="p-8 border-b border-gray-50">
              <CardTitle>Order Pipeline</CardTitle>
              <CardDescription>Track and update customer cake orders</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead className="px-8 font-bold text-[10px] uppercase tracking-widest text-gray-400">Order ID</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest text-gray-400">Customer</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest text-gray-400">Items</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest text-gray-400">Total</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest text-gray-400">Status</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest text-gray-400 text-right pr-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50/30 transition-colors">
                      <TableCell className="px-8 font-mono text-xs font-bold text-gray-400">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-bold text-gray-900">{order.customerName}</p>
                          <p className="text-[10px] text-gray-500">{order.customerEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ul className="text-xs space-y-2">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="font-medium text-gray-600">
                              <OrderLine item={item} customerName={order.customerName} onViewCake={setCakePreview} />
                            </li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell className="font-black text-gray-900">RM {order.total}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right pr-8">
                        <OrderActions orderId={order.id} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {orders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-gray-400 font-medium italic">
                        No orders yet...
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <Card key={product.id} className="rounded-[2.5rem] border-none shadow-xl shadow-gray-200/50 bg-white overflow-hidden group">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button size="icon" variant="secondary" className="rounded-full shadow-lg h-9 w-9" onClick={() => openEdit(product)} aria-label={`Edit ${product.name}`}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="rounded-full shadow-lg h-9 w-9"
                      onClick={() => deleteProduct(product.id)}
                      aria-label={`Delete ${product.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-pink-600 transition-colors">{product.name}</h3>
                    <p className="font-black text-pink-600">RM {product.price}</p>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{product.description}</p>
                  <Badge variant="secondary" className="uppercase text-[9px] font-black tracking-widest rounded-lg">{product.category}</Badge>
                </CardContent>
              </Card>
            ))}
            <button
              type="button"
              onClick={openCreate}
              className="rounded-[2.5rem] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center p-8 hover:bg-gray-50/50 hover:border-pink-200 transition-all group"
            >
              <div className="bg-gray-100 p-4 rounded-3xl group-hover:bg-pink-100 transition-colors">
                <Plus className="h-8 w-8 text-gray-400 group-hover:text-pink-600" />
              </div>
              <p className="mt-4 font-bold text-gray-400 group-hover:text-pink-600">Add New Item</p>
            </button>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={cakePreview !== null} onOpenChange={(open) => { if (!open) setCakePreview(null); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{cakePreview?.itemName ?? 'Custom cake'}</DialogTitle>
            <DialogDescription>{cakePreview?.customerName}</DialogDescription>
          </DialogHeader>
          {cakePreview && (
            <div className="h-[50dvh] overflow-hidden rounded-2xl">
              <CakeScene design={cakePreview.design} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={productOpen} onOpenChange={setProductOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit product' : 'Add product'}</DialogTitle>
            <DialogDescription>This shows up on the shop as soon as you save it.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="product-name">Name</Label>
              <Input id="product-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="product-description">Description</Label>
              <Input id="product-description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="product-price">Price (RM)</Label>
              <Input id="product-price" type="number" min="1" step="1" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="product-image">Photo</Label>
              {form.image && (
                <img src={form.image} alt="" className="h-28 w-full rounded-xl object-cover" />
              )}
              <Input id="product-image" type="file" accept="image/*" onChange={onImageSelected} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="product-category">Category</Label>
              <select
                id="product-category"
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value as Product['category'] })}
                className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm"
              >
                <option value="ready-made">Ready-made</option>
                <option value="custom-base">Custom base</option>
                <option value="seasonal">Seasonal</option>
              </select>
            </div>
            {formError && <p className="text-sm text-rose-600">{formError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductOpen(false)}>Cancel</Button>
            <Button className="bg-pink-600 hover:bg-pink-700" onClick={saveProduct}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
