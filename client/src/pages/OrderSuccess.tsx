import { useOrder } from "@/hooks/use-orders";
import { useRoute } from "wouter";
import QRCode from "react-qr-code";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle2, Home } from "lucide-react";

export default function OrderSuccess() {
  const [, params] = useRoute("/orders/:id/success");
  const orderId = Number(params?.id);
  const { data: order, isLoading } = useOrder(orderId);

  if (isLoading || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-12 flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="bg-green-100 p-4 rounded-full mb-6 animate-in zoom-in duration-500">
        <CheckCircle2 className="h-16 w-16 text-green-600" />
      </div>
      
      <h1 className="font-display font-bold text-3xl mb-2">Order Confirmed!</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Your order has been successfully placed. Please show the QR code below at the counter to collect your food.
      </p>

      <Card className="w-full max-w-sm border-2 border-dashed border-primary/30 bg-white mb-8 shadow-xl">
        <CardContent className="p-8 flex flex-col items-center">
          <div className="bg-white p-4 rounded-xl border shadow-sm mb-6">
            <QRCode value={String(order.id).padStart(4, '0')} size={200} />
          </div>
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Order ID</p>
          <p className="font-mono font-bold text-4xl text-primary mb-4">#{String(order.id).padStart(4, '0')}</p>
          <div className="w-full border-t pt-4 mt-2">
            <div className="space-y-2 mb-4">
              <p className="text-xs text-left font-semibold text-muted-foreground uppercase">Items Ordered</p>
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.product?.name} x{item.quantity}</span>
                  <span>₹{(Number(item.priceAtTime) * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm mb-1 pt-2 border-t">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="font-bold text-lg">₹{Number(order.totalAmount).toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment</span>
              <span className="font-bold capitalize">{order.paymentMethod === 'cod' ? 'Pay at counter' : 'Razorpay'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <Link href="/orders">View My Orders</Link>
        </Button>
        <Button asChild>
          <Link href="/menu">
            <Home className="mr-2 h-4 w-4" /> Back to Menu
          </Link>
        </Button>
      </div>
    </div>
  );
}
