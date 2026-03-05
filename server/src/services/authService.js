const pool = require('../config/database');
const EmailService = require('./emailService');
const { generateOTP, getOTPExpiry } = require('../utils/otp');

class AuthService {
  static async signup(name, email, password) {
    const connection = await pool.getConnection();
    try {
      // Check if user exists
      const [existingUsers] = await connection.execute(
        'SELECT id FROM users WHERE email = ? OR name = ?',
        [email, name]
      );

      if (existingUsers.length > 0) {
        return { success: false, error: 'User already exists' };
      }

      // Generate OTP
      const otp = generateOTP();
      const otpExpires = getOTPExpiry();

      // Insert user with OTP
      const [result] = await connection.execute(
        `INSERT INTO users (name, email, password, verified, otp, otp_expires) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email, password, false, otp, otpExpires]
      );

      // Send OTP email
      await EmailService.sendOTPEmail(email, name, otp);

      return {
        success: true,
        userId: result.insertId,
        name,
        email,
        message: 'OTP sent to email. Please verify to continue.',
      };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      connection.release();
    }
  }

  static async verifyOTP(email, otp) {
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.execute(
        'SELECT id, otp, otp_expires FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return { success: false, error: 'User not found' };
      }

      const user = users[0];
      if (!user.otp || user.otp !== otp) {
        return { success: false, error: 'Invalid OTP' };
      }

      const now = new Date();
      if (user.otp_expires && now > new Date(user.otp_expires)) {
        return { success: false, error: 'OTP expired' };
      }

      // Update user as verified
      await connection.execute(
        'UPDATE users SET verified = TRUE, otp = NULL, otp_expires = NULL WHERE id = ?',
        [user.id]
      );

      return { success: true, message: 'Email verified successfully' };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      connection.release();
    }
  }

  static async login(email, password) {
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.execute(
        'SELECT id, name, email, verified FROM users WHERE email = ? AND password = ?',
        [email, password]
      );

      if (users.length === 0) {
        return { success: false, error: 'Invalid email or password' };
      }

      const user = users[0];
      if (!user.verified) {
        return {
          success: false,
          error: 'Email not verified. Please check your email for the OTP.',
        };
      }

      return { success: true, user };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      connection.release();
    }
  }

  static async getAllUsers() {
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.execute(
        'SELECT id, name, email FROM users'
      );
      return { success: true, users };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      connection.release();
    }
  }

  static async updateProfile(userId, name, email, bio) {
    const connection = await pool.getConnection();
    try {
      // Check if email is already used by another user
      const [existingEmails] = await connection.execute(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, userId]
      );

      if (existingEmails.length > 0) {
        return { success: false, error: 'Email already in use' };
      }

      // Update user profile
      const [result] = await connection.execute(
        'UPDATE users SET name = ?, email = ?, bio = ? WHERE id = ?',
        [name, email, bio || null, userId]
      );

      if (result.affectedRows === 0) {
        return { success: false, error: 'User not found' };
      }

      return { success: true, message: 'Profile updated successfully' };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      connection.release();
    }
  }
}

module.exports = AuthService;
