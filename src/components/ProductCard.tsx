




import { Badge } from "@/components/ui/badge";
import { MapPin, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface ApiProductCard {
  id: number | string;
  title: string;
  price: number;
  original_price?: number | null;
  location?: string;
  condition?: string;
  images?: string[];
}

interface ProductCardProps {
  product: ApiProductCard;
  index?: number;
  liked?: boolean;
}

const ProductCard = ({
  product,
  index = 0,
  liked: initialLiked = false,
}: ProductCardProps) => {

  const [liked, setLiked] = useState(initialLiked);

  const API_BASE =
    import.meta.env.VITE_API_URL || "http://localhost:4001";

  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

  const discount = product.original_price
    ? Math.round(
        ((product.original_price - product.price) /
          product.original_price) *
          100
      )
    : 0;

  const resolveUrl = (p: string) => {
    if (!p) return "";
    if (p.startsWith("http")) return p;
    return `${API_BASE}${p}`;
  };

  const toggleWishlist = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_BASE}/api/products/wishlist/${product.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.action === "added") {
        setLiked(true);
      } else {
        setLiked(false);
      }
    } catch (err) {
      console.log("wishlist error", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="overflow-hidden rounded-xl border bg-card shadow-card hover:-translate-y-1 transition">

          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={
                product.images && product.images.length > 0
                  ? resolveUrl(product.images[0])
                  : ""
              }
              alt={product.title}
              className="h-full w-full object-cover"
            />

            {/* HEART BUTTON */}
            <button
              onClick={toggleWishlist}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm"
            >
              <Heart
                className={`h-4 w-4 transition ${
                  liked
                    ? "fill-red-500 text-red-500"
                    : "text-gray-500"
                }`}
              />
            </button>

            {discount > 0 && (
              <Badge className="absolute left-3 top-3 bg-orange-500 text-white">
                {discount}% OFF
              </Badge>
            )}

            <Badge
              variant="secondary"
              className="absolute bottom-3 left-3 bg-white/80"
            >
              {product.condition}
            </Badge>
          </div>

          <div className="p-4">
            <h3 className="font-semibold line-clamp-1">
              {product.title}
            </h3>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-lg font-bold text-primary">
                ₹{product.price}
              </span>

              {product.original_price && (
                <span className="text-sm line-through text-gray-500">
                  ₹{product.original_price}
                </span>
              )}
            </div>

            <div className="flex items-center text-xs text-gray-500 mt-2 gap-1">
              <MapPin className="h-3 w-3" />
              {product.location}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;