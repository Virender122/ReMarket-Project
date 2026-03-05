const express = require('express');
const AuthController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', AuthController.signup);
router.post('/verify-otp', AuthController.verifyOTP);
router.post('/login', AuthController.login);
router.get('/users', AuthController.getall);
router.put('/update-profile', AuthController.updateProfile);

module.exports = router;
