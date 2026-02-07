import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { ArrowRight, Utensils, Clock, Smartphone } from "lucide-react";

export default function Landing() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="h-screen w-full flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  
  if (user) return <Redirect to="/menu" />;

  return (
    <div className="min-h-screen bg-background">
      <nav className="container px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Utensils className="h-8 w-8 text-primary" />
          <span className="font-display font-bold text-2xl">Ambi's cafe</span>
        </div>
        <Button variant="ghost" asChild>
          <a href="/api/login">Login</a>
        </Button>
      </nav>

      <main className="container px-6 pt-12 pb-24 md:pt-24 md:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="font-display font-bold text-5xl md:text-7xl leading-[1.1] tracking-tight text-foreground">
              Skip the line,<br/>
              <span className="text-primary">Eat on time.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-[600px] leading-relaxed">
              Pre-order your favorite campus meals, grab your QR code, and pick up your food without the wait.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 rounded-2xl shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1"
                asChild
              >
                <a href="/api/login">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
              <div>
                <Clock className="h-6 w-6 text-primary mb-2" />
                <h3 className="font-bold">Fast Pickup</h3>
                <p className="text-sm text-muted-foreground">Ready when you arrive</p>
              </div>
              <div>
                <Smartphone className="h-6 w-6 text-primary mb-2" />
                <h3 className="font-bold">Contactless</h3>
                <p className="text-sm text-muted-foreground">Scan QR to collect</p>
              </div>
              <div>
                <Utensils className="h-6 w-6 text-primary mb-2" />
                <h3 className="font-bold">Fresh Food</h3>
                <p className="text-sm text-muted-foreground">Made to order</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[3rem] blur-3xl opacity-50 -z-10" />
            {/* Unsplash image of delicious burger or food bowl */}
            <img 
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80" 
              alt="Delicious food"
              className="rounded-[2rem] shadow-2xl border-4 border-background w-full object-cover aspect-square rotate-3 hover:rotate-0 transition-all duration-500"
            />
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-xl border border-border animate-bounce duration-[3000ms]">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Utensils className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-sm">Order Ready!</p>
                  <p className="text-xs text-muted-foreground">#ORDER-1234</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
