# RIT CyberGuard Backend

A robust Node.js backend API for the RIT CyberGuard cybersecurity club website.

## 🚀 Features

- **RESTful API**: Clean and organized API endpoints
- **Database**: SQLite database with proper schema design
- **Authentication**: JWT-based admin authentication
- **Email Integration**: Automated email notifications
- **Validation**: Input validation and sanitization
- **Security**: Rate limiting, CORS, security headers
- **Error Handling**: Comprehensive error handling
- **Documentation**: Complete API documentation

## 📋 Prerequisites

- Node.js (v16.0.0 or higher)
- npm or yarn

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

### 3. Initialize Database
```bash
npm run init-db
```

### 4. Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 📁 Project Structure

```
rit-cyberguard-backend/
├── config/
│   └── database.js          # Database configuration
├── middleware/
│   └── errorHandler.js      # Error handling middleware
├── models/
│   ├── Member.js            # Member model
│   ├── Contact.js           # Contact model
│   └── Event.js             # Event model
├── routes/
│   ├── members.js           # Member routes
│   ├── contact.js           # Contact routes
│   ├── events.js            # Event routes
│   └── admin.js             # Admin routes
├── utils/
│   ├── emailService.js      # Email utilities
│   └── initDatabase.js      # Database initialization
├── public/                  # Static files
├── server.js                # Main server file
├── package.json             # Dependencies and scripts
├── .env.example             # Environment template
├── API_DOCUMENTATION.md     # API documentation
└── README.md                # This file
```

## 🗄️ Database Schema

The application uses SQLite with the following tables:
- `members` - Club membership applications
- `contact_messages` - Contact form submissions
- `events` - Club events
- `event_registrations` - Event registrations
- `admin_users` - Admin user accounts
- `teams` - Club teams
- `activities` - Club activities

## 🔑 Default Admin Account

After running `npm run init-db`, a default admin account is created:
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change the default password in production!

## 📧 Email Configuration

### Development
Uses Ethereal Email for testing (temporary accounts created automatically).

### Production
Configure your email service in `.env`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

For Gmail, use an App Password instead of your regular password.

## 🚀 Deployment

### Environment Variables
Set these in your production environment:
```env
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-domain.com
JWT_SECRET=your-super-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=cyberguard@ritrjpm.ac.in
```

### Database
SQLite database is file-based and will be created automatically. For production, consider:
- Regular backups of `database.sqlite`
- Using a more robust database like PostgreSQL or MySQL

### Process Management
Use PM2 for production deployment:
```bash
npm install -g pm2
pm2 start server.js --name "rit-cyberguard-backend"
```

## 📊 API Endpoints

### Public Endpoints
- `POST /api/members/join` - Submit membership application
- `POST /api/contact` - Submit contact form
- `GET /api/events` - Get all events
- `POST /api/events/register` - Register for an event

### Admin Endpoints (Authentication Required)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/members` - Get all members
- `PUT /api/members/:id/status` - Update member status
- `GET /api/contact` - Get all contact messages
- `POST /api/admin/events` - Create new event
- `GET /api/admin/export/members` - Export members data

## 🔒 Security Features

- **Rate Limiting**: Prevents abuse and spam
- **Input Validation**: Validates all input data
- **SQL Injection Protection**: Parameterized queries
- **Password Hashing**: bcrypt for secure password storage
- **JWT Authentication**: Secure admin authentication
- **CORS**: Configurable cross-origin requests
- **Security Headers**: Helmet.js for security headers

## 📈 Monitoring

### Health Check
```bash
curl http://localhost:3000/health
```

### Logs
The application uses Morgan for request logging. In production, configure proper log management.

## 🧪 Testing

### Manual Testing
Use Postman, Insomnia, or curl to test API endpoints.

### API Documentation
See `API_DOCUMENTATION.md` for detailed endpoint documentation.

## 🛠️ Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run init-db` - Initialize database with sample data

### Code Structure
- Follow RESTful conventions
- Use async/await for asynchronous operations
- Implement proper error handling
- Validate all inputs
- Use meaningful variable and function names

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For technical support:
- Email: cyberguard@ritrjpm.ac.in
- Phone: +91 9489634752

## 📄 License

© 2025 RIT CyberGuard. All rights reserved.

---

**Security Through Innovation** 🛡️