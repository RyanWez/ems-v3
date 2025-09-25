# 🏢 Employee Management System (EMS)

A modern, secure React-based Employee Management System with JWT authentication, responsive design, and comprehensive admin panel functionality. Built with enterprise-grade security features and best practices.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css)
![JWT](https://img.shields.io/badge/JWT-Token-000000?style=flat&logo=jsonwebtokens)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat&logo=vite)

## 🌟 Features

### 🔐 **Enterprise-Grade Authentication**
- **JWT-based Authentication**: Secure token-based authentication system
- **Automatic Token Refresh**: Seamless token renewal without user interruption
- **Session Management**: Intelligent session handling with expiration controls
- **Protected Routes**: Route-level security with role-based access control
- **Secure Logout**: Complete token cleanup and session termination

### 📱 **Modern User Interface**
- **Responsive Design**: Fully responsive across all devices and screen sizes
- **Mobile-First**: Optimized mobile navigation with hamburger menu
- **Smooth Animations**: Fluid transitions and micro-interactions
- **Professional UI**: Clean, modern interface with Tailwind CSS
- **Dark/Light Theme Ready**: Theme system architecture in place

### 🛡️ **Security Features**
- **Input Validation**: Comprehensive client-side and server-side validation
- **Password Security**: Strong password requirements and hashing
- **Token Encryption**: Secure JWT token generation and validation
- **Session Timeout**: Automatic logout on token expiration
- **XSS Protection**: Built-in protection against cross-site scripting attacks

### 🎯 **System Modules**
- **Dashboard**: Overview and analytics dashboard
- **Employee Management**: Complete employee lifecycle management
- **User Management**: User roles and permissions system
- **Leave Management**: Annual leave and attendance tracking
- **Birthday Tracking**: Employee birthday notifications
- **Reporting**: Data export and reporting capabilities

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd employee-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory with your secure credentials:
   ```env
   # ⚠️  SECURITY: Set your own secure credentials
   VITE_ADMIN_USERNAME=your_secure_username
   VITE_ADMIN_PASSWORD=your_secure_password

   # Optional: JWT Secret (auto-generated if not provided)
   VITE_JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # Database (for future backend integration - Neon PostgreSQL)
   VITE_NEON_DATABASE_URL='postgresql://neondb_owner:your_password@your_host.neon.tech/neondb?sslmode=require'
   ```

   > **🔒 Security Warning**: Never commit your `.env` file to version control. Always use strong, unique credentials for production.

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open Application**
   Navigate to `http://localhost:5173` in your browser



### JWT Token Management

The system implements a robust JWT-based authentication with:

- **Access Tokens**: Short-lived (1 hour) for API access
- **Refresh Tokens**: Long-lived (7 days) for token renewal
- **Automatic Refresh**: Seamless token refresh without user interruption
- **Secure Storage**: Tokens encrypted and stored in localStorage

### Session Flow

1. **Login**: User credentials validated, JWT tokens generated
2. **Token Storage**: Access and refresh tokens stored securely
3. **Route Protection**: All protected routes validate tokens
4. **Auto-Refresh**: Expired access tokens automatically refreshed
5. **Logout**: Complete token cleanup and session termination

## 🏗️ Project Structure

```
employee-management-system/
├── 📁 public/                 # Static assets
├── 📁 src/
│   ├── 📁 Auth/              # Authentication system
│   │   ├── AuthContext.tsx   # JWT authentication context
│   │   ├── Login.tsx         # Login component with validation
│   │   ├── ProtectedRoute.tsx # Route protection component
│   │   └── index.ts          # Auth exports
│   ├── 📁 components/        # Reusable components
│   │   ├── 📁 icons/         # SVG icon components
│   │   ├── 📁 layout/        # Layout components
│   │   │   ├── Sidebar.tsx   # Responsive sidebar
│   │   │   └── SidebarItem.tsx
│   │   ├── ErrorBoundary.tsx # Error handling
│   │   └── Hamburger.tsx     # Mobile menu toggle
│   ├── 📁 pages/            # Page components
│   │   ├── Dashboard.tsx     # Main dashboard
│   │   ├── EmployeeLists.tsx # Employee management
│   │   ├── EmployeeBirthday.tsx
│   │   ├── AnnualLeave.tsx   # Leave management
│   │   ├── UserList.tsx      # User management
│   │   ├── UserRoles.tsx     # Role management
│   │   └── NotFound.tsx      # 404 page
│   ├── 📁 utils/            # Utility functions
│   │   ├── jwt.ts           # JWT token management
│   │   └── database.ts      # Database configuration
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── 📄 package.json          # Dependencies and scripts
├── 📄 vite.config.ts        # Vite configuration
├── 📄 tsconfig.json         # TypeScript configuration
├── 📄 tailwind.config.js    # Tailwind CSS configuration
└── 📄 README.md             # Project documentation
```

## 🛠️ Technology Stack

### Frontend Framework
- **React 19** - Modern React with latest features
- **TypeScript 5.0** - Full type safety and developer experience
- **Vite 5.0** - Lightning-fast build tool and dev server

### Styling & UI
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Custom Components** - Reusable, accessible UI components

### Authentication & Security
- **JOSE Library** - JavaScript Object Signing and Encryption
- **JWT Tokens** - JSON Web Token implementation
- **React Context** - State management for auth state

### Database (Future Backend)
- **Neon PostgreSQL** - Serverless PostgreSQL database (for backend integration)
- **Frontend-Ready** - Database configuration prepared for backend API

### Development Tools
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Hot Module Replacement** - Instant development feedback

## 🔧 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

## 🔐 Security Features

### Authentication Security
- **Password Validation**: Minimum 6 characters with complexity requirements
- **Username Validation**: Minimum 3 characters with sanitization
- **JWT Security**: HMAC SHA-256 signing with secure secrets
- **Token Expiration**: Automatic expiration prevents long-lived sessions

### Application Security
- **Input Sanitization**: All user inputs validated and sanitized
- **XSS Protection**: Built-in React XSS protection
- **CSRF Ready**: Architecture ready for CSRF protection
- **Secure Headers**: Ready for security headers implementation

### Data Protection
- **Encrypted Storage**: Sensitive data encrypted before storage
- **Session Management**: Secure session handling with timeouts
- **Secure Defaults**: Security-first configuration approach

## 🌐 API Endpoints (Simulated)

The application includes simulated API endpoints for:

- **POST** `/api/auth/login` - User authentication
- **POST** `/api/auth/refresh` - Token refresh
- **POST** `/api/auth/logout` - User logout
- **GET** `/api/dashboard` - Dashboard data
- **GET** `/api/employees` - Employee listings
- **POST** `/api/employees` - Create employee
- **PUT** `/api/employees/:id` - Update employee
- **DELETE** `/api/employees/:id` - Delete employee

## 📱 Responsive Design

The application is fully responsive with:

- **Desktop**: Full sidebar navigation with collapsible menu
- **Tablet**: Adaptive layout with touch-friendly interactions
- **Mobile**: Hamburger menu with slide-out navigation
- **Breakpoints**: Tailwind CSS responsive breakpoints

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
```env
# Required
VITE_ADMIN_USERNAME=your_production_username
VITE_ADMIN_PASSWORD=your_secure_password
VITE_JWT_SECRET=your_production_jwt_secret_key

# Optional (for future backend integration)
VITE_NEON_DATABASE_URL=your_production_neon_database_url
```

### Deployment Platforms
- **Vercel**: Zero-configuration deployment
- **Netlify**: Static site hosting with environment variables
- **AWS S3 + CloudFront**: CDN-enabled static hosting
- **Docker**: Containerized deployment ready

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature-name`
3. **Commit** your changes: `git commit -am 'Add feature'`
4. **Push** to the branch: `git push origin feature-name`
5. **Submit** a pull request

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Write descriptive commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review existing issues for similar problems

## 🌐 Frontend-Only Architecture

This application is currently a **frontend-only** React application that runs entirely in the browser. It uses simulated API endpoints and mock data for demonstration purposes.

### Database Integration
- **Current State**: Database configuration is prepared for future backend integration
- **Neon PostgreSQL**: Database connection string configured for production backend
- **Future Implementation**: When backend is added, the database utility will connect to Neon PostgreSQL
- **API Ready**: Frontend components are structured to easily integrate with REST API endpoints

### Backend Integration Path
1. **Create Backend API**: Implement Node.js/Express or similar backend server
2. **Database Connection**: Use the configured Neon PostgreSQL connection
3. **API Endpoints**: Replace simulated endpoints with real database operations
4. **Authentication**: Connect frontend JWT system with backend validation

## 🔄 Future Enhancements

### Planned Features
- [ ] **Backend API**: Full REST API implementation
- [ ] **Real-time Updates**: WebSocket integration for live data
- [ ] **Advanced Analytics**: Dashboard with comprehensive metrics
- [ ] **File Management**: Document upload and management
- [ ] **Email Integration**: SMTP email notifications
- [ ] **Audit Logs**: Complete audit trail system
- [ ] **Multi-tenant Support**: Multi-organization architecture
- [ ] **API Documentation**: Swagger/OpenAPI documentation

### Security Enhancements
- [ ] **Two-Factor Authentication**: 2FA support
- [ ] **Password Reset**: Email-based password reset
- [ ] **Account Lockout**: Brute force protection
- [ ] **Advanced RBAC**: Granular permission system

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
