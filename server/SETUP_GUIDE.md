## Backend Email Verification Setup Guide

### Project Structure

The backend has been refactored with a clean architecture:

```
server/
├── src/
│   ├── config/
│   │   ├── database.js          # MySQL pool configuration
│   │   └── mailer.js            # Nodemailer configuration
│   ├── controllers/
│   │   ├── authController.js    # Auth route handlers
│   │   └── productController.js # Product route handlers
│   ├── services/
│   │   ├── authService.js       # Auth business logic
│   │   ├── emailService.js      # Email sending logic
│   │   └── productService.js    # Product business logic
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   └── productRoutes.js     # Product endpoints
│   ├── utils/
│   │   ├── otp.js               # OTP generation utilities
│   │   └── emailTemplate.js     # Email HTML templates
│   └── index.js                 # Main application entry
├── .env                         # Environment variables
├── init.sql                     # Database schema
├── package.json
└── README.md
```

### Email Configuration (Gmail)

1. **Generate App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the generated password

2. **Update .env file:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password-from-step-1
   SMTP_FROM=noreply@remarket.com
   ```

3. **For Other Email Providers:**
   - Gmail: `smtp.gmail.com:587`
   - Outlook: `smtp-mail.outlook.com:587`
   - SendGrid: `smtp.sendgrid.net:587`
   - Mailtrap (for testing): `smtp.mailtrap.io:2525`

### How It Works

#### Signup Flow
1. User submits signup form with `name`, `email`, `password`
2. `AuthController.signup()` calls `AuthService.signup()`
3. Service generates 6-digit OTP (valid for 10 minutes)
4. Service inserts user with OTP into database
5. `EmailService.sendOTPEmail()` sends OTP to user's email
6. Frontend shows OTP verification form

#### Verification Flow
1. User enters OTP from email
2. `AuthController.verifyOTP()` calls `AuthService.verifyOTP()`
3. Service validates OTP and expiry time
4. If valid: marks user as verified and clears OTP
5. User can now log in

#### Login Flow
1. User provides `email` and `password`
2. Service checks if user exists and password matches
3. If user not verified: returns error "Email not verified"
4. If user verified: returns user details for frontend storage

### Testing

#### Without Email Setup (Development)
- Check server console for OTP (logged during signup)
- Use the logged OTP to verify account

#### With Email Setup
- OTP automatically sent to user's email
- User receives email and enters OTP

### Database Changes

The users table now includes:
- `verified` (BOOLEAN) - tracks if email is verified
- `otp` (VARCHAR) - stores 6-digit OTP
- `otp_expires` (DATETIME) - OTP expiration timestamp

### Service Layer Architecture

**AuthService**
- `signup()` - Create user with OTP
- `verifyOTP()` - Verify and mark account active
- `login()` - Authenticate user
- `getAllUsers()` - Fetch all users

**EmailService**
- `sendOTPEmail()` - Send OTP email using Nodemailer

**ProductService**
- `getAll()` - List products
- `getById()` - Get product by ID
- `create()` - Create new product

### Error Handling

The service layer returns consistent response objects:
```javascript
{
  success: boolean,
  error?: string,
  user?: object,
  userId?: number,
  message?: string
}
```

Controllers check `success` and return appropriate HTTP status codes (400, 401, 403, 500, etc.)

### Next Steps

1. Configure email provider credentials in `.env`
2. Run: `cd server && npm install && npm run dev`
3. Test signup endpoint - should send real email
4. Verify email with OTP
5. Login with verified account
