const transporter = require('../config/mailer');
const { getOTPEmailTemplate } = require('../utils/emailTemplate');

class EmailService {
  static async sendOTPEmail(email, name, otp) {
    try {
      const template = getOTPEmailTemplate(name, otp);
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@remarket.com',
        to: email,
        subject: template.subject,
        html: template.html,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('OTP email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = EmailService;
