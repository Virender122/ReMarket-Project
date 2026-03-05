import { products as mockProducts } from "@/lib/mock-data";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ShieldCheck, MessageCircle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import HeroCarousel from "@/components/HeroCarousel";
import { Suspense } from "react";
import { Link } from "react-router-dom";

const categories = ["All", "Electronics", "Furniture", "Fashion", "Collectibles", "Books", "Sports"];

const Index = () => {
  const [products, setProducts] = useState<any[]>(mockProducts);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4001";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (err) {
        console.log("Failed to fetch from API, using mock data:", err);
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [API_BASE]);
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-[0.07]" />
          <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <Badge className="mb-4 gradient-primary border-0 text-primary-foreground px-3 py-1 text-sm">
                <Sparkles className="mr-1 h-3 w-3" /> Trusted Marketplace
              </Badge>
              <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground leading-tight mb-4">
                Buy & Sell
                <span className="text-primary"> Pre-Loved</span>
                <br />Treasures
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Discover amazing deals on second-hand products. Sell what you don't need, buy what you love.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/sell">
                  <Button size="lg" className="gradient-primary border-0 text-primary-foreground gap-2 shadow-glow">
                    Start Selling <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="gap-2">
                  Browse Products
                </Button>
              </div>
            </motion.div>

            <div className="flex justify-center">
              <div className="w-full md:w-1/2">
                <Suspense fallback={<div className="w-full h-64 bg-muted rounded-2xl" />}>
                  <HeroCarousel products={products} height="h-[55vh]" />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: TrendingUp, label: "Products Sold", value: "8,900+" },
              { icon: ShieldCheck, label: "Verified Sellers", value: "2,400+" },
              { icon: MessageCircle, label: "Active Chats", value: "1,200+" },
              { icon: Sparkles, label: "Happy Buyers", value: "12,000+" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
                className="text-center"
              >
                <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="font-heading text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat, i) => (
            <Button
              key={cat}
              variant={i === 0 ? "default" : "outline"}
              size="sm"
              className={i === 0 ? "gradient-primary border-0 text-primary-foreground" : ""}
            >
              {cat}
            </Button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold text-foreground">Latest Listings</h2>
          <Button variant="ghost" className="gap-1 text-primary">
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length > 0 ? (
              products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))
            ) : (
              <p className="text-muted-foreground">No products available</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
