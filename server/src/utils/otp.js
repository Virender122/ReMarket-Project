// Generate a random OTP
const generateOTP = (length = 6) => {
  return Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, '0');
};

// Get OTP expiry time (10 minutes from now)
const getOTPExpiry = () => {
  const now = new Date();
  return new Date(now.getTime() + 10 * 60 * 1000);
};

module.exports = {
  generateOTP,
  getOTPExpiry,
};
