import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { 
  Home, 
  ShoppingBag, 
  User, 
  LogOut, 
  Menu as MenuIcon,
  ChefHat,
  History,
  Phone,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function Navigation() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const [location] = useLocation();

  if (!user) return null;
  if (location === "/" || location === "/login") return null;

  const isShop = location.startsWith("/shop");

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-4 flex">
          <Link href={isShop ? "/shop" : "/menu"} className="mr-6 flex items-center space-x-2">
            <ChefHat className="h-6 w-6 text-primary" />
            <span className="hidden font-display font-bold text-xl sm:inline-block">
              {isShop ? "Ambi's cafe Admin" : "Ambi's cafe"}
            </span>
          </Link>
          
          <div className="hidden md:flex gap-6 items-center text-sm font-medium">
            {isShop ? (
              <>
                <Link href="/shop" className={location === "/shop" ? "text-primary" : "text-muted-foreground hover:text-foreground"}>Orders</Link>
                <Link href="/shop/menu" className={location === "/shop/menu" ? "text-primary" : "text-muted-foreground hover:text-foreground"}>Manage Menu</Link>
                <Link href="/shop/scanner" className={location === "/shop/scanner" ? "text-primary" : "text-muted-foreground hover:text-foreground"}>Scanner</Link>
              </>
            ) : (
              <>
                <Link href="/menu" className={location === "/menu" ? "text-primary" : "text-muted-foreground hover:text-foreground"}>Menu</Link>
                <Link href="/orders" className={location === "/orders" ? "text-primary" : "text-muted-foreground hover:text-foreground"}>My Orders</Link>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {!isShop && (
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {count > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                    {count}
                  </Badge>
                )}
              </Button>
            </Link>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-auto px-2 py-1 flex items-center gap-2 rounded-full hover:bg-accent">
                <span className="hidden sm:inline-block text-sm font-medium text-black">
                  {user.name || 'User'}
                </span>
                <Avatar className="h-8 w-8 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {user.name?.[0] || (user.role === 'admin' ? 'A' : 'S')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {user.name?.[0] || (user.role === 'admin' ? 'A' : 'S')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-bold leading-none text-black">{user.name || 'User'}</p>
                      <p className="text-xs text-muted-foreground mt-1">{user.email || 'No email registered'}</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {user.mobile}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <div className="flex items-center gap-2 p-2 cursor-pointer hover:bg-accent rounded-sm transition-colors" onClick={() => {/* Profile edit logic would go here */}}>
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm">Edit Profile</span>
                </div>
              </DropdownMenuItem>
              {isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  {isShop ? (
                    <DropdownMenuItem asChild>
                      <Link href="/menu" className="flex items-center gap-2 p-2 cursor-pointer">
                        <GraduationCap className="h-4 w-4 text-orange-600" />
                        <span className="text-sm">Switch to Student View</span>
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link href="/shop" className="flex items-center gap-2 p-2 cursor-pointer">
                        <ChefHat className="h-4 w-4 text-primary" />
                        <span className="text-sm">Switch to Shop View</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive cursor-pointer p-2 flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile Navigation Bar (Bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background p-2 flex justify-around items-center z-50">
        {isShop ? (
          <>
             <Link href="/shop" className={`flex flex-col items-center p-2 rounded-lg ${location === "/shop" ? "text-primary" : "text-muted-foreground"}`}>
               <History className="h-5 w-5" />
               <span className="text-[10px] mt-1">Orders</span>
             </Link>
             <Link href="/shop/menu" className={`flex flex-col items-center p-2 rounded-lg ${location === "/shop/menu" ? "text-primary" : "text-muted-foreground"}`}>
               <MenuIcon className="h-5 w-5" />
               <span className="text-[10px] mt-1">Menu</span>
             </Link>
             <Link href="/shop/scanner" className={`flex flex-col items-center p-2 rounded-lg ${location === "/shop/scanner" ? "text-primary" : "text-muted-foreground"}`}>
               <div className="bg-primary text-primary-foreground p-3 rounded-full -mt-8 shadow-lg border-4 border-background">
                 <ChefHat className="h-6 w-6" />
               </div>
               <span className="text-[10px] mt-1">Scan</span>
             </Link>
          </>
        ) : (
          <>
            <Link href="/menu" className={`flex flex-col items-center p-2 rounded-lg ${location === "/menu" ? "text-primary" : "text-muted-foreground"}`}>
              <MenuIcon className="h-5 w-5" />
              <span className="text-[10px] mt-1">Menu</span>
            </Link>
            <Link href="/cart" className={`flex flex-col items-center p-2 rounded-lg ${location === "/cart" ? "text-primary" : "text-muted-foreground"}`}>
               <div className="relative">
                 <ShoppingBag className="h-5 w-5" />
                 {count > 0 && <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-3 h-3 text-[8px] flex items-center justify-center">{count}</span>}
               </div>
              <span className="text-[10px] mt-1">Cart</span>
            </Link>
            <Link href="/orders" className={`flex flex-col items-center p-2 rounded-lg ${location === "/orders" ? "text-primary" : "text-muted-foreground"}`}>
              <History className="h-5 w-5" />
              <span className="text-[10px] mt-1">Orders</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
