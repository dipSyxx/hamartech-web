# HamarTech Web Application

A comprehensive festival management platform for **HamarTech** – a week-long technology and creativity festival in Hamar, Norway. This Next.js application provides event discovery, ticket reservation, QR code-based check-in, and user management for the UNESCO Creative City of Media Arts festival.

## 🎯 Overview

HamarTech is a digital festival hub that brings together gaming, XR, digital art, coding, and creative projects in one festival week. The application serves as the central platform for:

- **Event Discovery**: Browse and search through festival events across 5 tracks and 7 days
- **Ticket Management**: Reserve tickets, receive QR codes, and manage reservations
- **Check-in System**: QR code scanning for event entry verification
- **User Profiles**: Personal dashboard for managing reservations and tickets
- **Approver Dashboard**: Admin tools for scanning tickets and managing check-ins

## ✨ Features

### Public Features

- **Homepage**: Hero section, track overview, event preview, and festival information
- **Program Browser**: Full event listing with filtering by track (Creative, Games, XR, Youth, Business) and day
- **Event Details**: Individual event pages with full information, venue details, and reservation options
- **Search & Filter**: Advanced filtering by track, day, and full-text search across events
- **Responsive Design**: Mobile-first design with smooth animations using Framer Motion

### User Features (Authenticated)

- **User Registration**: Email-based registration with verification code system
- **Login**: Email or phone number authentication via NextAuth
- **My Page (`/min-side`)**: Personal dashboard showing:
  - Upcoming and past reservations
  - QR ticket codes for each reservation
  - Profile management (name, phone)
  - Reservation statistics
- **Checkout Flow**: Simple reservation process with quantity selection
- **QR Tickets**: Digital tickets with QR codes for event entry

### Approver/Admin Features

- **QR Scanner**: Camera-based QR code scanner for ticket verification
- **Manual Token Input**: Alternative method for ticket validation
- **Check-in Management**: Record and track attendee check-ins
- **Reservation Details**: View full reservation, user, and event information
- **Check-in History**: Track who checked in and when

### Admin Dashboard Features

- **Comprehensive Statistics**: Real-time dashboard with statistics for all entities
  - User statistics (total, by role, verified/unverified)
  - Event statistics (by track, by day)
  - Venue statistics (by city)
  - Reservation statistics (by status, check-in rate)
  - Check-in statistics (total, recent activity)
  - Audit log overview
- **User Management**: Full CRUD operations for users
  - Create, read, update, delete users
  - Role management (USER, ADMIN, APPROVER)
  - Email verification status management
- **Event Management**: Full CRUD operations for events
  - Create, update, delete events
  - Track and day assignment
  - Venue association
  - Registration and pricing settings
- **Venue Management**: Full CRUD operations for venues
  - Create, read, update, delete venues
  - Map integration (Google Maps, OpenStreetMap)
  - City-based organization
- **Reservation Management**: Enhanced reservation administration
  - View all reservations with filtering
  - Update reservation status (CONFIRMED, WAITLIST, CANCELLED)
  - Delete reservations
  - View check-in history per reservation
- **Check-in Management**: View and manage check-ins
  - List all check-ins with filtering
  - View check-in details (user, event, timestamp, approver)
  - Delete check-ins
- **Audit Logs**: Comprehensive activity tracking
  - View all administrative actions
  - Filter by action type, entity, date
  - See actor information and metadata
- **Advanced Data Tables**: 
  - Search functionality across all entities
  - Multi-column filtering
  - Sortable columns
  - Responsive design (cards on mobile, tables on desktop)

### Technical Features

- **Email Integration**: Maileroo API integration for:
  - Email verification codes
  - Ticket confirmation emails with QR codes
- **QR Code Generation**: Secure, signed QR tokens for ticket validation
- **Audit Logging**: Comprehensive audit trail for admin actions
- **Role-Based Access Control**: USER, ADMIN, and APPROVER roles
- **Database Migrations**: Prisma-based schema management

## 🛠️ Tech Stack

### Core Framework

- **Next.js 16.0.10** (App Router)
- **React 19.2.1**
- **TypeScript 5**

### Authentication & Authorization

- **NextAuth.js 4.24.13**: JWT-based session management
- **bcryptjs 3.0.3**: Password hashing
- **Zod 4.1.13**: Schema validation

### Database & ORM

- **PostgreSQL**: Primary database
- **Prisma 7.1.0**: ORM with custom generated client location
- **@prisma/adapter-pg**: PostgreSQL adapter

### UI & Styling

- **Tailwind CSS 4**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
  - Dialog, Tabs, Slot components
- **Framer Motion 12.23.26**: Animation library
- **Lucide React**: Icon library
- **Sonner 2.0.7**: Toast notifications
- **next-themes**: Theme management

### Forms & Validation

- **React Hook Form 7.68.0**: Form state management
- **@hookform/resolvers**: Zod integration
- **Input OTP 1.4.2**: OTP input component

### QR Code & Scanning

- **qrcode 1.5.4**: QR code generation
- **html5-qrcode 2.3.8**: Browser-based QR scanner

### State Management

- **Zustand 5.0.9**: Lightweight state management for user data

### Email Service

- **Maileroo API**: Transactional email service for verification and tickets

### Development Tools

- **ESLint**: Code linting
- **TypeScript**: Type safety
- **React Compiler**: Babel plugin for React optimization

## 📁 Project Structure

```
hamartech-web/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── (auth)/                   # Authentication routes
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (protected)/               # Protected routes (middleware)
│   │   │   ├── admin/                 # Admin dashboard
│   │   │   │   ├── page.tsx           # Admin dashboard home
│   │   │   │   ├── users/             # User management
│   │   │   │   ├── events/            # Event management
│   │   │   │   ├── venues/            # Venue management
│   │   │   │   ├── reservations/      # Reservation management
│   │   │   │   ├── check-ins/         # Check-in management
│   │   │   │   └── audit-logs/        # Audit log viewer
│   │   │   └── approver/
│   │   │       └── scan/              # QR scanner for approvers
│   │   ├── (site)/                    # Public site routes
│   │   │   ├── page.tsx               # Homepage
│   │   │   ├── program/              # Program listing
│   │   │   │   ├── page.tsx          # Program browser
│   │   │   │   └── [slug]/          # Individual event pages
│   │   │   ├── checkout/[slug]/     # Reservation checkout
│   │   │   └── min-side/             # User dashboard
│   │   ├── api/                      # API routes
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/   # NextAuth handler
│   │   │   │   ├── register/        # User registration
│   │   │   │   └── verify/          # Email verification
│   │   │   ├── admin/                # Admin API routes
│   │   │   │   ├── stats/            # Statistics endpoint
│   │   │   │   ├── users/            # User CRUD
│   │   │   │   ├── events/           # Event CRUD
│   │   │   │   ├── venues/           # Venue CRUD
│   │   │   │   ├── reservations/     # Reservation management
│   │   │   │   ├── check-ins/         # Check-in management
│   │   │   │   └── audit-logs/        # Audit log retrieval
│   │   │   ├── events/              # Event CRUD
│   │   │   ├── reservations/        # Reservation management
│   │   │   ├── approver/
│   │   │   │   ├── scan/             # Ticket scanning
│   │   │   │   └── check-in/        # Check-in processing
│   │   │   ├── qr/                  # QR code generation
│   │   │   └── user/                 # User profile
│   │   └── qr/[token]/              # QR ticket display page
│   ├── components/
│   │   ├── ui/                       # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── spinner.tsx
│   │   │   ├── table.tsx
│   │   │   ├── select.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── ...
│   │   ├── admin/                    # Admin-specific components
│   │   │   ├── admin-nav.tsx         # Admin navigation
│   │   │   ├── stats-cards.tsx       # Statistics cards
│   │   │   ├── data-table.tsx        # Universal data table
│   │   │   ├── user-form.tsx         # User form
│   │   │   ├── event-form.tsx        # Event form
│   │   │   └── venue-form.tsx        # Venue form
│   │   ├── shared/                   # Shared components
│   │   │   ├── header/
│   │   │   ├── footer/
│   │   │   ├── background-glows/
│   │   │   └── intro-gate.tsx
│   │   └── providers/
│   │       └── session-provider.tsx
│   ├── lib/
│   │   ├── auth.ts                   # NextAuth configuration
│   │   ├── prisma.ts                  # Prisma client
│   │   ├── utils.ts                   # Utility functions
│   │   ├── animations/                # Framer Motion presets
│   │   ├── data/                      # Static data & helpers
│   │   │   ├── events.ts
│   │   │   ├── program-meta.ts       # Track & day metadata
│   │   │   ├── reservations.ts
│   │   │   └── venues.ts
│   │   ├── stores/                    # Zustand stores
│   │   │   └── user-store.ts
│   │   ├── tickets/                  # Ticket & QR utilities
│   │   │   ├── qr.ts
│   │   │   └── sign.ts
│   │   └── validation/               # Zod schemas
│   │       └── auth.ts
│   └── prisma/
│       ├── schema.prisma             # Database schema
│       ├── seed.ts                   # Database seeding
│       └── generated/                # Generated Prisma client
├── public/                            # Static assets
├── middleware.ts                      # Route protection middleware
├── next.config.ts                     # Next.js configuration
├── prisma.config.ts                  # Prisma configuration
├── tsconfig.json                      # TypeScript configuration
└── package.json                       # Dependencies
```

## 🗄️ Database Schema

### Core Models

**User**

- Authentication: email (unique), phone (unique), passwordHash
- Role-based access: USER, ADMIN, APPROVER
- Email verification tracking
- Relations: reservations, check-ins, audit logs

**Event**

- Festival events with slug-based URLs
- Track categorization: creative, games, xr, youth, business
- Day assignment: day1 through day7
- Venue relationship
- Registration requirements and pricing flags

**Venue**

- Location information with map integration
- Google Maps and OpenStreetMap URLs
- City-based indexing

**Reservation**

- User-event relationship (unique constraint)
- Status: CONFIRMED, WAITLIST, CANCELLED
- Ticket code generation
- Approval workflow tracking
- Quantity support for multiple tickets

**ReservationCheckIn**

- Check-in history per reservation
- Timestamp and approver tracking

**EmailVerificationCode**

- Secure code hashing
- Expiration management
- One-time use tracking

**PasswordResetToken**

- Secure token hashing
- Expiration and usage tracking

**AuditLog**

- Comprehensive action logging
- JSON metadata support
- Actor tracking

## 🔐 Authentication & Authorization

### Authentication Flow

1. **Registration**: User provides name, phone, email, password
2. **Email Verification**: 6-digit code sent via Maileroo
3. **Login**: Email or phone + password via NextAuth
4. **Session**: JWT-based sessions with role information

### Authorization Levels

- **Public Routes**: Homepage, program, event details
- **Authenticated Routes**: `/min-side`, `/checkout/*`, `/reservations`
- **Approver Routes**: `/approver/*` (requires ADMIN or APPROVER role)
- **Admin Routes**: `/admin/*` (requires ADMIN role only)
  - Full access to admin dashboard
  - User, event, venue, reservation management
  - Check-in and audit log viewing

### Middleware Protection

- Route-based protection via `middleware.ts`
- Automatic redirect to login with callback URL
- Role-based access control for approver routes

## 📡 API Routes

### Authentication

- `POST /api/auth/register` - User registration with email verification
- `POST /api/auth/register/verify` - Email verification code validation
- `GET/POST /api/auth/[...nextauth]` - NextAuth session management

### Events

- `GET /api/events` - List all events
- `GET /api/events/[slug]` - Get single event by slug

### Reservations

- `POST /api/reservations` - Create new reservation
- `GET /api/reservations` - Get user's reservations (authenticated)

### Approver

- `GET /api/approver/scan?token=...` - Validate ticket token
- `POST /api/approver/check-in` - Record check-in

### QR Codes

- `GET /api/qr?token=...&size=...` - Generate QR code image

### User

- `GET /api/user` - Get current user profile

### Admin (ADMIN role required)

- `GET /api/admin/stats` - Get comprehensive statistics for all entities
- `GET /api/admin/users` - List users with filtering
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users` - Update user (including role changes)
- `DELETE /api/admin/users` - Delete user
- `POST /api/admin/events` - Create new event
- `PUT /api/admin/events` - Update event
- `DELETE /api/admin/events` - Delete event
- `GET /api/admin/venues` - List venues
- `POST /api/admin/venues` - Create new venue
- `PUT /api/admin/venues` - Update venue
- `DELETE /api/admin/venues` - Delete venue
- `GET /api/admin/reservations` - List all reservations with filtering
- `PUT /api/admin/reservations` - Update reservation status
- `DELETE /api/admin/reservations` - Delete reservation
- `GET /api/admin/check-ins` - List check-ins with filtering
- `DELETE /api/admin/check-ins` - Delete check-in
- `GET /api/admin/audit-logs` - Get audit logs with filtering

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (or Bun/pnpm/yarn)
- PostgreSQL database
- Maileroo account (for email functionality)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd hamartech-web
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Configure environment variables**
   Set up the following environment variables:

   - `DATABASE_URL` - PostgreSQL connection string
   - `NEXTAUTH_SECRET` - Secret key for NextAuth sessions
   - `NEXTAUTH_URL` - Application URL
   - `NEXT_PUBLIC_APP_URL` - Public application URL
   - `MAILEROO_API_KEY` - Maileroo API key
   - `MAILEROO_FROM_ADDRESS` - Email sender address
   - `MAILEROO_FROM_NAME` - Email sender name
   - `MAILEROO_BRAND_NAME` - Brand name for emails
   - `MAILEROO_SUPPORT_EMAIL` - Support email address
   - `MAILEROO_TEMPLATE_VERIFY_ID` - Email verification template ID
   - `MAILEROO_TEMPLATE_QR_ID` - Ticket email template ID
   - `VERIFY_CODE_TTL_MINUTES` - Verification code expiration time
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Optional: Google Maps API key

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev

   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Start the development server**

   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   bun dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Management

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Create a new migration
npx prisma migrate dev --name migration-name

# View database in Prisma Studio
npx prisma studio

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

### Code Structure Guidelines

- **Pages**: Use Next.js App Router conventions
- **Components**: Reusable UI components in `components/ui/`
- **API Routes**: Server-side logic in `app/api/`
- **Lib**: Shared utilities and configurations
- **Types**: TypeScript types defined inline or in `lib/types/`

## 🎨 UI/UX Features

- **Dark Mode Support**: Theme switching via next-themes
- **Animations**: Smooth page transitions and interactions with Framer Motion
- **Responsive Design**: Mobile-first approach with Tailwind CSS
  - Admin tables: Responsive cards on mobile, full tables on desktop
  - Dialog forms: Fixed header/footer with scrollable content
- **Accessibility**: Radix UI components for ARIA compliance
- **Loading States**: Spinner components and skeleton screens
- **Error Handling**: User-friendly error messages and retry mechanisms
- **Custom Scrollbars**: Brand-themed scrollbars with gradient styling
- **Advanced Data Tables**: Search, filter, and sort functionality
- **Form Validation**: Real-time validation with Zod schemas

## 🔒 Security Features

- **Password Hashing**: bcryptjs with 12 rounds
- **JWT Sessions**: Secure session management via NextAuth
- **Email Verification**: Required before account activation
- **QR Token Signing**: Cryptographically signed ticket tokens
- **Role-Based Access**: Middleware protection for sensitive routes
  - Admin routes protected (ADMIN role only)
  - Approver routes protected (ADMIN or APPROVER roles)
- **Input Validation**: Zod schemas for all user inputs
- **SQL Injection Protection**: Prisma ORM parameterized queries
- **Audit Logging**: All admin actions are logged with actor, action, and metadata
- **Authorization Checks**: Server-side role verification for all admin API routes

## 📧 Email Integration

The application uses Maileroo for transactional emails:

1. **Email Verification**: 6-digit codes sent during registration
2. **Ticket Confirmation**: QR codes and ticket details sent after reservation

Email templates are managed in Maileroo dashboard and referenced by template IDs in environment variables.

## 🎫 QR Code System

### Ticket Generation

- Unique ticket codes generated per reservation
- Signed JWT tokens containing reservation ID and ticket code
- QR codes encode ticket URLs: `/qr/[token]`

### Ticket Validation

- Approvers scan QR codes via camera or manual input
- Token validation checks:
  - Signature verification
  - Expiration (30 days after event end or 1 year)
  - Reservation status (must be CONFIRMED)
  - Duplicate check-in prevention

## 🌍 Festival Tracks

The festival is organized into 5 tracks:

1. **HamarTech:Creative** - Digital art, media arts, installations
2. **HamarTech:Games** - Game testing, e-sports, game development
3. **HamarTech:XR** - VR/AR demos, immersive learning
4. **HamarTech:Youth** - Coding clubs, maker spaces, game jams
5. **HamarTech:Business** - Innovation, business seminars, pitches

## 📱 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Camera access required for QR scanning (HTTPS recommended)

## 🚢 Deployment

### Environment Setup

1. Set all required environment variables in production
2. Ensure PostgreSQL database is accessible
3. Configure Maileroo templates and API keys
4. Set `NEXT_PUBLIC_APP_URL` to production domain

### Build & Deploy

```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Recommended Platforms

- **Vercel**: Optimized for Next.js (recommended)
- **Railway**: Easy PostgreSQL integration
- **DigitalOcean App Platform**: Full-stack deployment
- **Self-hosted**: Docker or Node.js server

### Database Migration in Production

```bash
# Run migrations in production
npx prisma migrate deploy
```

## 📝 License

[Specify your license here]

## 🤝 Contributing

[Add contribution guidelines if applicable]

## 📞 Support

For issues and questions:

- Email: support@hamartech.no
- [Add other support channels]

## 🙏 Acknowledgments

- Built for Hamar – UNESCO Creative City of Media Arts
- Festival organized by Hamar municipality and local partners
