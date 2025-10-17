# MindScape Library

## Overview

MindScape Library is a mystical-themed, client-side book collection management web application built entirely with vanilla JavaScript, HTML5, and CSS3. The application provides users with capabilities to register accounts, manage book collections, perform advanced searches using regex patterns, view statistics, and import/export data—all while maintaining an enchanting, accessible user experience with particle effects and theme toggling.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Single Page Architecture Pattern**: The application uses a multi-page approach with separate HTML files for different views (landing, registration, login, library dashboard, tests). Each page loads its required JavaScript modules, which are organized as plain ES6 modules using object literals for namespacing.

**State Management**: Centralized client-side state management is handled through the `State` object (`scripts/state.js`), which maintains:
- Current book records collection
- Filtered/searched results
- Sort preferences (field and direction)
- Active search terms
- Editing state for forms

**Component Architecture**: The application uses a modular component pattern with separate concerns:
- `Auth` - Handles user registration, login, and session management
- `Storage` - Abstraction layer for localStorage operations
- `Validators` - Regex-based validation logic for all form inputs
- `UI` - DOM manipulation, rendering, and theme management
- `Search` - Regex search functionality with safe compilation and highlighting
- `State` - Application state management and business logic
- `Particles` - Canvas-based particle animation system

**Rendering Strategy**: Direct DOM manipulation using vanilla JavaScript. The `UI` module handles all rendering, including:
- Dynamic book record lists with search highlighting
- Modal dialogs for add/edit operations
- Statistics dashboard with charts
- Error and success message displays
- ARIA live regions for screen reader announcements

### Design System

**Theming**: CSS custom properties (variables) enable dynamic theme switching between dark and light modes. Theme preferences persist in localStorage.

**Responsive Design**: Mobile-first approach with breakpoints at:
- 360px (small mobile)
- 768px (tablet)
- 1024px (desktop)

**Typography**: Irish Grover font from Google Fonts creates the mystical atmosphere, with system font fallbacks for accessibility.

**Visual Effects**: Canvas-based particle system (`scripts/particles.js`) renders floating particles for atmospheric background effects without impacting performance.

### Data Architecture

**Entity Models**:

1. **User**:
   - id (auto-generated: `user_${timestamp}`)
   - username (unique, alphanumeric with underscores)
   - email (unique, validated format)
   - password (minimum 8 chars, mixed case, numbers)
   - createdAt/updatedAt timestamps

2. **Book Record**:
   - id (auto-generated: `rec_${timestamp}`)
   - title (string, no leading/trailing spaces)
   - author (string)
   - pages (non-negative integer)
   - tag (letters, spaces, hyphens only)
   - dateAdded (YYYY-MM-DD format)
   - createdAt/updatedAt timestamps

**Data Persistence**: All data persists in browser localStorage with these keys:
- `mindscape_users` - Array of user objects
- `mindscape_records` - Array of book records
- `mindscape_current_user` - Active session user
- `mindscape_settings` - User preferences (theme, etc.)

**Data Portability**: Import/export functionality supports JSON format for backing up and restoring book collections.

### Validation System

**Regex-Based Validation**: Comprehensive validation using regular expressions for:
- Username: `/^[a-zA-Z0-9_]+$/`
- Email: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Password: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/` (lookahead assertions)
- Title: `/^\S(?:.*\S)?$/` (no leading/trailing spaces)
- Pages: `/^(0|[1-9]\d*)$/` (non-negative integers)
- Date: `/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/`
- Tag: `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/`

**Advanced Pattern Detection**: Additional validation includes detecting repeated surnames in author names using `/\b(\w+)\s+\1\b/i` for data quality warnings.

### Search Architecture

**Safe Regex Compilation**: Search functionality includes error handling for invalid regex patterns, with automatic fallback to escaped literal search when user-provided patterns fail.

**Search Features**:
- Multi-field search (title, author, tag, pages)
- Case-insensitive matching
- Real-time search with debouncing implied by direct input handling
- Match highlighting using `<mark>` tags
- Regex escaping for literal searches

### Accessibility Architecture

**WCAG Compliance Features**:
- Semantic HTML5 structure (header, nav, main, section, footer)
- Skip-to-content links on all pages
- ARIA labels, roles, and live regions
- Screen reader announcements for state changes
- Visible focus indicators for keyboard navigation
- Form field associations with labels and error messages
- High contrast ratios in both themes

**Keyboard Navigation**: Full keyboard accessibility with focus management for modals, forms, and interactive elements.

### Authentication & Session Management

**Client-Side Authentication**: Simple authentication flow without encryption (suitable for educational/demo purposes):
1. Registration validates and stores user credentials in localStorage
2. Login checks credentials against stored users
3. Session maintained via `mindscape_current_user` in localStorage
4. Auth guard (`Auth.requireAuth()`) protects library page
5. Logout clears session and redirects to landing page

**Security Note**: Current implementation stores passwords in plain text in localStorage. This is acceptable for a client-side demo but would require server-side hashing (bcrypt) and secure session tokens for production use.

## External Dependencies

### Third-Party Services

**Google Fonts**: 
- Irish Grover font family loaded via Google Fonts CDN
- Provides mystical typography aesthetic
- Includes font preconnect optimization

### Browser APIs

**LocalStorage API**: 
- Primary data persistence mechanism
- Stores users, book records, settings, and session data
- No database backend required

**Canvas API**:
- Used for particle effects background animation
- Provides atmospheric visual effects

**HTML5 Form Validation**:
- Native browser validation disabled via `novalidate` attribute
- Custom JavaScript validation provides more granular control

### Development Dependencies

None required - the application is completely self-contained with vanilla HTML, CSS, and JavaScript. No build tools, bundlers, or package managers needed.

### Seed Data

`seed.json` provides 12 sample mystical-themed books for demo/testing purposes with pre-populated metadata including dates spanning October 2025.