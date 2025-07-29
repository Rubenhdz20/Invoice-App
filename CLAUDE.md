# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server (http://localhost:5173/)
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint for code linting
- `npm run preview` - Preview production build locally
- `npm run clean` - Remove dist folder

### Testing
- `npm test` - Run Jest tests
- `npm run test:watch` - Run Jest tests in watch mode
- `npm run test:coverage` - Run Jest tests with coverage reporting

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
