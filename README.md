# 🏢 Employee Management System (EMS)

A modern, secure, and comprehensive employee management system built with Next.js 14, featuring JWT authentication, responsive design, full CRUD operations, and complete database integration. This is a production-ready full-stack application with PWA support, SQLite database, and enterprise-grade architecture.

![Next.js](https://img.shields.io/badge/Next.js-14.2.5-000000?style=flat&logo=nextdotjs)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.4-38B2AC?style=flat&logo=tailwind-css)
![SQLite](https://img.shields.io/badge/SQLite-Ready-003B57?style=flat&logo=sqlite)
![Prisma](https://img.shields.io/badge/Prisma-Ready-2D3748?style=flat&logo=prisma)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat&logo=pwa)

## 🌟 Key Features

### 🔐 **Advanced Authentication System**
- **JWT-based Authentication**: Secure token-based authentication with server-side validation
- **Session Management**: Intelligent session handling with automatic token refresh
- **Protected Routes**: Middleware-based route protection with role-based access control
- **Secure Logout**: Complete token cleanup and session termination
- **Network Error Handling**: Robust error handling with retry logic

### 📊 **Comprehensive Dashboard**
- **Real-time Statistics**: Employee count, birthday notifications, and leave requests
- **Interactive Analytics**: Visual representation of employee data
- **Quick Actions**: Direct access to frequently used features
- **Responsive Layout**: Optimized for all screen sizes

### 👥 **Complete Employee Management**
- **Full CRUD Operations**: Create, read, update, and delete employee records
- **Advanced Filtering**: Filter by position, gender, service years, and search terms
- **Bulk Operations**: Efficient management of multiple employees
- **Data Validation**: Comprehensive form validation with real-time feedback
- **Service Year Calculation**: Automatic calculation of employee tenure

### 🎭 **Advanced Role Management**
- **Complete Role System**: Full CRUD operations for user roles with database persistence
- **Permission Management**: Granular permission control for different system features
- **Role-based Access Control**: Protect routes and features based on user roles
- **Default Roles**: Pre-configured Administrator, Manager, Employee, and Contractor roles
- **Dynamic User Assignment**: Assign and manage user roles with real-time updates

### 📱 **Modern User Interface**
- **Responsive Design**: Fully responsive across all devices and screen sizes
- **Mobile-First**: Optimized mobile navigation with touch-friendly interactions
- **Smooth Animations**: Fluid transitions and micro-interactions
- **Professional UI**: Clean, modern interface with Tailwind CSS
- **Dark/Light Theme Ready**: Theme system architecture in place

### 🛡️ **Security & Performance**
- **Input Validation**: Comprehensive client-side and server-side validation
- **PWA Support**: Progressive Web App with offline capabilities
- **Error Boundaries**: Graceful error handling and user feedback
- **Toast Notifications**: Real-time user feedback with Sonner
- **Type Safety**: Full TypeScript integration for better development experience

### 🗄️ **Database Integration**
- **SQLite Database**: Local SQLite database for development and testing
- **Prisma ORM**: Type-safe database operations with auto-generated client
- **Database Seeding**: Automatic creation of default roles and data
- **API Endpoints**: RESTful API for all CRUD operations
- **Data Persistence**: All data survives server restarts and page reloads
- **Migration Support**: Database schema management with Prisma

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
    ```bash
    git clone <repository-url>
    cd ems-v3
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Environment Configuration**
    Create a `.env.local` file in the root directory:
    ```env
    # ⚠️ SECURITY: Set your own secure credentials
    ADMIN_USERNAME=your_secure_username
    ADMIN_PASSWORD=your_secure_password

    # Optional: JWT Secret (auto-generated if not provided)
    SESSION_SECRET=your-super-secret-jwt-key-change-this-in-production
    NEXTAUTH_URL=http://localhost:9002

    # Database (SQLite for development - no additional setup required)
    # The DATABASE_URL is not needed for SQLite setup
    ```

    > **🔒 Security Warning**: Never commit your `.env.local` file to version control. Always use strong, unique credentials for production.

4. **Database Setup**
    ```bash
    # Generate Prisma client
    npm run db:generate

    # Create database and apply schema
    npm run db:push

    # Seed database with default roles
    npm run db:seed
    ```

    > **Note**: The database setup will automatically create:
    > - SQLite database file (`dev.db`)
    > - Administrator, Manager, Employee, and Contractor roles
    > - All necessary database tables and relationships

5. **Start Development Server**
    ```bash
    npm run dev
    ```

6. **Open Application**
    Navigate to `http://localhost:9002` in your browser

    **Default Login Credentials:**
    - **Username**: `YOUR_USERNAME` (or your configured ADMIN_USERNAME)
    - **Password**: `YOUR_PASSWORD` (or your configured ADMIN_PASSWORD)

## 🐳 Docker Deployment

### Docker Prerequisites
- **Docker Desktop** or **Docker Engine** installed on your system
- **Docker Compose** (included with Docker Desktop)

### Docker Quick Start

1. **Clone and Navigate**
    ```bash
    git clone <repository-url>
    cd ems-v3
    ```

2. **Build and Run with Docker Compose**
    ```bash
    docker-compose up --build
    ```

3. **Access Application**
    Open `http://localhost:9002` in your browser

### Docker Commands

```bash
# Build and start containers
docker-compose up --build

# Start in background
docker-compose up -d --build

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Rebuild without cache
docker-compose up --build --no-cache

# Stop and remove containers and volumes
docker-compose down -v
```

### Docker Login Credentials

When running with Docker, use these credentials:

- **Username**: `YOUR_USERNAME`
- **Password**: `YOUR_PASSWORD`

### Docker Architecture

The Docker setup uses a multi-stage build:

- **Base Stage**: Node.js 18 Alpine Linux
- **Dependencies Stage**: Install all project dependencies
- **Builder Stage**: Build the Next.js application
- **Production Stage**: Lightweight image with only runtime dependencies

### Docker Port Configuration

- **Internal Port**: Next.js runs on port 3000 inside the container
- **External Port**: Mapped to port 9002 on your host machine
- **Access**: Available at `http://localhost:9002`

### Docker Troubleshooting

**Container won't start:**
```bash
docker-compose logs
```

**Port already in use:**
```bash
# Stop other services on port 9002 or change the port in docker-compose.yml
docker-compose down
```

**Rebuild after code changes:**
```bash
docker-compose up --build
```

**Permission issues on Windows:**
```bash
# Run Docker Desktop as Administrator
```

**Out of memory:**
```bash
# Increase Docker Desktop memory allocation to at least 4GB
```

## 🏗️ Project Structure

```
ems-v3/
├── 📁 public/                 # Static assets and PWA files
│   ├── 📁 images/            # Favicon and app icons
│   ├── manifest.json         # PWA manifest
│   ├── sw.js                 # Service worker
│   └── workbox-*.js          # Workbox files
├── 📁 src/
│   ├── 📁 app/               # Next.js 14 App Router
│   │   ├── 📁 api/           # API routes (employees, roles)
│   │   │   ├── employees/    # Employee API endpoints
│   │   │   └── roles/        # Role management API endpoints
│   │   ├── 📁 dashboard/     # Dashboard pages
│   │   ├── 📁 login/         # Authentication pages
│   │   ├── 📁 globals.css    # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── 📁 Auth/              # Authentication system
│   │   ├── AuthContext.tsx   # JWT authentication context
│   │   └── index.ts          # Auth exports
│   ├── 📁 components/        # Reusable components
│   │   ├── 📁 icons/         # Lucide React icon components
│   │   ├── 📁 layout/        # Layout components (Sidebar, etc.)
│   │   ├── 📁 skeletons/     # Loading skeletons
│   │   ├── 📁 ui/            # Radix UI components
│   │   ├── ErrorBoundary.tsx # Error handling
│   │   └── NetworkErrorBoundary.tsx
│   ├── 📁 lib/               # Utility functions
│   │   ├── actions.ts        # Server actions
│   │   ├── session.ts        # Session management
│   │   └── utils.ts          # Utility functions
│   └── 📁 services/          # API services
│       └── api.ts            # API configuration
├── 📁 prisma/                # Database configuration
│   ├── schema.prisma         # Database schema and models
│   └── seed.ts              # Database seeding script
├── 📁 .next/                 # Next.js build output (auto-generated)
├── 📄 dev.db                 # SQLite database (auto-generated)
├── 📄 package.json           # Dependencies and scripts
├── 📄 next.config.mjs        # Next.js configuration
├── 📄 tailwind.config.ts     # Tailwind CSS configuration
├── 📄 tsconfig.json          # TypeScript configuration
├── 📄 postcss.config.mjs     # PostCSS configuration
└── 📄 README.md              # Project documentation
```

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 14.2.5** - React framework with App Router and server components
- **React 18.3.1** - Modern React with concurrent features
- **TypeScript 5.5.3** - Full type safety and developer experience

### Styling & UI
- **Tailwind CSS 3.4.4** - Utility-first CSS framework
- **Radix UI** - Accessible, customizable UI components
- **Lucide React** - Beautiful icon library
- **Custom Components** - Reusable, accessible UI components

### Authentication & Security
- **JOSE Library** - JavaScript Object Signing and Encryption
- **JWT Tokens** - JSON Web Token implementation
- **Next.js Middleware** - Route protection and authentication
- **React Context** - State management for auth state

### Progressive Web App
- **@ducanh2912/next-pwa** - PWA integration for Next.js
- **Workbox** - Service worker and caching strategies
- **Web App Manifest** - Native app-like experience

### Database & Backend
- **SQLite** - Embedded database for development and testing
- **Prisma ORM** - Type-safe database toolkit and query builder
- **RESTful APIs** - Complete API endpoints for all operations
- **Database Seeding** - Automated initial data setup

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Hot Module Replacement** - Instant development feedback

## 🔧 Development Scripts

```bash
# Start development server (port 9002)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Database operations
npm run db:generate    # Generate Prisma client
npm run db:push        # Create database and apply schema
npm run db:seed        # Seed database with default data
npm run db:setup       # One command to setup everything (generate + push + seed)
```

## 🎯 Core Modules

### Employee Management
- **Employee Lists**: View, search, and filter employees
- **Add New Employee**: Create employee records with validation
- **Edit Employee**: Update employee information
- **Delete Employee**: Remove employee records with confirmation
- **Advanced Filtering**: Filter by position, gender, service years
- **Service Year Calculation**: Automatic tenure calculation

### Dashboard Features
- **Statistics Overview**: Real-time employee statistics
- **Birthday Notifications**: Track upcoming employee birthdays
- **Leave Requests**: Monitor pending leave requests
- **Quick Actions**: Direct access to common tasks

### User Management
- **Role-based Access**: Different permission levels with database persistence
- **User Authentication**: Secure login system with JWT tokens
- **Session Management**: Automatic session handling with refresh logic
- **Complete Role System**: Full CRUD operations for user roles
- **Permission Management**: Granular permission control for system features
- **Default Roles**: Pre-configured Administrator, Manager, Employee, and Contractor roles

### Database Models
- **User Model**: User accounts with role assignments and authentication
- **Role Model**: Role definitions with permissions stored as JSON
- **Employee Model**: Complete employee information with timestamps
- **Relationships**: Proper foreign key relationships between models

### API Endpoints
- **Employee API**: Complete CRUD operations for employee management
- **Role API**: Full role management with permission handling
- **Error Handling**: Comprehensive error responses and validation
- **Type Safety**: Full TypeScript integration with generated types

## 🔐 Authentication Flow

### Login Process
1. **User submits credentials** via login form
2. **Server-side validation** using Next.js server actions
3. **JWT token generation** with secure signing
4. **Token storage** in HTTP-only cookies
5. **Route protection** via middleware
6. **Automatic token refresh** for seamless experience

### Security Features
- **Password Validation**: Minimum 6 characters with complexity requirements
- **Username Validation**: Minimum 3 characters with sanitization
- **JWT Security**: HMAC SHA-256 signing with secure secrets
- **Token Expiration**: Automatic expiration prevents long-lived sessions
- **Input Sanitization**: All user inputs validated and sanitized
- **XSS Protection**: Built-in React XSS protection

## 📱 Responsive Design

The application is fully responsive with:

- **Desktop (≥1024px)**: Full sidebar navigation with comprehensive table view
- **Tablet (768px-1023px)**: Adaptive layout with touch-friendly interactions
- **Mobile (<768px)**: Hamburger menu with slide-out navigation and optimized mobile table

### Breakpoints
- **Mobile First**: Base styles for mobile devices
- **Tablet**: Enhanced layout for medium screens
- **Desktop**: Full-featured layout for large screens

## 🔄 Progressive Web App (PWA)

### PWA Features
- **Offline Support**: Service worker caching for offline functionality
- **App Installation**: Install as native app on mobile devices
- **Background Sync**: Sync data when connection is restored
- **Push Notifications**: Ready for push notification implementation

### PWA Configuration
- **Web App Manifest**: Configured for app-like experience
- **Service Worker**: Automatic caching and offline support
- **App Icons**: Multiple icon sizes for different devices
- **Theme Colors**: Consistent branding across platforms

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
```env
# Required
ADMIN_USERNAME=your_production_username
ADMIN_PASSWORD=your_secure_password
NEXTAUTH_SECRET=your_production_jwt_secret_key
NEXTAUTH_URL=https://your-production-domain.com

# Optional (for future backend integration)
DATABASE_URL=your_production_database_url
```

### Deployment Platforms
- **Docker**: Containerized deployment (Recommended)
- **Vercel**: Zero-configuration deployment with Next.js optimization
- **Netlify**: Static site hosting with environment variables
- **AWS Amplify**: Full-stack deployment with CI/CD
- **Railway**: Docker-based cloud deployment
- **Google Cloud Run**: Serverless container deployment

### Production Checklist
- [ ] Update environment variables
- [ ] Configure domain settings
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring and logging
- [ ] Configure backup strategies

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature-name`
3. **Commit** your changes: `git commit -am 'Add feature'`
4. **Push** to the branch: `git push origin feature-name`
5. **Submit** a pull request

### Code Style Guidelines
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Write descriptive commit messages
- Follow Next.js best practices
- Ensure responsive design for all components

### Development Workflow
1. Create feature branch from main
2. Make changes with proper TypeScript types
3. Test on multiple screen sizes
4. Ensure PWA functionality works
5. Submit pull request with clear description

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Documentation

### Getting Help
- Create an issue in the repository for bugs or feature requests
- Check existing issues for similar problems
- Review the documentation for common solutions

### Documentation
- **API Documentation**: Available in `/src/services/api.ts`
- **Component Documentation**: Available in component files
- **PWA Documentation**: Available in Next.js PWA configuration

## 🔄 Future Enhancements

### Planned Features
- [ ] **Advanced Analytics**: Comprehensive dashboard metrics and reporting
- [ ] **File Management**: Document upload and management system
- [ ] **Email Integration**: SMTP email notifications for events
- [ ] **Audit Logs**: Complete audit trail for all actions
- [ ] **Multi-tenant Support**: Support for multiple organizations
- [ ] **Real-time Updates**: WebSocket integration for live data
- [ ] **Advanced Search**: Full-text search with filters
- [ ] **Export Features**: PDF/Excel export capabilities
- [ ] **Bulk Operations**: Enhanced bulk employee operations
- [ ] **PostgreSQL Migration**: Upgrade from SQLite to PostgreSQL for production

### Security Enhancements
- [ ] **Two-Factor Authentication**: 2FA support for enhanced security
- [ ] **Password Reset**: Email-based password reset functionality
- [ ] **Account Lockout**: Brute force protection mechanisms
- [ ] **Advanced RBAC**: Granular permission system
- [ ] **API Rate Limiting**: Protection against API abuse
- [ ] **Security Headers**: Enhanced security headers implementation

### Performance Improvements
- [ ] **Code Splitting**: Advanced code splitting for better performance
- [ ] **Image Optimization**: Automatic image optimization
- [ ] **Bundle Analysis**: Detailed bundle analysis and optimization
- [ ] **Caching Strategies**: Enhanced caching for better performance

---

**Built with ❤️ using Next.js 14, React 18, TypeScript, and modern web technologies**
