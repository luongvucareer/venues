# 🚀 Venues - Modern Next.js Fullstack Template

A professional, production-ready Next.js 15 fullstack template with TypeScript, Prisma, NextAuth.js, and modern best practices.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.1-2D3748)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🎯 Core Technologies

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router, Server Components & Turbopack
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Prisma](https://www.prisma.io/)** - Type-safe ORM with PostgreSQL
- **[NextAuth.js v5](https://next-auth.js.org/)** - Complete authentication system
- **[next-intl](https://next-intl-docs.vercel.app/)** - Internationalization (i18n)
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives

### 🏗️ Architecture & Patterns

- ✅ **Clean Architecture** - Layered design (Repository, Service, Actions)
- ✅ **Server Actions** - Type-safe server-side operations
- ✅ **Validation** - Runtime validation with Zod
- ✅ **State Management** - Zustand for global state
- ✅ **Data Fetching** - TanStack Query (React Query)
- ✅ **Form Handling** - React Hook Form with Zod integration

### 🔐 Authentication

- Email/Password authentication with verification
- Google OAuth integration
- Role-based access control (RBAC)
- Session management
- Email verification system
- Password security (bcrypt)

### 🌍 Internationalization

- Multi-language support (English & Bulgarian)
- Type-safe translations with next-intl
- Automatic locale routing (/en/_, /bg/_)
- Easy to add new languages
- Server & Client Components support

### 🎨 UI/UX

- Beautiful, accessible components
- Dark mode ready
- Responsive design
- Loading states & error handling
- Form validation feedback
- Toast notifications

### 🧪 Testing & Quality

- Vitest for unit/integration tests
- Playwright for E2E testing
- ESLint for code quality
- Prettier for code formatting
- TypeScript strict mode
- Test coverage reports

## 📁 Project Structure

```
venues/
├── docs/                      # Comprehensive documentation
│   ├── ARCHITECTURE.md       # System architecture overview
│   ├── SETUP.md              # Setup and configuration guide
│   ├── backend/
│   │   ├── SERVER_ACTIONS.md # Server Actions patterns
│   │   ├── SECURITY.md       # Security best practices
│   │   └── TESTING.md        # Testing guide
│   └── features/
│       └── AUTHENTICATION.md # Auth system documentation
├── prisma/
│   └── schema.prisma         # Database schema
├── src/
│   ├── app/                  # Next.js App Router
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   └── features/        # Feature-specific components
│   ├── lib/                 # Utilities and configurations
│   │   ├── prisma.ts        # Prisma client
│   │   ├── utils.ts         # Helper functions
│   │   └── validations/     # Zod schemas
│   ├── types/               # TypeScript type definitions
│   ├── actions/             # Server Actions
│   ├── services/            # Business logic layer
│   └── repositories/        # Database access layer
├── .env.example             # Environment variables template
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.17 or later
- **PostgreSQL** database
- **npm** or **pnpm** package manager

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/luongvucareer/venues.git
cd venues
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

```bash
cp .env.example .env
```

Edit `.env` and configure:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- `RESEND_API_KEY` - From Resend.com for emails

4. **Setup database**

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations
npm run db:migrate
```

5. **Run development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🐘 Setup PostgreSQL với Docker

Cách đơn giản nhất để chạy PostgreSQL database:

```bash
# Copy file cấu hình
cp .env.local .env

# Khởi động PostgreSQL
docker compose -f docker-compose.db.yml up -d

# Setup Prisma
npm run db:generate
npm run db:push

# Chạy ứng dụng
npm run dev
```

Xem hướng dẫn chi tiết (tiếng Việt) tại **[DATABASE_SETUP.md](docs/DATABASE_SETUP.md)**

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System architecture and design patterns
- **[DATABASE_SETUP.md](docs/DATABASE_SETUP.md)** - Setup PostgreSQL với Docker (tiếng Việt)
- **[CSS_TOOLING.md](docs/CSS_TOOLING.md)** - PostCSS & Tailwind CSS v4 explained
- **[SERVER_ACTIONS.md](docs/backend/SERVER_ACTIONS.md)** - Server Actions best practices
- **[BACKEND_AUTH.md](docs/features/BACKEND_AUTH.md)** - Backend Authentication implementation
- **[AUTHENTICATION.md](docs/features/AUTHENTICATION.md)** - Complete auth system documentation
- **[INTERNATIONALIZATION.md](docs/features/INTERNATIONALIZATION.md)** - i18n setup and usage guide

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm run type-check       # TypeScript type checking

# Database
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to database
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database

# Testing
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
npm run test:e2e         # Run E2E tests
npm run test:e2e:ui      # Run E2E tests with UI
```

## 🏛️ Architecture

This project follows a **clean, layered architecture**:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│    (Components, Pages, UI)              │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Server Actions Layer            │
│   (Type-safe server operations)         │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Service Layer                   │
│   (Business logic & orchestration)      │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Repository Layer                │
│   (Database access & queries)           │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Database (PostgreSQL)           │
│   (via Prisma ORM)                      │
└─────────────────────────────────────────┘
```

### Key Principles

- **Separation of Concerns** - Each layer has a specific responsibility
- **Type Safety** - End-to-end TypeScript with Zod validation
- **Testability** - Easy to test with clear boundaries
- **Maintainability** - Clean code structure and documentation
- **Scalability** - Organized for growth

## 🔐 Security

- Password hashing with bcrypt (12 rounds)
- CSRF protection
- SQL injection prevention (Prisma)
- XSS protection
- Environment variable validation
- Rate limiting ready
- Secure session management

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with amazing open-source technologies:

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Zod](https://zod.dev/)
- [TanStack Query](https://tanstack.com/query)

## 📧 Contact

- GitHub: [@luongvucareer](https://github.com/luongvucareer)
- Repository: [venues](https://github.com/luongvucareer/venues)

---

**Happy coding! 🎉**
