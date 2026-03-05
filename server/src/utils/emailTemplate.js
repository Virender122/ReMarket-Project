const getOTPEmailTemplate = (name, otp, expiryMinutes = 10) => {
  return {
    subject: 'ReMarket Email Verification - Your OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to ReMarket, ${name}!</h2>
        <p style="color: #666; font-size: 16px;">
          To complete your account setup, please verify your email using the code below:
        </p>
        <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h1 style="color: #007bff; margin: 0; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p style="color: #666; font-size: 14px;">
          This code expires in ${expiryMinutes} minutes. Do not share this code with anyone.
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          If you didn't request this code, please ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">
          ReMarket &copy; 2026. All rights reserved.
        </p>
      </div>
    `,
  };
};

module.exports = {
  getOTPEmailTemplate,
};
