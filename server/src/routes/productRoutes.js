const express = require('express');
const multer = require('multer');
const path = require('path');
const ProductController = require('../controllers/productController');

// configure multer storage to /uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${file.originalname}`;
    cb(null, unique);
  }
});

// restrict file types and size
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG and WebP images are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
});

const router = express.Router();

// router.get('/', ProductController.getAll);
// router.post('/', upload.array('images', 5), ProductController.create);
// router.put('/:id', upload.array('images', 5), ProductController.update);
// router.get('/seller/:sellerId', ProductController.getBySellerId);
// router.get('/:id', ProductController.getById);
// router.post('/wishlist/:productId', ProductController.toggleWishlist);
// router.get('/show-wishlist', ProductController.getWishlist);
// router.get('/MyProducts/:sellerId', ProductController.getByMYProductsSellerId);



router.get('/', ProductController.getAll);

router.post('/', upload.array('images', 5), ProductController.create);

router.put('/:id', upload.array('images', 5), ProductController.update);

router.post('/wishlist/:productId', ProductController.toggleWishlist);

router.get('/show-wishlist', ProductController.getWishlist);

router.get('/seller/:sellerId', ProductController.getBySellerId);

router.get('/MyProducts/:sellerId', ProductController.getByMYProductsSellerId);

// ALWAYS KEEP LAST
router.get('/:id', ProductController.getById);
module.exports = router;
