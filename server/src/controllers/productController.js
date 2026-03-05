const ProductService = require('../services/productService');
const path = require('path');

class ProductController {
  static async getAll(req, res) {
    const result = await ProductService.getAll();

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    return res.json(result.products);
  }

 static async toggleWishlist(req, res) {
  const { productId } = req.params;
  let userId = req.user && req.user.id;
  if (!userId && req.headers.authorization) {
    const token = String(req.headers.authorization).replace(/^Bearer\s+/i, '');
    userId = parseInt(token) || null;
  }
  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const result = await ProductService.toggleWishlist(userId, productId);

  if (!result.success) {
    return res.status(500).json({ error: result.error });
  }

  return res.json(result);
}
//   static async getWishlist(req, res) {
//     const userId = req.user.id; // assuming user ID is available in req.user

//     const result = await ProductService.getWishlist(userId);

//     if (!result.success) {
//       return res.status(500).json({ error: result.error });
//     }

//     return res.json(result.products);
//   }



static async getWishlist(req, res) {
  try {
    let userId = req.user && req.user.id;

    if (!userId && req.headers.authorization) {
      const token = String(req.headers.authorization).replace(/^Bearer\s+/i, '');
      userId = parseInt(token) || null;
    }

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const result = await ProductService.getWishlist(userId);

    if (!result.success) {
      console.error("Wishlist Service Error:", result.error);
      return res.status(500).json({ error: result.error });
    }

    return res.json(result.products);

  } catch (error) {
    console.error("Wishlist Controller Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
  static async getById(req, res) {
    const { id } = req.params;

    const result = await ProductService.getById(id);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    return res.json(result.product);
  }

  static async getBySellerId(req, res) {
    const { sellerId } = req.params;

    const result = await ProductService.getBySellerId(sellerId);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    return res.json(result.products);
  }

  static async create(req, res) {
    console.log('CREATE payload body:', req.body);
    console.log('CREATE files:', req.files);
    const files = req.files || [];

    // normalize and parse incoming fields (FormData provides strings)
    const {
      title = '',
      description = '',
      price: priceRaw,
      original_price: originalPriceRaw,
      category = '',
      condition = '',
      location = '',
      seller_id: sellerIdRaw,
    } = req.body || {};

    const price = typeof priceRaw === 'string' ? parseFloat(priceRaw) : Number(priceRaw);
    const original_price = originalPriceRaw ? (typeof originalPriceRaw === 'string' ? parseFloat(originalPriceRaw) : Number(originalPriceRaw)) : null;
    const seller_id = sellerIdRaw ? parseInt(sellerIdRaw) : NaN;

    // Validate required fields more strictly
    if (!title || !title.toString().trim() || !description || !description.toString().trim() || isNaN(price) || !category || !condition || !location || isNaN(seller_id)) {
      return res.status(400).json({
        error: 'Missing or invalid required fields: title, description, price, category, condition, location, seller_id',
      });
    }

    if (files.length < 2 || files.length > 5) {
      return res.status(400).json({
        error: 'Please upload between 2 and 5 images',
      });
    }

    const paths = files.map((f) => `/uploads/${path.basename(f.path)}`);

    const productData = {
      title: title.toString().trim(),
      description: description.toString().trim(),
      price,
      original_price,
      category: category.toString(),
      condition: condition.toString(),
      location: location.toString(),
      seller_id,
    };

    const result = await ProductService.create(productData, paths);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(201).json(result);
  }

  static async update(req, res) {
    console.log('UPDATE payload body:', req.body);
    console.log('UPDATE files:', req.files);
    const { id } = req.params;
    const files = req.files || [];

    const {
      title = '',
      description = '',
      price: priceRaw,
      original_price: originalPriceRaw,
      category = '',
      condition = '',
      location = '',
      existingImages,
    } = req.body || {};

    const price = typeof priceRaw === 'string' ? parseFloat(priceRaw) : Number(priceRaw);
    const original_price = originalPriceRaw ? (typeof originalPriceRaw === 'string' ? parseFloat(originalPriceRaw) : Number(originalPriceRaw)) : null;

    if (!title || !title.toString().trim() || !description || !description.toString().trim() || isNaN(price) || !category || !condition || !location) {
      return res.status(400).json({ error: 'Missing or invalid required fields for update' });
    }

    let existing = [];
    try {
      existing = existingImages ? JSON.parse(existingImages) : [];
    } catch (e) {
      existing = [];
    }

    const newPaths = files.map((f) => `/uploads/${path.basename(f.path)}`);
    const allImages = [...existing, ...newPaths];

    if (allImages.length < 2 || allImages.length > 5) {
      return res.status(400).json({ error: 'Please upload between 2 and 5 images' });
    }

    const productData = {
      title: title.toString().trim(),
      description: description.toString().trim(),
      price,
      original_price,
      category: category.toString(),
      condition: condition.toString(),
      location: location.toString(),
    };

    const result = await ProductService.update(parseInt(id), productData, allImages);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    return res.json(result);
  }
  static async getByMYProductsSellerId(req, res) {
    const { sellerId } = req.params;

    const result = await ProductService.getByMYProductsSellerId(sellerId);
    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    return res.json(result.products);
  }
}

module.exports = ProductController;
