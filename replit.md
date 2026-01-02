# BarberBook - Barber Appointment Booking Platform

## Overview

BarberBook is a full-stack web application for booking appointments with barbers across Germany. The platform connects customers with barbers, allowing easy discovery, booking, and management of grooming appointments. Barbers can create profiles, list their services, manage appointments, and view business analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, local React state for UI
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Animations**: Framer Motion for page transitions and UI effects
- **Charts**: Recharts for dashboard analytics
- **Date Handling**: date-fns for date formatting, react-day-picker for calendar components
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ES modules)
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schemas for type-safe request/response validation
- **Build Tool**: esbuild for server bundling, Vite for client bundling

### Data Storage
- **Database**: PostgreSQL via `pg` driver
- **ORM**: Drizzle ORM with drizzle-zod for schema-to-validation integration
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Migrations**: Managed via `drizzle-kit push` command

### Authentication
- **Provider**: Replit Auth (OpenID Connect)
- **Session Storage**: PostgreSQL-backed sessions via `connect-pg-simple`
- **Implementation**: Passport.js with OIDC strategy, located in `server/replit_integrations/auth/`

### Project Structure
```
client/           # React frontend
  src/
    components/   # Reusable UI components
    pages/        # Route-level page components
    hooks/        # Custom React hooks (API calls, auth)
    lib/          # Utilities (queryClient, utils)
server/           # Express backend
  index.ts        # Server entry point
  routes.ts       # API route handlers
  storage.ts      # Database operations (IStorage interface)
  db.ts           # Database connection
  replit_integrations/auth/  # Authentication logic
shared/           # Shared between client/server
  schema.ts       # Drizzle table definitions
  routes.ts       # API route definitions with Zod schemas
  models/auth.ts  # User and session table definitions
```

### Key Design Patterns
- **Shared Types**: Schema definitions in `shared/` ensure type consistency between frontend and backend
- **Storage Interface**: `IStorage` interface in `storage.ts` abstracts database operations
- **Hook-based API Layer**: Custom hooks in `client/src/hooks/` encapsulate all API interactions
- **Type-safe Routes**: Route definitions include HTTP method, path, input schema, and response schemas

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: SQL query builder and schema management

### Authentication
- **Replit Auth**: OIDC-based authentication requiring `ISSUER_URL`, `REPL_ID`, and `SESSION_SECRET` environment variables

### UI Components
- **shadcn/ui**: Pre-built accessible components using Radix UI primitives
- **Radix UI**: Headless UI primitives for dialogs, dropdowns, tabs, etc.
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Frontend dev server with HMR
- **Replit Plugins**: `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner` for enhanced Replit development experience