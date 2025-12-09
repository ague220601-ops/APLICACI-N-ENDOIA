# ENDOIA — Endodontic Diagnostic & Analytics Assistant

## Overview

ENDOIA is an AI-powered diagnostic support tool for endodontic professionals. It assists in pulpal and apical diagnosis using the AAE-ESE 2025 classification system. The platform serves three user roles: clinicians (data entry and case management), tutors (validation without seeing AI diagnoses), and investigators (research analytics). Key features include case registration with clinical forms, AI-powered radiograph analysis using GPT-4o Vision, follow-up tracking, and a clinical reference library.

## User Preferences

Preferred communication style: Simple, everyday language.

Additional preferences:
- Be concise and to the point
- Provide clear architectural explanations over granular code details
- Maintain established design patterns and technology stack
- Understand and respect defined user roles and permissions
- Discuss major changes before implementation, especially for core AI diagnostic logic or external integrations
- Do not make changes to the `attached_assets/` folder

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, bundled with Vite
- **Styling**: Tailwind CSS with CSS variables for theming, supports light/dark modes
- **UI Components**: shadcn/ui built on Radix UI primitives (located in `client/src/components/ui/`)
- **Routing**: Wouter for client-side navigation
- **State Management**: TanStack Query for server state, React Context for auth state
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js 20 with Express 4.x
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful endpoints under `/api/` prefix
- **Build**: esbuild for production bundling

### Authentication & Authorization
- **Provider**: Firebase Authentication with Google Sign-In
- **Role System**: Three roles defined in `client/src/auth/roles.ts`:
  - `clinico` (default) - Case registration and personal dashboard
  - `tutor` - Case validation without AI diagnosis visibility
  - `investigador` - Full research analytics access
- **Route Protection**: `ProtectedRoute` component checks auth state and role permissions

### Database
- **Primary**: Supabase (PostgreSQL) with direct client-side connection via `@supabase/supabase-js`
- **Schema**: Drizzle ORM for type-safe schema definition in `shared/schema.ts`
- **Storage**: Supabase Storage bucket `radiographs` for X-ray images

### AI Integration
- **Vision Analysis**: OpenAI GPT-4o Vision for radiograph analysis
- **Diagnostic Engine**: Custom AAE-ESE 2025 classification logic in `client/src/lib/IA_AAE_ESE_2025.ts`
- **Endpoint**: `/api/vision-analyze` processes images server-side to protect API keys

### PWA Configuration
- **Plugin**: vite-plugin-pwa with auto-update service worker
- **Manifest**: Configured for standalone display with custom icons
- **Offline**: Workbox for caching static assets and Google Fonts

## External Dependencies

### Services
- **Firebase**: Authentication (Google Sign-In), project ID configured via environment
- **Supabase**: PostgreSQL database and file storage, requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- **OpenAI**: GPT-4o Vision API for radiograph analysis, requires `OPENAI_API_KEY`

### Key npm Packages
- `@supabase/supabase-js` - Database client
- `@tanstack/react-query` - Async state management
- `drizzle-orm` / `drizzle-kit` - Database ORM and migrations
- `recharts` - Dashboard charts and analytics
- `openai` - OpenAI API client (server-side only)

### Environment Variables Required
```
DATABASE_URL          # PostgreSQL connection string
VITE_SUPABASE_URL     # Supabase project URL
VITE_SUPABASE_ANON_KEY # Supabase anonymous key
OPENAI_API_KEY        # OpenAI API key for vision analysis
FIREBASE_PROJECT_ID   # Firebase project identifier
```