const AuthService = require('../services/authService');

class AuthController {
  static async signup(req, res) {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'name, email, and password are required',
      });
    }

    const result = await AuthService.signup(name, email, password);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(201).json(result);
  }

  static async verifyOTP(req, res) {
    const { email, otp } = req.body || {};

    if (!email || !otp) {
      return res.status(400).json({ error: 'email and otp are required' });
    }

    const result = await AuthService.verifyOTP(email, otp);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    return res.json(result);
  }

  static async login(req, res) {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        error: 'email and password are required',
      });
    }

    const result = await AuthService.login(email, password);

    if (!result.success) {
      return res
        .status(result.error === 'Invalid email or password' ? 401 : 403)
        .json({ error: result.error });
    }

    return res.json(result);
  }

  static async getall(req, res) {
    const result = await AuthService.getAllUsers();

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    return res.json(result.users);
  }

  static async updateProfile(req, res) {
    const { userId, name, email, bio } = req.body || {};

    if (!userId || !name || !email) {
      return res.status(400).json({
        error: 'userId, name, and email are required',
      });
    }

    const result = await AuthService.updateProfile(userId, name, email, bio);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    return res.json(result);
  }
}

module.exports = AuthController;
