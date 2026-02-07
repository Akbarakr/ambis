import { useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Product } from "@shared/schema";

export default function Menu() {
  const { data: products, isLoading } = useProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  if (isLoading) {
    return (
      <div className="container px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-muted rounded-2xl h-[300px] animate-pulse" />
        ))}
      </div>
    );
  }

  const categories = ["all", ...new Set(products?.map((p: Product) => p.category) || [])];

  const filteredProducts = products?.filter((product: Product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container px-4 py-8 pb-24">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl">Today's Menu</h1>
          <p className="text-muted-foreground">Order fresh food from Ambi's cafe</p>
        </div>
        
        <div className="w-full md:w-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search food..." 
            className="pl-10 w-full md:w-[300px] rounded-xl bg-card border-border shadow-sm focus:ring-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8" onValueChange={setCategory}>
        <TabsList className="bg-transparent p-0 h-auto flex-wrap gap-2 justify-start">
          {categories.map((cat) => (
            <TabsTrigger 
              key={cat} 
              value={cat}
              className="capitalize rounded-full px-6 py-2 border border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary shadow-sm hover:bg-secondary/50 transition-all"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts?.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {filteredProducts?.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-lg">No items found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
