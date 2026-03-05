const pool = require("../config/database");

class ProductService {
  static async getAll() {
    const connection = await pool.getConnection();
    try {
      // Increase GROUP_CONCAT limit (100MB) to accommodate many image paths or other large concatenated data
      await connection.execute("SET SESSION group_concat_max_len = 104857600");

      const [products] = await connection.execute(`
        SELECT p.*, u.name as seller_name, 
               GROUP_CONCAT(pi.image_data ORDER BY pi.display_order) as images
        FROM products p
        LEFT JOIN users u ON p.seller_id = u.id
        LEFT JOIN product_images pi ON p.id = pi.product_id
        GROUP BY p.id
        ORDER BY p.created_at DESC
      `);

      // Parse images string into array for each product
      products.forEach((product) => {
        if (product.images) {
          product.images = product.images.split(",");
        } else {
          product.images = [];
        }
      });

      return { success: true, products };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      connection.release();
    }
  }

  static async getById(id) {
    const connection = await pool.getConnection();
    try {
      // Increase GROUP_CONCAT limit (100MB) to accommodate many image paths or other large concatenated data
      await connection.execute("SET SESSION group_concat_max_len = 104857600");

      const [products] = await connection.execute(
        `
        SELECT p.*, u.name as seller_name,
               GROUP_CONCAT(pi.image_data ORDER BY pi.display_order) as images
        FROM products p
        LEFT JOIN users u ON p.seller_id = u.id
        LEFT JOIN product_images pi ON p.id = pi.product_id
        WHERE p.id = ?
        GROUP BY p.id
      `,
        [id],
      );

      if (products.length === 0) {
        return { success: false, error: "Product not found" };
      }

      const product = products[0];
      if (product.images) {
        product.images = product.images.split(",");
      } else {
        product.images = [];
      }

      return { success: true, product };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      connection.release();
    }
  }

  static async create(productData, images) {
    const connection = await pool.getConnection();
    try {
      // Validate images
      if (!images || images.length < 2 || images.length > 5) {
        return {
          success: false,
          error: "Please upload between 2 and 5 images",
        };
      }

      // Insert product
      const {
        title,
        description,
        price,
        original_price,
        category,
        condition,
        location,
        seller_id,
      } = productData;
      const [result] = await connection.execute(
        "INSERT INTO products (title, description, price, original_price, category, `condition`, location, seller_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          title,
          description,
          price,
          original_price || null,
          category,
          condition,
          location,
          seller_id,
        ],
      );

      const productId = result.insertId;

      // Insert images
      for (let i = 0; i < images.length; i++) {
        await connection.execute(
          `INSERT INTO product_images (product_id, image_data, display_order) VALUES (?, ?, ?)`,
          [productId, images[i], i],
        );
      }

      return {
        success: true,
        productId,
        message: "Product created successfully",
      };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      connection.release();
    }
  }

  static async getBySellerId(sellerId) {
    const connection = await pool.getConnection();
    try {
      // Increase GROUP_CONCAT limit (100MB) to accommodate many image paths or other large concatenated data
      await connection.execute("SET SESSION group_concat_max_len = 104857600");

      const [products] = await connection.execute(
        `
        SELECT p.*, u.name as seller_name,
               GROUP_CONCAT(pi.image_data ORDER BY pi.display_order) as images
        FROM products p
        LEFT JOIN users u ON p.seller_id = u.id
        LEFT JOIN product_images pi ON p.id = pi.product_id
        WHERE p.seller_id = ?
        GROUP BY p.id
        ORDER BY p.created_at DESC
      `,
        [sellerId],
      );

      // Parse images string into array for each product
      products.forEach((product) => {
        if (product.images) {
          product.images = product.images.split(",");
        } else {
          product.images = [];
        }
      });

      return { success: true, products };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      connection.release();
    }
  }

  static async update(productId, productData, images) {
    const connection = await pool.getConnection();
    try {
      // validate images count
      if (!images || images.length < 2 || images.length > 5) {
        return {
          success: false,
          error: "Please upload between 2 and 5 images",
        };
      }

      // update product fields
      const {
        title,
        description,
        price,
        original_price,
        category,
        condition,
        location,
      } = productData;
      await connection.execute(
        "UPDATE products SET title = ?, description = ?, price = ?, original_price = ?, category = ?, `condition` = ?, location = ? WHERE id = ?",
        [
          title,
          description,
          price,
          original_price || null,
          category,
          condition,
          location,
          productId,
        ],
      );

      // remove old images
      await connection.execute(
        `DELETE FROM product_images WHERE product_id = ?`,
        [productId],
      );

      // insert new images
      for (let i = 0; i < images.length; i++) {
        await connection.execute(
          `INSERT INTO product_images (product_id, image_data, display_order) VALUES (?, ?, ?)`,
          [productId, images[i], i],
        );
      }

      return { success: true, message: "Product updated successfully" };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      connection.release();
    }
  }
  static async toggleWishlist(userId, productId) {
    const connection = await pool.getConnection();

    try {
      const [existing] = await connection.execute(
        "SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?",
        [userId, productId],
      );

      if (existing.length > 0) {
        await connection.execute(
          "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?",
          [userId, productId],
        );

        return { success: true, action: "removed" };
      } else {
        await connection.execute(
          "INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)",
          [userId, productId],
        );

        return { success: true, action: "added" };
      }
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      connection.release();
    }
  }

  static async getWishlist(userId) {
    const connection = await pool.getConnection();
    try {
      // Increase GROUP_CONCAT limit (100MB) to accommodate many image paths or other large concatenated data
      await connection.execute("SET SESSION group_concat_max_len = 104857600");

      const [products] = await connection.execute(
        `
  SELECT p.*, u.name as seller_name,
         GROUP_CONCAT(pi.image_data ORDER BY pi.display_order) as images
  FROM wishlist w
  JOIN products p ON w.product_id = p.id
  LEFT JOIN users u ON p.seller_id = u.id
  LEFT JOIN product_images pi ON p.id = pi.product_id
  WHERE w.user_id = ?
  GROUP BY p.id
  ORDER BY MAX(w.created_at) DESC
`,
        [userId],
      );

      // Parse images string into array for each product
      products.forEach((product) => {
        if (product.images) {
          product.images = product.images.split(",");
        } else {
          product.images = [];
        }
      });

      return { success: true, products };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      connection.release();
    }
  }
  static async getByMYProductsSellerId(userId) {
    const connection = await pool.getConnection();
    try {
      // Increase GROUP_CONCAT limit (100MB) to accommodate many image paths or other large concatenated data
      await connection.execute("SET SESSION group_concat_max_len = 104857600");

      const [products] = await connection.execute(
        `
        SELECT p.*, u.name as seller_name,
               GROUP_CONCAT(pi.image_data ORDER BY pi.display_order) as images
        FROM products p
        LEFT JOIN users u ON p.seller_id = u.id
        LEFT JOIN product_images pi ON p.id = pi.product_id
        WHERE p.seller_id = ?
        GROUP BY p.id
        ORDER BY p.created_at DESC
      `,
        [userId],
      );

      // Parse images string into array for each product
      products.forEach((product) => {
        if (product.images) {
          product.images = product.images.split(",");
        } else {
          product.images = [];
        }
      });
      return { success: true, products };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      connection.release();
    }
  }
}

module.exports = ProductService;
