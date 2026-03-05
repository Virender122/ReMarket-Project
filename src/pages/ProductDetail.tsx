import Navbar from "@/components/Navbar";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Share2, MapPin, Star, MessageCircle, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface ApiProduct {
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

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // hooks moved above any conditional returns
  const [mainImage, setMainImage] = useState<string>('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4001'}/api/products/${id}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        setProduct(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setMainImage(product.images[0]);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground">Product not found</h1>
          <Link to="/"><Button className="mt-4">Back to Home</Button></Link>
        </div>
      </div>
    );
  }

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const API_BASE = import.meta.env.VITE_API_URL || '';
  const resolveUrl = (p: string) => {
    if (!p) return '';
    if (p.startsWith('http') || p.startsWith('//')) return p;
    return `${API_BASE}${p}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to listings
            </Button>
          </Link>
          {currentUser && product.seller_id === currentUser.id && (
            <Link to={`/sell/${product.id}`}>
              <Button size="sm" className="gap-2">
                Edit Listing
              </Button>
            </Link>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative overflow-hidden rounded-2xl bg-muted h-fit"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={mainImage}
                src={mainImage ? resolveUrl(mainImage) : ''}
                alt={product.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full aspect-square object-cover rounded-2xl"
              />
            </AnimatePresence>
            {discount > 0 && (
              <Badge className="absolute top-4 left-4 bg-orange-500 hover:bg-orange-600 border-0 text-white text-sm px-3 py-1 rounded-full font-semibold">
                {discount}% OFF
              </Badge>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Badge variant="outline" className="mb-3">{product.category}</Badge>

            {/* thumbnail gallery */}
            {product.images && product.images.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMainImage(img)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      mainImage === img ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <img
                      src={resolveUrl(img)}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">{product.title}</h1>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold text-primary">${product.price}</span>
              {product.original_price && (
                <span className="text-lg text-muted-foreground line-through">${product.original_price}</span>
              )}
            </div>

            <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{product.location}</span>
              <span>Posted {product.postedAt}</span>
            </div>

            <Badge variant="secondary" className="mb-6">Condition: {product.condition}</Badge>

            <p className="text-foreground/80 mb-8 leading-relaxed">{product.description}</p>

            {/* Seller - Orange Button Style */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="mb-6"
            >
              <Link to="#"
                className="flex items-center gap-3 p-4 rounded-xl bg-orange-100 hover:bg-orange-200 border-2 border-orange-300 hover:border-orange-400 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-orange-900 group-hover:text-orange-950 text-lg">{product.seller_name || 'Seller'}</span>
                    <ShieldCheck className="h-4 w-4 text-orange-600" />
                  </div>
                  <span className="text-xs text-orange-700 group-hover:text-orange-800">Verified Seller</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-300 group-hover:bg-orange-400 flex items-center justify-center text-orange-900 font-bold transition-colors">
                  {(product.seller_name || 'S')[0]}
                </div>
              </Link>
            </motion.div>

            <div className="flex gap-3">
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link to="/chat" className="block w-full">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 border-0 text-white gap-2 shadow-lg transition-all" size="lg">
                    <MessageCircle className="h-4 w-4" /> Contact Seller
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="lg" className="border-2 hover:bg-red-50"><Heart className="h-4 w-4 text-red-500" /></Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="lg" className="border-2 hover:bg-blue-50"><Share2 className="h-4 w-4 text-blue-500" /></Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
