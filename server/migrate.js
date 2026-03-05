const pool = require('./src/config/database');

(async () => {
  const c = await pool.getConnection();
  try {
    console.log('Altering products table...');
    await c.query('ALTER TABLE products CHANGE COLUMN name title VARCHAR(255) NOT NULL DEFAULT '''');
    // ensure price has default 0.00 in case it's missing
    await c.query('ALTER TABLE products MODIFY COLUMN price DECIMAL(10,2) NOT NULL DEFAULT 0.00');
    await c.query('ALTER TABLE products ADD COLUMN description LONGTEXT');
    await c.query('ALTER TABLE products ADD COLUMN original_price DECIMAL(10,2) NULL');
    await c.query('ALTER TABLE products ADD COLUMN `condition` VARCHAR(50) NULL');
    await c.query('ALTER TABLE products ADD COLUMN location VARCHAR(255) NULL');
    await c.query('ALTER TABLE products DROP COLUMN IF EXISTS image_url');
    console.log('Added columns and removed image_url');

    await c.query(`
      CREATE TABLE IF NOT EXISTS product_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        image_data LONGTEXT NOT NULL,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);
    console.log('Ensured product_images table exists');
  } catch (e) {
    console.error('migration error', e);
  } finally {
    c.release();
    process.exit();
  }
})();