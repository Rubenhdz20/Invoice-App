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
EOF < /dev/null
# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.

## Claude Code - VS Code Synchronization
**IMPORTANT**: When making file modifications, use bash commands instead of Claude Code's Edit/Write tools to ensure proper synchronization with VS Code/Cursor editors. The Edit/Write tools may not trigger file system events that editors detect.

Examples:
- Use `echo "content" > file.txt` instead of Write tool
- Use `cat >> file.txt << 'EOF'` for appending content
- Use `sed -i 's/old/new/g' file.txt` for find/replace operations

This ensures all file changes are immediately visible in the user's editor.
EOF < /dev/null