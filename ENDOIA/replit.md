# ENDOIA — Endodontic Diagnostic & Analytics Assistant

## Overview
ENDOIA (Endodontic Diagnostic & Analytics Assistant) is an AI-powered diagnostic support tool for endodontic professionals. Its primary purpose is to assist in pulpal and apical diagnosis using an AI-driven analysis system based on the official AAE-ESE 2025 classification. The application aims to streamline clinical case management, facilitate expert validation by tutors, and provide research insights for investigators.

## User Preferences
I prefer the AI to be concise and to the point.
I value clear architectural explanations over granular code details.
I expect the AI to maintain the established design patterns and technology stack.
I want the AI to understand and respect the defined user roles and their associated permissions.
I prefer that major changes or new features are discussed before implementation, especially concerning the core AI diagnostic logic or external integrations.
Do not make changes to the `attached_assets/` folder.

## System Architecture

### UI/UX Decisions
The frontend is built with React, styled using Tailwind CSS for a modern, responsive design. Radix UI components ensure accessibility and a consistent look and feel. The application incorporates a professional, responsive table design for desktop and card-based views for mobile in the "My Cases" section. Theming is role-based: clinicians get a dark theme, while tutors and investigators use a light theme. Mobile navigation is handled via a hamburger menu (Sheet component) that displays all role-specific navigation options, ensuring full accessibility across all device sizes.

### Technical Implementations
The application follows a full-stack architecture:
-   **Frontend**: React 18, Vite, Tailwind CSS, Radix UI, React Hook Form with Zod, Wouter for routing, and TanStack Query for state management.
-   **Backend**: Node.js 20 with Express 4.x and TypeScript. Minimal backend serving static files and health check endpoint.
-   **Authentication**: Firebase Authentication with Google login is used for user management. A robust role-based access control (RBAC) system is implemented, distinguishing between `clinico`, `tutor`, and `investigador` roles based on verified Firebase email claims.
-   **Database**: **Supabase** (PostgreSQL) as the primary database. Direct client-side connection using `@supabase/supabase-js`. All CRUD operations are performed directly from the frontend.
-   **PWA**: The application is configured as a Progressive Web App (PWA) with a manifest and service worker, enabling installability.

### Feature Specifications
-   **AI Diagnostic Module**: Integrates the AAE-ESE 2025 classification system for pulpal and apical diagnosis (`IA_AAE_ESE.js` and `IA_AAE_ESE_adapter.ts`). Includes automatic clinical recommendations system (`recomendacionesBiblioteca.ts`) that generates personalized guidance based on AAE/ESE 2025, IADT, and ADA/AAE 2024 protocols. Recommendations include: analgesia protocols, action plans, urgency levels (4 tiers), antibiotic indication, and additional clinical notes.
-   **Case Registration**: Clinicians can register new cases with detailed clinical and radiographic data.
-   **Enhanced Clinician Dashboard** (`MisCasos.tsx`): Comprehensive case management panel with advanced analytics (November 2025 upgrade):
    - **Enhanced Statistics**: Top-level cards showing total cases, completed follow-ups, pending controls, and average success rate
    - **Pending Follow-ups Widget**: Interactive cards for 1m, 3m, and 6m pending controls
    - **Cases Table**: Responsive table with intelligent ordering by next pending control; supports filtering by follow-up type or FDI tooth number
    - **Enhanced Case Modal**: Updated diagnosis display with prominent badges for pulpal/apical AI diagnoses and highlighted therapeutic guidance
    - **Complex Cases Indicator**: Automatic detection and percentage of high-complexity cases (PAI≥3, radiolucency, probing>4mm, spontaneous pain)
    - **Data Quality Metrics**: Progress bars tracking notes completion, key field completeness, and control registration rates
    - **Personal Statistics** (Recharts graphs):
      - Monthly case trend (12-month rolling window with line chart)
      - Success rate by treatment type with horizontal bars
      - Pulpal diagnosis distribution using official AAE/ESE 2025 categories (pie chart)
    - **Tooth History**: Collapsible cards grouping cases by FDI tooth number with treatment chronology
    - **Failed Teeth Ranking**: Top 5 teeth with most treatment failures
    - **FDI Heatmap**: Interactive 32-tooth grid showing case distribution; clicking a tooth opens detailed modal
    - **FDI Cases Modal**: Full-featured responsive modal (`CasosPorDienteModal.tsx`) displaying all cases for a specific FDI tooth with table (desktop) and card (mobile) views, showing ID, date, diagnoses, treatment, and status
    - **Modular Architecture**: All dashboard components organized in `client/src/components/clinico/` with shared types (`ClinicoCase`), helpers (`toNumber`, `getDiagnosisColor`, `getCaseQualityScore`), and exports via barrel file (`index.ts`)
    - **Note**: Dashboard does NOT include any IA vs clinician comparison analytics (as per user requirement)
-   **Tutor Validation System**: Expert tutors have a complete validation panel (`CasosPendientes.tsx` and `ValidarCaso.tsx`) that shows ONLY clinical data without exposing AI diagnoses. Tutors view pending cases with statistics, review clinical/radiographic findings, and assign official AEDE/ESE 2025 classifications (Gold Standard) for both pulpal and apical conditions. AI diagnosis fields (`pulpalDxIA`, `apicalDxIA`) are sanitized from sessionStorage and UI to maintain validation integrity.
-   **Investigator Analytics Dashboard**: Comprehensive research analytics panel (`Dashboard.tsx`) with proper validator hierarchy logic:
    - **Validator Hierarchy**: JEN and SEG are primary validators (compared against each other), while INV is a third validator that ONLY intervenes when JEN ≠ SEG to resolve discrepancies
    - **Key Performance Indicators**: Total cases, validated cases, JEN≠SEG discrepancies, complete follow-ups
    - **Temporal Trends**: 12-month rolling window showing new cases, validations, and follow-ups
    - **Diagnostic Distributions**: Pulpal and apical classifications using AEDE/ESE 2025 taxonomy
    - **Primary Validator Agreement (JEN vs SEG)**: Cohen's Kappa, percentage agreement, and confusion matrices for both pulpar and apical diagnoses
    - **Discrepancy Analysis**: Detailed table showing cases where JEN ≠ SEG, displaying all validator labels (JEN, SEG, INV) plus FINAL and IA diagnoses
    - **INV Resolution Statistics**: Analysis of how INV aligns with JEN or SEG in discrepancy cases (counted separately for pulpar and apical)
    - **Validators vs FINAL**: Individual comparison of each validator (JEN, SEG, INV) against the gold-standard FINAL diagnosis
    - **IA Performance Analysis**: AI system compared against JEN, SEG, INV, and FINAL with Kappa coefficients and agreement percentages
    - **Follow-up Success Rates**: Clinical outcomes at 1m, 3m, 6m including both successes and failures in denominators
    - **FDI Tooth Analysis**: Top 10 treated teeth by position
    - **Data Quality Metrics**: Missing field tracking (excluding valid zero values)
    - **Export Functions**: Separate CSV exports for complete dataset and discrepancy table, plus PNG dashboard export
-   **Biblioteca Clínica** (`BibliotecaPage.tsx`): Comprehensive clinical reference library accessible to all roles (clinico, tutor, investigador) added November 2025:
    - **7 Categories**: Clasificación AAE/ESE 2025, Traumatología (IADT), Urgencias Endodónticas, Algoritmos Diagnósticos, Algoritmos de Tratamiento, Recursos Oficiales, FAQ Clínica
    - **Global Search**: Client-side search filtering across all categories by title, subtitle, description, and tags
    - **Tabbed Interface**: Clean, responsive tabs for category navigation with category-specific icons
    - **Content Types**: Multiple content presentation formats (text, tables, lists, step-by-step algorithms, external resource links, collapsible FAQ)
    - **Editable Data Structure**: All content stored in `client/src/data/bibliotecaClinica.ts` with strongly-typed TypeScript interfaces and TODO comments for clinical review
    - **Modular Components**: Organized in `client/src/components/biblioteca/` with separate renderers for each content type (ItemTexto, ItemTabla, ItemLista, ItemAlgoritmo, ItemRecurso, ItemFAQ)
    - **Apple Health Design**: Consistent visual styling with glassmorphic cards, professional color palette, and smooth animations matching clinician dashboard
    - **Note**: Content is structured for easy editing and clinical validation; marked with TODO comments for review by endodontic specialists
-   **Role-based Routing & Navigation**: The application dynamically adjusts navigation and page access based on the authenticated user's role. Current role mappings: ague2206@gmail.com (investigador principal), ague220601@gmail.com (tutor).
-   **Secure API**: All backend endpoints are protected by Firebase token verification and role-based authorization middleware.

### System Design Choices
-   **Monorepo-like Structure**: `client/`, `server/`, and `shared/` folders organize frontend, backend, and common code.
-   **Direct Database Access**: Frontend connects directly to Supabase for all CRUD operations, eliminating the need for backend proxies.
-   **Automated Theming**: UI themes (dark/light) are automatically applied based on the user's role upon login.
-   **Data Privacy for Validation**: Tutor panels use sessionStorage for navigation (due to wouter router limitations) but sanitize AI diagnosis fields to prevent exposure and maintain blind validation integrity.

## External Dependencies

-   **Firebase Authentication**: Used for user authentication via Google accounts.
-   **Supabase**: PostgreSQL database with direct client-side access via `@supabase/supabase-js`. The `cases` table stores all clinical case data including:
    -   Case registration data (case_id, date, clinicoEmail, tooth_fdi, clinical symptoms)
    -   AI diagnoses (AEDE_pulpar_IA, AEDE_apical_IA)
    -   Tutor validations (AEDE_pulpar_JEN/SEG/INV, AEDE_apical_JEN/SEG/INV, validado_JEN/SEG/INV)
    -   Final diagnoses (AEDE_pulpar_FINAL, AEDE_apical_FINAL)
    -   Treatment data (tto_realizado, fecha_tto)
    -   Follow-up controls (control_1m/3m/6m_exito, fecha_control_1m/3m/6m)