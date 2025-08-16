# RIT CyberGuard Backend API Documentation

## Overview

This is the backend API for the RIT CyberGuard website, built with Node.js, Express, and SQLite.

## Base URL
```
http://localhost:3000/api
```

## Authentication

Admin endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## API Endpoints

### Health Check
- `GET /health` - Server health check

### Members
- `POST /api/members/join` - Submit membership application
- `GET /api/members` - Get all members (admin only)
- `GET /api/members/stats` - Get membership statistics
- `PUT /api/members/:id/status` - Update member status (admin only)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact messages (admin only)
- `GET /api/contact/stats` - Get contact statistics
- `PUT /api/contact/:id/read` - Mark message as read (admin only)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get specific event
- `POST /api/events/register` - Register for an event
- `GET /api/events/:id/registrations` - Get event registrations (admin only)

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard` - Get dashboard statistics (admin only)
- `POST /api/admin/events` - Create new event (admin only)
- `PUT /api/admin/events/:id` - Update event (admin only)
- `DELETE /api/admin/events/:id` - Delete event (admin only)
- `GET /api/admin/export/members` - Export members data (admin only)

## Request/Response Examples

### Submit Membership Application
```http
POST /api/members/join
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john.doe@student.ritrjpm.ac.in",
  "phone": "+91 9876543210",
  "department": "CSE",
  "year": 2,
  "experience": "Basic knowledge of networking and security",
  "motivation": "Interested in cybersecurity and want to learn more"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application submitted successfully! You will hear back from us within 2-3 business days.",
  "data": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john.doe@student.ritrjpm.ac.in",
    "status": "pending"
  }
}
```

### Submit Contact Form
```http
POST /api/contact
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "subject": "Question about workshops",
  "message": "I would like to know more about your upcoming workshops."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully! We will respond within 24 hours.",
  "data": {
    "id": 1,
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "subject": "Question about workshops"
  }
}
```

### Register for Event
```http
POST /api/events/register
Content-Type: application/json

{
  "eventId": 1,
  "name": "Alice Johnson",
  "email": "alice.johnson@student.ritrjpm.ac.in",
  "phone": "+91 9876543210",
  "department": "IT",
  "year": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful! Check your email for confirmation.",
  "data": {
    "registrationId": 1,
    "eventName": "Club Introduction & Welcome",
    "eventDate": "2025-08-20 18:00:00"
  }
}
```

### Admin Login
```http
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": 1,
      "username": "admin",
      "email": "admin@ritrjpm.ac.in",
      "role": "admin"
    }
  }
}
```

## Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional validation errors
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting

- General API: 100 requests per 15 minutes per IP
- Form submissions: 5 requests per minute per IP

## Database Schema

### Members Table
- `id` - Primary key
- `full_name` - Student's full name
- `email` - Email address (unique)
- `phone` - Phone number
- `department` - Academic department
- `year` - Year of study (1-4)
- `experience` - Prior cybersecurity experience
- `motivation` - Motivation for joining
- `status` - pending/approved/rejected
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Contact Messages Table
- `id` - Primary key
- `name` - Contact name
- `email` - Email address
- `subject` - Message subject
- `message` - Message content
- `status` - unread/read
- `created_at` - Timestamp

### Events Table
- `id` - Primary key
- `name` - Event name
- `description` - Event description
- `schedule` - Event date/time
- `location` - Event location
- `max_participants` - Maximum participants
- `status` - upcoming/ongoing/completed/cancelled
- `created_at` - Timestamp

### Event Registrations Table
- `id` - Primary key
- `event_id` - Foreign key to events
- `name` - Participant name
- `email` - Participant email
- `phone` - Participant phone
- `department` - Participant department
- `year` - Participant year
- `created_at` - Timestamp

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:8080
JWT_SECRET=your-super-secret-jwt-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=cyberguard@ritrjpm.ac.in
```

## Security Features

- Rate limiting on all endpoints
- Input validation and sanitization
- SQL injection prevention
- Password hashing with bcrypt
- JWT token authentication
- CORS protection
- Helmet security headers
- Request logging

## Email Integration

The system sends automated emails for:
- Membership application confirmations
- Contact form acknowledgments
- Event registration confirmations
- Admin notifications
- Membership status updates