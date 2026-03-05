
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { ArrowLeft, Heart, ShoppingCartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface WishlistProduct {
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

const WishlistPage = () => {

  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE =
    import.meta.env.VITE_API_URL || "http://localhost:4001";

  useEffect(() => {

    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${API_BASE}/api/products/show-wishlist`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        setProducts(data || []);
      } catch (err) {
        console.log("wishlist error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  return (
    <div className="min-h-screen bg-background">

      <Navbar />

      <div className="container mx-auto px-4 py-8">

        <div className="flex items-center gap-4 mb-8">

          <Link to="/">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>

          <h1 className="text-3xl font-bold flex items-center gap-2">
            {/* <Heart className="text-red-500 fill-red-500" /> */}
            <ShoppingCartIcon className="h-8 w-8" />
            Wishlist
          </h1>

        </div>

        {loading ? (
          <p>Loading wishlist...</p>
        ) : products.length === 0 ? (

          <div className="text-center py-20">

            <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />

            <h2 className="text-xl font-semibold">
              Your wishlist is empty
            </h2>

            <Link to="/">
              <Button className="mt-4">
                Browse Products
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
                liked={true}
              />
            ))}

          </motion.div>

        )}

      </div>
    </div>
  );
};

export default WishlistPage;