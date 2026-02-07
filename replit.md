# Ambi's Cafe - Campus Food Pre-ordering System

## Overview

This is a full-stack campus canteen pre-ordering application called "Ambi's Cafe". Students can browse the menu, add items to their cart, place pre-orders, and receive QR codes for quick pickup. Shopkeepers have an admin dashboard to manage orders, update menu items, and scan QR codes to confirm pickups.

The application follows a monorepo structure with a React frontend (Vite), Express backend, and PostgreSQL database using Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with hot module replacement
- **Routing**: Wouter (lightweight React router)
- **State Management**: 
  - TanStack React Query for server state and caching
  - React Context for client-side cart state (persisted to localStorage)
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints under `/api/*` prefix
- **Session Management**: express-session with PostgreSQL session store (connect-pg-simple)
- **Authentication**: Custom mobile-based auth system with two user types:
  - Students: Mobile number + OTP verification
  - Admins: Mobile number + password authentication

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` - shared between frontend and backend
- **Migrations**: Drizzle Kit with `drizzle-kit push` for schema synchronization
- **Key Tables**:
  - `students` - Student accounts with mobile/OTP auth
  - `admins` - Admin accounts with mobile/password auth
  - `products` - Menu items with pricing and availability
  - `orders` - Order records with status tracking
  - `orderItems` - Order line items linking products to orders
  - `sessions` - PostgreSQL-backed session storage

### Project Structure
```
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # UI components including shadcn/ui
│   │   ├── hooks/       # Custom React hooks (auth, cart, orders, products)
│   │   ├── pages/       # Route page components
│   │   └── lib/         # Utilities and query client
├── server/              # Backend Express application
│   ├── routes.ts        # API route definitions
│   ├── storage.ts       # Database access layer
│   └── db.ts            # Database connection
├── shared/              # Shared code between frontend and backend
│   ├── schema.ts        # Drizzle database schema
│   └── routes.ts        # API route type definitions with Zod
└── migrations/          # Database migrations
```

### Authentication Flow
- Students authenticate via mobile OTP (6-digit code sent to phone)
- Admins authenticate via mobile number and password
- Sessions stored in PostgreSQL with 7-day TTL
- Protected routes check session middleware on the backend

### Order Flow
1. Student browses menu and adds items to cart (client-side state)
2. Student places order with payment method selection (COD or GPay)
3. System generates order with unique ID
4. Student receives QR code containing order ID
5. Shopkeeper scans QR code to view order details
6. Shopkeeper confirms order and marks as completed

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### UI Libraries
- **Radix UI**: Accessible component primitives (dialog, dropdown, tabs, etc.)
- **shadcn/ui**: Pre-built component library on top of Radix
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **react-qr-code**: QR code generation for order pickups

### State & Data Fetching
- **TanStack React Query**: Server state management and caching
- **Zod**: Schema validation for API requests/responses

### Authentication & Sessions
- **express-session**: Session middleware
- **connect-pg-simple**: PostgreSQL session store

### Build & Development
- **Vite**: Frontend build tool with React plugin
- **esbuild**: Server bundling for production
- **tsx**: TypeScript execution for development

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret for session cookie signing

### Default Credentials (Demo)
- **Admin**: Mobile: 9999999999, Password: admin123

### Currency & Formatting
- All prices displayed in Indian Rupees (₹)
- Order IDs shown as 4-digit zero-padded numbers (e.g., #0001)

### Payment Methods
- **Razorpay**: Online payment (integration pending)
- **Pay at Counter**: Cash payment at pickup