import { useOrders, useUpdateOrderStatus } from "@/hooks/use-orders";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/use-products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ShoppingBag, 
  Plus, 
  Pencil, 
  Trash2,
  Package
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export default function ShopDashboard() {
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: products, isLoading: productsLoading } = useProducts();
  const updateStatus = useUpdateOrderStatus();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  if (ordersLoading || productsLoading) return <div className="p-8">Loading dashboard...</div>;

  const pendingOrders = orders?.filter((o: any) => o.status === 'pending') || [];
  const activeOrders = orders?.filter((o: any) => ['confirmed', 'pending'].includes(o.status)) || [];
  const completedOrders = orders?.filter((o: any) => o.status === 'completed') || [];

  const handleStatusUpdate = (id: number, status: string, paymentStatus?: string) => {
    updateStatus.mutate({ id, status, paymentStatus });
  };

  const handleProductSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: formData.get("price") as string,
      imageUrl: formData.get("imageUrl") as string,
      category: formData.get("category") as string,
      isAvailable: formData.get("isAvailable") === "on",
    };

    if (editingProduct) {
      updateProduct.mutate({ id: editingProduct.id, ...data }, {
        onSuccess: () => {
          setIsProductDialogOpen(false);
          setEditingProduct(null);
        }
      });
    } else {
      createProduct.mutate(data, {
        onSuccess: () => {
          setIsProductDialogOpen(false);
        }
      });
    }
  };

  const ProductManagement = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Menu Items</h2>
        <Dialog open={isProductDialogOpen} onOpenChange={(open) => {
          setIsProductDialogOpen(open);
          if (!open) setEditingProduct(null);
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={editingProduct?.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={editingProduct?.description} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input id="price" name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" name="category" defaultValue={editingProduct?.category} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" name="imageUrl" defaultValue={editingProduct?.imageUrl} required />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="isAvailable" name="isAvailable" defaultChecked={editingProduct ? editingProduct.isAvailable : true} />
                <Label htmlFor="isAvailable">In Stock</Label>
              </div>
              <Button type="submit" className="w-full" disabled={createProduct.isPending || updateProduct.isPending}>
                {editingProduct ? "Update Product" : "Create Product"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products?.map((product) => (
          <Card key={product.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <Badge variant={product.isAvailable ? "default" : "secondary"}>
                  {product.isAvailable ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>
              <CardDescription>₹{product.price} • {product.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 justify-end">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setEditingProduct(product);
                    setIsProductDialogOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this product?")) {
                      deleteProduct.mutate(product.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const OrderList = ({ orders }: { orders: any[] }) => (
    <div className="grid gap-4">
      {orders.length === 0 && <div className="text-center p-8 text-muted-foreground">No orders in this category</div>}
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold">
              Order #{String(order.id).padStart(4, '0')}
            </CardTitle>
            <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
              {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'} ({order.paymentMethod})
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start mb-4">
              <div className="w-full">
                <CardDescription className="mb-2">
                  {format(new Date(order.createdAt), "h:mm a")} • Total: ₹{Number(order.totalAmount).toFixed(0)}
                </CardDescription>
                <div className="space-y-1 bg-muted/30 p-2 rounded-lg">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="font-medium">{item.product?.name}</span>
                      <span className="text-muted-foreground">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 justify-end">
              {order.status === 'pending' && (
                <>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                  >
                    Reject
                  </Button>
                  <Button 
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-white" 
                    onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                  >
                    Accept Order
                  </Button>
                </>
              )}
              {order.status === 'confirmed' && (
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleStatusUpdate(order.id, 'completed', 'paid')}
                >
                  Mark Ready & Paid
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container px-4 py-8 pb-24">
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Orders</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="inventory">Manage Menu</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          <OrderList orders={activeOrders} />
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <OrderList orders={completedOrders} />
        </TabsContent>
        <TabsContent value="inventory" className="space-y-4">
          <ProductManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
