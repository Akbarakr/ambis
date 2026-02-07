import { useOrders } from "@/hooks/use-orders";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

export default function StudentOrders() {
  const { data: orders, isLoading } = useOrders();
  const { user } = useAuth();

  // Orders are already filtered by user on the backend
  const myOrders = orders || [];

  if (isLoading) {
    return <div className="p-8 text-center">Loading orders...</div>;
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container px-4 py-8 pb-24">
      <h1 className="font-display font-bold text-3xl mb-8">Order History</h1>

      <div className="space-y-8">
        {/* Pending Orders Section */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-yellow-400" />
            Pending Orders
          </h2>
          <div className="space-y-4">
            {myOrders.filter((o: any) => o.status === 'pending' || o.status === 'confirmed').length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No pending orders.</p>
            ) : (
              myOrders
                .filter((o: any) => o.status === 'pending' || o.status === 'confirmed')
                .map((order: any) => (
                  <OrderCard key={order.id} order={order} getStatusColor={getStatusColor} />
                ))
            )}
          </div>
        </div>

        {/* Served Orders Section */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-400" />
            Served Orders
          </h2>
          <div className="space-y-4">
            {myOrders.filter((o: any) => o.status === 'completed').length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No served orders yet.</p>
            ) : (
              myOrders
                .filter((o: any) => o.status === 'completed')
                .map((order: any) => (
                  <OrderCard key={order.id} order={order} getStatusColor={getStatusColor} />
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order, getStatusColor }: { order: any, getStatusColor: (s: string) => string }) {
  return (
    <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <Link href={`/orders/${order.id}/success`} className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono font-bold text-lg">#{String(order.id).padStart(4, '0')}</span>
              <Badge className={`${getStatusColor(order.status)} border-none shadow-none`}>
                {order.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {format(new Date(order.createdAt), "PPP 'at' p")}
            </p>
          </div>
          
          <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto">
            <div className="text-left md:text-right">
              <p className="text-xs text-muted-foreground uppercase">Total</p>
              <p className="font-bold text-lg">₹{Number(order.totalAmount).toFixed(2)}</p>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="capitalize">
                {order.paymentMethod === 'cod' ? 'Pay at counter' : 'Razorpay'}
              </Badge>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
