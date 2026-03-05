# Local API server (Express + MySQL + Nodemailer)

## Project Structure

```
src/
├── config/        # Configuration files (database, mailer)
├── controllers/   # Route handlers
├── services/      # Business logic
├── routes/        # API routes
├── utils/         # Helper functions and templates
└── index.js       # Main entry point
```

## Quick setup with Docker MySQL:

1. Start the MySQL container:

```bash
docker run -d \
  --name mysql_container \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=mydatabase \
  -e MYSQL_USER=myuser \
  -e MYSQL_PASSWORD=mypassword \
  -p 3306:3306 \
  -v mysql_data:/var/lib/mysql \
  mysql:8.0
```

2. Set up the database tables:

```bash
# Wait a moment for MySQL to start, then run:
mysql -h 127.0.0.1 -u myuser -pmypassword mydatabase < init.sql
```

3. Create `.env` file with the following content:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=myuser
DB_PASSWORD=mypassword
DB_NAME=mydatabase
PORT=4000

# Email Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@remarket.com
```

**Note:** For Gmail, generate an [App Password](https://myaccount.google.com/apppasswords) instead of using your main password.

4. Install dependencies and run in dev:

```bash
cd server
npm install
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/signup` - Register user (sends OTP to email)
  ```json
  { "name": "john", "email": "john@example.com", "password": "pass123" }
  ```
- `POST /api/verify-otp` - Verify OTP and mark email as verified
  ```json
  { "email": "john@example.com", "otp": "123456" }
  ```
- `POST /api/login` - Login user (only works after OTP verification)
  ```json
  { "email": "john@example.com", "password": "pass123" }
  ```
- `GET /api/users` - List all users

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create a product
- `GET /api/products/:id` - Get product by ID

## Authentication Flow

1. User signs up with name, email, password
2. Server generates OTP and sends it to the email
3. User enters OTP to verify email
4. After verification, user can log in
5. Login returns user details for frontend storage

## Notes

- Never commit real email passwords to git
- Use environment variables for all sensitive data
- OTP expires in 10 minutes
- Check console logs for OTP during testing (before SMTP is configured)

