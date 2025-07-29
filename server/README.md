# Users & Events CRUD API

A RESTful API for managing users and events with authentication, built with Node.js, Express.js, and MongoDB.

## Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 👥 **User Management** - Create, read, update, delete users
- 📅 **Event Management** - CRUD operations for events with time conflict detection
- ✅ **Input Validation** - Comprehensive request validation using express-validator
- 🛡️ **Error Handling** - Centralized error handling with custom error responses
- 🎯 **Service Layer** - Clean separation of concerns with service pattern
- 📝 **Request Logging** - Morgan-based logging with custom formats
- 🏗️ **Modular Architecture** - Well-organized code structure

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **Morgan** - HTTP request logging
- **CORS** - Cross-origin resource sharing

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd users-events-crud/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/users-events-crud
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |
| PUT | `/api/auth/change-password` | Change password | Yes |
| POST | `/api/auth/logout` | Logout user | Yes |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users` | Get all users with stats | No |
| GET | `/api/users/:id` | Get user profile with events | No |
| POST | `/api/users` | Create new user | No |
| PUT | `/api/users/:id` | Update user | No |
| DELETE | `/api/users/:id` | Delete user and their events | No |

### Events

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/events` | Get all events (optional userId filter) | No |
| GET | `/api/events/:id` | Get event by ID | No |
| POST | `/api/events` | Create new event | No |
| PUT | `/api/events/:id` | Update event | No |
| DELETE | `/api/events/:id` | Delete event | No |

## Request/Response Examples

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Create Event
```http
POST /api/events
Content-Type: application/json

{
  "title": "Team Meeting",
  "description": "Weekly team sync",
  "startDate": "2024-01-15T10:00:00.000Z",
  "endDate": "2024-01-15T11:00:00.000Z",
  "userId": "507f1f77bcf86cd799439011"
}
```

### Success Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## Validation Rules

### User Validation
- **firstName**: 2-50 characters, required
- **lastName**: 2-50 characters, required
- **email**: Valid email format, required
- **phoneNumber**: Valid mobile phone, required

### Event Validation
- **title**: 3-100 characters, required
- **description**: Optional, max 500 characters
- **startDate**: Valid ISO date, cannot be in the past
- **endDate**: Valid ISO date, must be after startDate
- **userId**: Valid MongoDB ObjectId, required

### Auth Validation
- **password**: 6-100 characters, must contain lowercase, uppercase, and number

## Business Logic

### Event Time Conflict Detection
The system prevents users from creating overlapping events. When creating or updating an event, the API checks for time conflicts with existing events for the same user.

### User Statistics
The `/api/users` endpoint returns enriched user data including:
- Total events count
- Next upcoming event date

## Error Handling

The API uses centralized error handling with:
- Mongoose validation errors
- JWT authentication errors
- Custom business logic errors
- Input validation errors

## Development

### Project Structure
```
server/
├── bin/www                 # Application entry point
├── app.js                  # Express app configuration
├── config/
│   └── database.js         # MongoDB connection
├── constants/
│   └── index.js           # Application constants
├── middleware/
│   ├── auth.js            # Authentication middleware
│   ├── logger.js          # Request logging
│   └── validation.js      # Input validation rules
├── models/
│   ├── Auth.js            # User authentication model
│   ├── Event.js           # Event model
│   └── User.js            # User model
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── events.js          # Event routes
│   ├── index.js           # Root routes
│   └── users.js           # User routes
├── services/
│   ├── AuthService.js     # Authentication business logic
│   ├── EventService.js    # Event business logic
│   └── UserService.js     # User business logic
└── utils/
    └── response.js        # Response utilities
```

### Scripts
```bash
npm run dev          # Start with nodemon
npm start           # Start production
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint issues
npm test           # Run tests
npm run seed       # Seed database
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and tests
6. Submit a pull request

## License

This project is licensed under the MIT License.
