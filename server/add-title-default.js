const pool = require('./src/config/database');

(async () => {
  const c = await pool.getConnection();
  try {
    console.log('Adding default value to products.title');
    await c.query("ALTER TABLE products MODIFY COLUMN title VARCHAR(255) NOT NULL DEFAULT ''");
    console.log('✅ Title column now has default empty string');
  } catch (e) {
    console.error('Migration error:', e.message);
  } finally {
    c.release();
    process.exit();
  }
})();
