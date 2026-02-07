import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCreateOrder } from "@/hooks/use-orders";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Trash2, Plus, Minus, ArrowRight, CreditCard, Banknote } from "lucide-react";
import { useState } from "react";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const createOrder = useCreateOrder();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'gpay'>('gpay');

  if (items.length === 0) {
    return (
      <div className="container px-4 py-24 flex flex-col items-center justify-center text-center">
        <div className="bg-secondary/30 p-8 rounded-full mb-6">
          <Trash2 className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="font-display font-bold text-2xl mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet.</p>
        <Button onClick={() => setLocation("/menu")} size="lg" className="rounded-xl">
          Browse Menu
        </Button>
      </div>
    );
  }

  const handleCheckout = () => {
    createOrder.mutate(
      {
        items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
        paymentMethod
      },
      {
        onSuccess: (order) => {
          clearCart();
          toast({
            title: "Order Placed!",
            description: "Your order has been received successfully.",
          });
          setLocation(`/orders/${order.id}/success`);
        },
        onError: (err) => {
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive",
          });
        }
      }
    );
  };

  return (
    <div className="container px-4 py-8 max-w-4xl pb-24">
      <h1 className="font-display font-bold text-3xl mb-8">Shopping Cart</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 bg-card rounded-xl border border-border/50 shadow-sm items-center">
              <div className="h-20 w-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-secondary text-secondary-foreground font-bold text-xl">
                    {item.name[0]}
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-display font-bold text-lg">{item.name}</h3>
                <p className="text-primary font-mono font-bold">₹{Number(item.price).toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, -1)}>
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, 1)}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeFromCart(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="rounded-2xl shadow-lg border-border">
            <CardContent className="p-6">
              <h3 className="font-display font-bold text-xl mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (0%)</span>
                  <span>₹0.00</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between font-bold text-lg text-foreground">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <Label className="font-bold">Payment Method</Label>
                <RadioGroup 
                  defaultValue="gpay" 
                  value={paymentMethod} 
                  onValueChange={(v) => setPaymentMethod(v as 'cod' | 'gpay')}
                  className="grid grid-cols-1 gap-3"
                >
                  <Label 
                    htmlFor="gpay" 
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'gpay' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:bg-secondary/50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="gpay" id="gpay" className="text-primary" />
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Razorpay</span>
                      </div>
                    </div>
                  </Label>
                  
                  <Label 
                    htmlFor="cod" 
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:bg-secondary/50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="cod" id="cod" className="text-primary" />
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4" />
                        <span>Pay at counter</span>
                      </div>
                    </div>
                  </Label>
                </RadioGroup>
              </div>

              <Button 
                className="w-full h-12 text-lg font-bold rounded-xl shadow-lg shadow-primary/25"
                onClick={handleCheckout}
                disabled={createOrder.isPending}
              >
                {createOrder.isPending ? "Processing..." : "Place Pre-order"}
                {!createOrder.isPending && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
