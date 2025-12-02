# Design Guidelines: Clinical Education Platform

## Design Approach
**Selected Approach:** Clean Professional System - Medical/Educational Interface
**Justification:** Medical education applications require clarity, trust, and efficiency. Drawing inspiration from modern medical platforms (Epic, Doximity) and educational tools (Canvas, Coursera), prioritizing information hierarchy and professional credibility over visual flair.

**Core Principles:**
- Medical-grade clarity and precision
- Role-based interface differentiation
- Trust through professional restraint
- Efficient information architecture

## Typography System

**Font Families:**
- Primary: Inter (via Google Fonts) - UI elements, body text
- Secondary: JetBrains Mono - Code snippets, AI responses, technical data

**Hierarchy:**
- Page Headers: text-3xl font-semibold (Clinical/Tutor View titles)
- Section Headers: text-xl font-medium
- Subsections: text-lg font-medium
- Body Text: text-base font-normal
- Captions/Meta: text-sm text-gray-600
- AI Responses: text-base font-mono leading-relaxed

## Layout System

**Spacing Primitives:** Tailwind units of 4, 6, 8, and 12
- Component padding: p-6
- Section spacing: space-y-8
- Card margins: gap-6
- Page containers: py-12 px-6

**Container Strategy:**
- Main wrapper: max-w-7xl mx-auto
- Content areas: max-w-4xl for reading-heavy sections
- Two-column layouts: grid-cols-1 lg:grid-cols-2 gap-8 for comparative views

## Navigation & Layout Structure

**Top Navigation Bar:**
- Fixed header with role switcher (Clinical/Tutor toggle)
- Logo/title on left
- User profile and settings on right
- Height: h-16
- Shadow: shadow-sm for subtle elevation

**View Switching:**
- Tab-style navigation between Clinical and Tutor modes
- Active state with bottom border indicator (border-b-2)
- Inactive tabs with hover state
- Icons (Heroicons) accompanying labels

## Component Library

### Core Components

**Clinical View Interface:**
- Case presentation cards with white backgrounds, rounded-lg, shadow-md
- Patient scenario sections with clear visual hierarchy
- AI interaction panel: fixed bottom or side panel
- Input textarea with border-2, rounded-lg, focus:ring-2
- Response display area with bg-gray-50, p-6, rounded-lg
- Action buttons prominently placed

**Tutor View Interface:**
- Dashboard grid showing student progress (grid-cols-1 md:grid-cols-3)
- Case management table with alternating row backgrounds
- Student interaction logs in timeline format
- Analytics cards with key metrics (border-l-4 accent stripe)

### Forms & Inputs
- Text inputs: border-gray-300, rounded-md, px-4 py-2.5
- Focus states: ring-2 ring-offset-2
- Textareas for long-form content: min-h-32
- Select dropdowns with custom styling
- Submit buttons: px-6 py-3 rounded-lg font-medium

### Data Display
- Cards: bg-white rounded-lg shadow p-6
- Tables: Striped rows, hover states, fixed headers for scrolling
- Lists: Divided list items with py-4 spacing
- Status badges: Inline pills with rounded-full, px-3 py-1, text-sm
- Progress indicators for student advancement

### AI Interface Panel
- Distinct visual container: border-2 rounded-xl
- Message bubbles: User (text-right, bg-blue-50) vs AI (text-left, bg-gray-50)
- Typing indicator animation
- Clear input field with send button
- Conversation history scrollable area

### Overlays & Modals
- Confirmation dialogs: Centered, max-w-md, shadow-2xl
- Case detail overlays: Slide-in panel from right (w-96 lg:w-1/3)
- Backdrop: bg-black bg-opacity-50
- Close buttons: Absolute top-right with hover state

## Icons
**Library:** Heroicons (via CDN)
**Usage:**
- Navigation: AcademicCapIcon, UserGroupIcon
- Actions: PaperAirplaneIcon (send), PencilIcon (edit), TrashIcon (delete)
- Status: CheckCircleIcon (complete), ClockIcon (pending), ExclamationCircleIcon (alert)
- Size: w-5 h-5 for inline, w-6 h-6 for buttons

## Animations
**Minimal, purposeful motion:**
- Page transitions: fade-in (200ms)
- AI response: Gentle slide-up with fade
- Tab switching: Quick crossfade
- Button feedback: scale transform on active (scale-95)

## Accessibility
- Semantic HTML throughout (nav, main, section, article)
- ARIA labels for role switcher and interactive elements
- Focus visible states with ring utilities
- Sufficient contrast ratios (WCAG AA minimum)
- Keyboard navigation for all interactive elements
- Screen reader announcements for AI responses

## Images
**No hero images required.** This is a functional application interface.

**Supporting visuals:**
- Placeholder avatars for users (rounded-full w-10 h-10)
- Medical illustration placeholders in case scenarios (if provided)
- Empty state illustrations for no data conditions

## Responsive Behavior
- Mobile: Single column, stacked navigation, collapsible panels
- Tablet: Two-column grids where appropriate
- Desktop: Full three-column layouts for dashboards, side panels visible
- Breakpoints: Standard Tailwind (sm, md, lg, xl)

## Role-Specific Design Distinctions

**Clinical View:** Learner-focused, emphasis on case exploration and AI guidance
- Prominent case display
- Easy-access AI chat interface
- Progress tracking visible but secondary

**Tutor View:** Instructor-focused, analytics and management priority
- Dashboard with overview metrics
- Detailed student interaction logs
- Case creation/editing workflows
- Batch operations for managing multiple students