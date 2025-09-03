# CLAUDE.md - Invoice App Configuration

<!-- Created by Claude Code for project guidance -->

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server (http://localhost:5173/)
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint for code linting
- `npm run preview` - Preview production build locally
- `npm run clean` - Remove dist folder

### Testing
- `npm test` - Run Vitest tests
- `npm run test:watch` - Run Vitest tests in watch mode
- `npm run test:coverage` - Run Vitest tests with coverage reporting

### Styling
- `npm run tailwindcss` - Watch and compile Tailwind CSS classes

## Architecture Overview

### Tech Stack
- **React 19** with TypeScript and Vite
- **Tailwind CSS 4.0** for styling with dark/light theme support
- **Clerk** for user authentication and session management
- **Zustand** for global state management with persistence
- **React Hook Form** for form handling and validation
- **React Router 7** for client-side routing
- **Framer Motion** for animations
- **dayjs** for date handling

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── buttons/        # Button components
│   ├── invoiceForms/   # Form-specific components  
│   ├── invoice/        # Invoice display components
│   └── modals/         # Modal components
├── pages/              # Route components
│   ├── forms/          # Create/Edit invoice pages
│   ├── invoices/       # Invoice list/detail pages
│   └── auth pages      # SignIn/SignUp/Welcome
├── hooks/              # Custom React hooks
├── store/              # Zustand store definitions
├── data/               # Static data (data.json)
└── utils/              # Utility functions
```

### State Management
- **Primary Store**: `src/store/InvoiceStore.tsx` - Zustand store with persistence for invoices
- **Theme Store**: `src/hooks/Theme.ts` - Theme toggle functionality
- **Authentication**: Managed by Clerk provider in App.tsx

### Key Components Architecture
- **Protected Routes**: Authentication wrapper using Clerk's `<SignedIn>` component
- **Layout System**: Responsive flex layout (mobile: column, desktop: row)
- **Theme System**: Dark/light mode with Tailwind classes, persisted in localStorage
- **Invoice Management**: Full CRUD operations with local persistence and filtering

### Authentication Flow
- Unauthenticated users see Welcome/SignIn/SignUp pages
- Authenticated users have access to invoice management features
- User button component from Clerk handles sign out

### Data Models
Key interface in `src/store/InvoiceStore.tsx`:
```typescript
interface Invoice {
    id: string;
    createdAt: string;
    paymentDue: string;
    description: string;
    paymentTerms: number;
    clientName: string;
    clientEmail: string;
    status: string; // "draft" | "pending" | "paid"
    senderAddress: Address;
    clientAddress: Address;
    items: InvoiceItem[];
    total: number;
}
```

## Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ES6+ syntax with ESNext modules
- React functional components with hooks
- Tailwind CSS for all styling (no custom CSS except index.css)

### Authentication Integration
- All invoice-related routes require authentication via Clerk
- Use `useAuth()` hook for authentication state
- Environment variables for Clerk configuration in `.env`

### State Updates
- Invoice operations use Zustand actions (create, update, delete, filter)
- Theme changes automatically apply dark class to document root
- Form data managed with React Hook Form

### Deployment
- Production builds to `dist/` folder
- Deployed on Netlify with `netlify.toml` configuration
- Environment variables configured in deployment platform