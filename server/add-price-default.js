const pool = require('./src/config/database');

(async () => {
  const c = await pool.getConnection();
  try {
    console.log('Adding default value to products.price');
    await c.query("ALTER TABLE products MODIFY COLUMN price DECIMAL(10,2) NOT NULL DEFAULT 0.00");
    console.log('✅ Price column now has default 0.00');
  } catch (e) {
    console.error('Migration error:', e.message);
  } finally {
    c.release();
    process.exit();
  }
})();
