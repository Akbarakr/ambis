import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { Navigation } from "@/components/Navigation";
import NotFound from "@/pages/not-found";

// Pages
import Login from "@/pages/Login";
import Menu from "@/pages/Menu";
import Cart from "@/pages/Cart";
import OrderSuccess from "@/pages/OrderSuccess";
import StudentOrders from "@/pages/StudentOrders";
import ShopDashboard from "@/pages/ShopDashboard";
import ShopMenu from "@/pages/ShopMenu";
import ShopScanner from "@/pages/ShopScanner";

function PrivateRoute({ component: Component, ...rest }: any) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent" /></div>;

  if (!user) return <Redirect to="/" />;

  return <Component {...rest} />;
}

import { Intro } from "@/components/Intro";
import { useState, useEffect } from "react";

function Router() {
  const [showIntro, setShowIntro] = useState(true);

  if (showIntro) {
    return <Intro onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Login} />
          <Route path="/login" component={Login} />
          
          {/* Student Routes */}
          <Route path="/menu">
            <PrivateRoute component={Menu} />
          </Route>
          <Route path="/cart">
            <PrivateRoute component={Cart} />
          </Route>
          <Route path="/orders">
            <PrivateRoute component={StudentOrders} />
          </Route>
          <Route path="/orders/:id/success">
            <PrivateRoute component={OrderSuccess} />
          </Route>

          {/* Shopkeeper Routes */}
          <Route path="/shop">
            <PrivateRoute component={ShopDashboard} />
          </Route>
          <Route path="/shop/menu">
            <PrivateRoute component={ShopMenu} />
          </Route>
          <Route path="/shop/scanner">
            <PrivateRoute component={ShopScanner} />
          </Route>

          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Router />
          <Toaster />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
