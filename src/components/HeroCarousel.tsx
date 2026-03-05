// import { motion } from "framer-motion";
// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import ProductCard from "./ProductCard";
// interface HeroCarouselProps {
//   products: any[];
//   height?: string; // tailwind height class
//   visible?: number;
// }

// const HeroCarousel = ({ products, height = 'h-[55vh]', visible = 3 }: HeroCarouselProps) => {
//   const [index, setIndex] = useState(0);
//   const navigate = useNavigate();
//   const intervalRef = useRef<number | null>(null);

//   useEffect(() => {
//     if (!products || products.length === 0) return;
//     if (intervalRef.current) window.clearInterval(intervalRef.current);
//     intervalRef.current = window.setInterval(() => {
//       setIndex((i) => (i + 1) % products.length);
//     }, 3000);
//     return () => {
//       if (intervalRef.current) window.clearInterval(intervalRef.current);
//     };
//   }, [products]);

//   if (!products || products.length === 0) {
//     return (
//       <div className={`w-full ${height} flex items-center justify-center bg-gradient-to-t from-slate-50 to-white rounded-2xl`}>
//         <p className="text-muted-foreground">No products</p>
//       </div>
//     );
//   }

//   // helper
//   const API_BASE = import.meta.env.VITE_API_URL || '';
//   const resolveUrl = (p: string) => {
//     if (!p) return '';
//     if (p.startsWith('http') || p.startsWith('//')) return p;
//     return `${API_BASE}${p}`;
//   };

//   // translate percent per step based on visible count
//   const step = 100 / visible; // percent

//   return (
//     <div className={`w-full ${height} relative rounded-2xl overflow-hidden border border-border bg-white`}>
//       <div
//         className="absolute inset-0 transition-transform duration-700 ease-out"
//         style={{ transform: `translateY(-${(index * step) % (products.length * step)}%)` }}
//       >
//         <div className="flex flex-col">
//           {products.concat(products).map((p, i) => {
//             // render twice for smooth looping
//             const img = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '';

//             return (
//               <div
//                 key={`${p.id}-${i}`}
//                 className={`flex-0 w-full`} // height controlled by container children
//                 style={{ height: `calc(100% / ${visible})` }}
//               >
//                 <div className="w-full h-full relative cursor-pointer" onClick={() => navigate(`/product/${p.id}`)}>
//                    {img ? (
//                     <img src={resolveUrl(img)} alt={p.title || 'Product'} className="w-full h-full object-cover" />
//                   ) : (
//                     <div className="w-full h-full bg-slate-50 flex items-center justify-center text-muted-foreground">No Image</div>
//                   )} 
                 

//                   <div className="absolute left-3 bottom-3 bg-white/90 backdrop-blur-sm rounded-md px-3 py-1">
//                     <p className="text-sm font-semibold">{p.title || 'Untitled'}</p>
//                     <p className="text-xs text-muted-foreground">${p.price ?? '0.00'} · {p.location || 'Unknown'}</p>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HeroCarousel;


import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

interface HeroCarouselProps {
  products: any[];
  height?: string;
}

const HeroCarousel = ({ products, height = "h-[55vh]" }: HeroCarouselProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!products || products.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % products.length);
    }, 5000); // ⬅️ slower auto change (5 seconds)

    return () => clearInterval(interval);
  }, [products]);

  if (!products || products.length === 0) {
    return (
      <div className={`w-full ${height} flex items-center justify-center bg-white rounded-2xl`}>
        No Products
      </div>
    );
  }

  return (
    <div className={`w-full ${height} relative overflow-hidden rounded-2xl`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={products[index].id}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ 
            duration: 1.5,          // ⬅️ slower animation
            ease: "easeInOut"       // ⬅️ smoother easing
          }}
          className="absolute w-full"
        >
          <ProductCard product={products[index]} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HeroCarousel;