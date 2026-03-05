import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Package, ShoppingBagIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

interface MyProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  original_price: number | null;
  category: string;
  condition: string;
  location: string;
  seller_id: number;
  seller_name?: string;
  images: string[];
}

export function MyProducts() {
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4001";

  const [products, setProducts] = useState<MyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);
const fetchProducts = async () => {
  try {

    const userData  = localStorage.getItem("user");
//   console.log("Seller ID from localStorage:", sellerId);
  const user = JSON.parse(userData);
    const sellerId = user.id;
    console.log("Seller ID:", sellerId);
    const res = await fetch(`${API_BASE}/api/products/MyProducts/${sellerId}`);

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await res.json();
    setProducts(data);

  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </Link>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <ShoppingBagIcon className="h-8 w-8 text-orange-500" />
              My Products
            </h1>
            <p className="text-muted-foreground mt-1">
              {products.length} product{products.length !== 1 ? "s" : ""}
            </p>
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <p className="text-muted-foreground">Loading your products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              You haven't added any products
            </h2>
            <Link to="/sell">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Add Product
              </Button>
            </Link>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
