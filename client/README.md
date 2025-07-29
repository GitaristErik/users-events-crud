# Users Events CRUD - Client (Vue 3)

A modern, responsive Vue 3 application for managing users and events with a clean UI and robust error handling.

## 🏗️ Architecture Overview

### Key Patterns & Principles
- **Composition API**: Modern Vue 3 patterns with composables
- **Service Layer**: Clean separation of concerns
- **Error Handling**: Centralized error management with user feedback
- **Form Validation**: Reusable validation composables
- **Responsive Design**: Mobile-first approach

### Tech Stack
- **Vue 3** - Progressive framework with Composition API
- **Vite** - Fast build tool and dev server
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Axios** - HTTP client for API communication

## 📁 Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── BaseModal.vue   # Modal wrapper component
│   ├── EventCrudForm.vue # Event creation/editing form
│   ├── NavBar.vue      # Navigation component
│   ├── UserForm.vue    # User creation form
│   └── ...
├── composables/        # Reusable composition functions
│   ├── useApi.js      # API integration
│   ├── useAuth.js     # Authentication logic
│   ├── useErrorHandling.js # Error management
│   ├── useFormValidation.js # Form validation
│   └── ...
├── views/             # Page components
│   ├── HomeView.vue   # Users management page
│   ├── EventsView.vue # Events management page
│   └── ...
├── stores/            # Pinia stores
├── services/          # API services
└── utils/             # Helper functions
```

## 🔧 Key Features

### Composables System
- **useApi.js**: Centralized API calls with error handling
- **useErrorHandling.js**: Consistent error display and management
- **useFormValidation.js**: Reusable form validation logic
- **useAuth.js**: Authentication state and methods

### Error Handling
- Structured error responses from server
- User-friendly error messages
- Field-level validation feedback
- Network error handling

### Form Validation
- Real-time validation
- Custom validation rules
- Error highlighting
- Accessibility support

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## 🔌 API Integration

The client communicates with a Node.js/Express server that provides:

- **Authentication**: JWT-based auth
- **Users Management**: CRUD operations
- **Events Management**: CRUD operations with user associations
- **Validation**: Server-side validation with detailed error responses

### API Response Format
```javascript
{
  success: boolean,
  data: any,
  message: string,
  errors?: Array<{field: string, message: string}>
}
```

## 🎨 UI/UX Features

- **Responsive Design**: Works on all screen sizes
- **Loading States**: Visual feedback during operations
- **Success Messages**: Confirmation of successful actions
- **Error Messages**: Clear error communication
- **Accessible Forms**: ARIA labels and keyboard navigation

## 📱 Components Overview

### Core Components
- **TableUniversal**: Reusable data table with sorting and search
- **EventCrudForm**: Comprehensive form for event management
- **UserForm**: User creation with validation
- **StatsCard**: Dashboard statistics display

### Utilities
- **helpers.js**: Date formatting, success/error messages
- **constants/index.js**: Application constants and messages

## 🔐 Authentication

- JWT-based authentication
- Persistent login state
- Automatic token refresh
- Protected routes

## 🧪 Development

### Code Style
- ESLint configuration for consistent code
- Vue 3 best practices
- Composition API patterns

### Building
```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## 🌟 Recent Improvements

### Server Integration Updates
- Updated to work with new server API structure
- Improved error handling for new response format
- Enhanced validation integration

### Code Quality
- Migrated from Options API to Composition API
- Implemented reusable composables
- Centralized error handling
- Improved form validation patterns

### User Experience
- Better loading states
- Improved error messages
- Responsive design enhancements
- Accessibility improvements

## 🔗 Related

- [Server Documentation](../server/README.md)
- [API Documentation](../server/REFACTOR_SUMMARY.md)
