const pool = require('../src/config/database');

(async () => {
  const c = await pool.getConnection();
  try {
    console.log('Finding products with missing/invalid fields...');
    const [rows] = await c.query(`
      SELECT id, title, description, price, seller_id, created_at
      FROM products
      WHERE title IS NULL OR title = ''
         OR description IS NULL OR description = ''
         OR seller_id IS NULL
         OR price IS NULL OR price = 0
      ORDER BY created_at DESC
      LIMIT 100
    `);

    if (!rows.length) {
      console.log('No problematic products found.');
      return;
    }

    console.log(`Found ${rows.length} product(s) with issues:`);
    rows.forEach(r => {
      console.log(`- id=${r.id} title=${r.title} description=${r.description ? '[ok]' : 'NULL/empty'} price=${r.price} seller_id=${r.seller_id}`);
    });
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    c.release();
    process.exit();
  }
})();
