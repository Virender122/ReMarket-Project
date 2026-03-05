const pool = require('./src/config/database');

(async () => {
  const c = await pool.getConnection();
  try {
    console.log('1. Adding original_price...');
    await c.query('ALTER TABLE products ADD COLUMN original_price DECIMAL(10,2) NULL');
    console.log('✓ original_price added');

    console.log('2. Adding condition...');
    await c.query('ALTER TABLE products ADD COLUMN `condition` VARCHAR(50) NULL');
    console.log('✓ condition added');

    console.log('3. Adding location...');
    await c.query('ALTER TABLE products ADD COLUMN location VARCHAR(255) NULL');
    console.log('✓ location added');

    console.log('4. Converting description to LONGTEXT...');
    await c.query('ALTER TABLE products MODIFY COLUMN description LONGTEXT NULL');
    console.log('✓ description modified');

    console.log('5. Checking table structure...');
    const [cols] = await c.query('SHOW COLUMNS FROM products');
    console.log('Columns:', cols.map(col => col.Field).join(', '));
  } catch (e) {
    console.error('Migration error:', e.message);
  } finally {
    c.release();
    process.exit();
  }
})();
