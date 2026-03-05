require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'myuser',
  password: process.env.DB_PASSWORD || 'mypassword',
  database: process.env.DB_NAME || 'mydatabase',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'name, email, and password required' });

  // generate a simple 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000); // valid for 10 minutes

  try {
    const connection = await pool.getConnection();
    const query = `INSERT INTO users (name, email, password, otp, otp_expires) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await connection.execute(query, [name, email, password, otp, expires]);
    connection.release();

    // TODO: send otp to user email; for now log it
    console.log(`OTP for ${email}: ${otp}`);

    return res.status(201).json({ id: result.insertId, name, email, message: 'User created, please verify OTP sent to email' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'User already exists' });
    }
    return res.status(500).json({ error: String(err) });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  try {
    const connection = await pool.getConnection();
    const query = 'SELECT id, name, email, verified FROM users WHERE email = ? AND password = ?';
    const [users] = await connection.execute(query, [email, password]);
    connection.release();
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const user = users[0];
    if (!user.verified) {
      return res.status(403).json({ error: 'Email not verified' });
    }
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});
app.get('/api/users',async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [users] = await connection.execute('SELECT id, name, email FROM users');
    connection.release();
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

// verify otp
app.post('/api/verify-otp', async (req, res) => {
  const { email, otp } = req.body || {};
  if (!email || !otp) return res.status(400).json({ error: 'email and otp required' });

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT id, otp, otp_expires FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'User not found' });
    }
    const user = rows[0];
    if (!user.otp || user.otp !== otp) {
      connection.release();
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    const now = new Date();
    if (user.otp_expires && now > new Date(user.otp_expires)) {
      connection.release();
      return res.status(400).json({ error: 'OTP expired' });
    }
    await connection.execute('UPDATE users SET verified = TRUE, otp = NULL, otp_expires = NULL WHERE id = ?', [user.id]);
    connection.release();
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});
// Products: list
app.get('/api/products', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [products] = await connection.execute('SELECT * FROM products');
    connection.release();
    return res.json(products);
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

// Products: create
app.post('/api/products', async (req, res) => {
  const product = req.body || {};
  try {
    const connection = await pool.getConnection();
    const columns = Object.keys(product).join(', ');
    const placeholders = Object.keys(product).map(() => '?').join(', ');
    const values = Object.values(product);
    const query = `INSERT INTO products (${columns}) VALUES (${placeholders})`;
    const [result] = await connection.execute(query, values);
    connection.release();
    return res.status(201).json({ id: result.insertId, ...product });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

// Product by id
app.get('/api/products/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const connection = await pool.getConnection();
    const [products] = await connection.execute('SELECT * FROM products WHERE id = ?', [id]);
    connection.release();
    return res.json(products[0] || null);
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));
