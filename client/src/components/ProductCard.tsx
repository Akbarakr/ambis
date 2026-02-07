import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Plus, Minus } from "lucide-react";

interface ProductCardProps {
  product: Product;
  isAdmin?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (id: number) => void;
}

export function ProductCard({ product, isAdmin, onEdit, onDelete }: ProductCardProps) {
  const { addToCart, items, updateQuantity } = useCart();
  
  const cartItem = items.find(item => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
      <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-secondary/30 text-secondary-foreground font-display text-4xl font-bold opacity-50">
            {product.name[0]}
          </div>
        )}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold rotate-12 shadow-lg">
              SOLD OUT
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-display font-bold text-lg leading-tight">{product.name}</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">
              {product.category}
            </p>
          </div>
          <div className="font-mono font-bold text-primary text-lg">
            ₹{Number(product.price).toFixed(0)}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[2.5rem]">
          {product.description}
        </p>

        {isAdmin ? (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onEdit?.(product)}
            >
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="icon"
              onClick={() => onDelete?.(product.id)}
            >
              <Minus className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {quantity > 0 ? (
              <div className="flex items-center justify-between w-full bg-secondary/50 rounded-lg p-1">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 hover:bg-background"
                  onClick={() => updateQuantity(product.id, -1)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="font-bold w-8 text-center">{quantity}</span>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 hover:bg-background"
                  onClick={() => addToCart(product)}
                  disabled={!product.isAvailable}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button 
                className="w-full rounded-xl font-semibold shadow-lg shadow-primary/20"
                onClick={() => addToCart(product)}
                disabled={!product.isAvailable}
              >
                Add to Cart
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
