import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Camera, DollarSign, Tag, MapPin, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
interface User {
  id: number;
  name: string;
  email: string;
}

// represent either an existing URL or a newly selected file
interface ImageItem {
  url: string;        // either existing path or objectURL
  file?: File;        // present for new uploads
}

const SellProduct = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4001";

  // load user and product if editing
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      toast({ title: "Not logged in", description: "Please log in to sell products" });
      navigate('/login');
      return;
    }
    const user = JSON.parse(stored);
    setCurrentUser(user);

    if (id) {
      // fetch existing product details
      (async () => {
        try {
          const res = await fetch(`${API_BASE}/api/products/${id}`);
          if (!res.ok) throw new Error('Failed to load product');
          const data = await res.json();
          if (!data) throw new Error('Product not found');
          if (data.seller_id !== user.id) {
            toast({ title: "Unauthorized", description: "You can only edit your own listings" });
            navigate('/');
            return;
          }
              setTitle(data.title);
          setDescription(data.description);
          setPrice(data.price.toString());
          setOriginalPrice(data.original_price ? data.original_price.toString() : '');
          setCategory(data.category);
          setCondition(data.condition);
          setLocation(data.location);
          // existing images are URLs returned from server
          setImages((data.images || []).map((url: string) => ({ url })));
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          toast({ title: "Error", description: error.message || "Failed to load product" });
          navigate('/');
        }
      })();
    }
  }, [navigate, toast, id, API_BASE]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 5) {
      toast({ title: "Too many images", description: "Maximum 5 images allowed" });
      return;
    }

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({ title: "Invalid file", description: `${file.name} is not an image` });
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({ title: "File too large", description: `${file.name} exceeds 5MB limit` });
          continue;
        }

        const objectUrl = URL.createObjectURL(file);
        setImages((prev) => [...prev, { url: objectUrl, file }]);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      toast({ title: "Error", description: error.message || "Failed to upload image" });
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const toRemove = prev[index];
      if (toRemove && toRemove.file) {
        // revoke object URL for new uploads
        URL.revokeObjectURL(toRemove.url);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  // clean up any object URLs when component unmounts or images change
  useEffect(() => {
    return () => {
      images.forEach((item) => {
        if (item.file) {
          URL.revokeObjectURL(item.url);
        }
      });
    };
  }, [images]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({ title: "Error", description: "User not logged in" });
      return;
    }

    if (!title || !description || !price || !category || !condition || !location) {
      toast({ title: "Missing fields", description: "Please fill in all required fields" });
      return;
    }

    if (images.length < 2) {
      toast({ title: "Not enough images", description: "Please upload at least 2 images" });
      return;
    }

    if (images.length > 5) {
      toast({ title: "Too many images", description: "Maximum 5 images allowed" });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', parseFloat(price).toString());
      if (originalPrice) formData.append('original_price', parseFloat(originalPrice).toString());
      formData.append('category', category);
      formData.append('condition', condition);
      formData.append('location', location);

      if (id) {
        // editing mode: include existing image URLs so backend can merge
        const existing = images
          .filter((item) => !item.file)
          .map((item) => item.url);
        formData.append('existingImages', JSON.stringify(existing));
      } else {
        formData.append('seller_id', currentUser.id.toString());
      }

      // append new files
      images.forEach((item) => {
        if (item.file) {
          formData.append('images', item.file);
        }
      });

      let url = `${API_BASE}/api/products`;
      let method: "POST" | "PUT" = "POST";

      if (id) {
        method = "PUT";
        url = `${API_BASE}/api/products/${id}`;
      }

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      if (id) {
        toast({ title: "Listing updated!", description: "Your product information has been saved." });
      } else {
        toast({ title: "Listing created!", description: "Your product is now live on ReMarket." });
      }
      navigate("/");
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      toast({ title: "Error", description: error || "Operation failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <Tag className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">{id ? 'Edit Listing' : 'List Your Product'}</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-semibold">Product Images</Label>
                  <span className={`text-sm ${images.length >= 2 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                    {images.length}/5 images
                  </span>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition">
                  <input
                    type="file"
                    id="images"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={images.length >= 5}
                  />
                  <label htmlFor="images" className="cursor-pointer">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-400">PNG, JPG, WebP up to 5MB each</p>
                    <p className="text-sm text-blue-600 font-medium mt-2">Add 2-5 images (minimum 2 required)</p>
                  </label>
                </div>

                {/* Image Previews */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative group"
                      >
                        <img
                          src={item.url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <span className="absolute top-1 right-1 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                          {index + 1}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="font-semibold">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., iPhone 14 Pro Max"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="font-semibold">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product in detail..."
                  rows={4}
                  required
                />
              </div>

              {/* Price Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="font-semibold">Price *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="pl-8"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="originalPrice" className="font-semibold">Original Price (Optional)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      placeholder="0.00"
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>

              {/* Category, Condition, Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="font-semibold">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Fashion">Fashion</SelectItem>
                      <SelectItem value="Books">Books</SelectItem>
                      <SelectItem value="Home">Home & Garden</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Toys">Toys & Games</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition" className="font-semibold">Condition *</Label>
                  <Select value={condition} onValueChange={setCondition}>
                    <SelectTrigger id="condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Like New">Like New</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="font-semibold">Location *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, State"
                      className="pl-8"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || images.length < 2}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-bold rounded-lg transition"
              >
                {loading ? (id ? "Updating..." : "Creating...") : (id ? "Update Listing" : "Create Listing")}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SellProduct;