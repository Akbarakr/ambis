import { useState } from "react";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema, InsertProduct, Product } from "@shared/schema";
import { Plus } from "lucide-react";
import { z } from "zod";

// Need to handle decimal coercing for the form
const formSchema = insertProductSchema.extend({
  price: z.coerce.number(),
});

export default function ShopMenu() {
  const { data: products, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "main",
      imageUrl: "",
      isAvailable: true,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Convert price back to string/decimal format as expected by API schema
    const payload = { ...data, price: data.price };
    
    if (editingProduct) {
      updateProduct.mutate(
        { id: editingProduct.id, ...payload },
        { onSuccess: () => setIsDialogOpen(false) }
      );
    } else {
      createProduct.mutate(payload, { onSuccess: () => setIsDialogOpen(false) });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description,
      price: Number(product.price),
      category: product.category,
      imageUrl: product.imageUrl || "",
      isAvailable: product.isAvailable,
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    form.reset({
      name: "",
      description: "",
      price: 0,
      category: "main",
      imageUrl: "",
      isAvailable: true,
    });
    setIsDialogOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container px-4 py-8 pb-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display font-bold text-3xl">Menu Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" /> Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input {...form.register("name")} />
                {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea {...form.register("description")} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input type="number" step="0.01" {...form.register("price")} />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input {...form.register("category")} placeholder="e.g. snacks, drinks" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input {...form.register("imageUrl")} placeholder="https://..." />
              </div>
              <Button type="submit" className="w-full" disabled={createProduct.isPending || updateProduct.isPending}>
                {createProduct.isPending || updateProduct.isPending ? "Saving..." : "Save Product"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product: Product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            isAdmin 
            onEdit={handleEdit}
            onDelete={(id) => deleteProduct.mutate(id)}
          />
        ))}
      </div>
    </div>
  );
}
