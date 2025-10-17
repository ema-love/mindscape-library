# MindScape Library

A mystical, accessible web application for managing your book collection. Built with vanilla HTML, CSS, and JavaScript featuring advanced regex validation, powerful search capabilities, and a magical user interface.

## Features

### Core Functionality
- **User Authentication**: Register and login with comprehensive regex validation
- **Book Management**: Add, edit, delete books with detailed metadata
- **Advanced Search**: Regex-based live search with highlighted matches
- **Statistics Dashboard**: Total records, page counts, frequent tags, and 7-day trends
- **Import/Export**: JSON-based data portability
- **Theme Toggle**: Light and dark mystical themes

### Accessibility
- Full keyboard navigation
- Skip-to-content links
- ARIA live regions for dynamic content
- Visible focus indicators
- Screen reader support
- Semantic HTML5 structure

### Design
- Responsive mobile-first layout (breakpoints: 360px, 768px, 1024px)
- Irish Grover font for mystical atmosphere
- Particle effects background
- Smooth animations and transitions
- Hover effects with visual feedback

## Technology Stack

- **HTML5**: Semantic markup with ARIA attributes
- **CSS3**: Custom properties, Grid, Flexbox, animations
- **JavaScript (ES6+)**: Vanilla JS, no frameworks
- **LocalStorage API**: Client-side data persistence
- **Google Fonts**: Irish Grover typography

## File Structure

```
mindscape-library/
├── index.html              # Landing page with demo video section
├── register.html           # User registration
├── login.html              # User login
├── library.html            # Main library dashboard
├── tests.html              # Regex pattern testing page
├── seed.json               # Sample data (12 mystical books)
├── styles/
│   └── main.css           # Complete styling with themes
├── scripts/
│   ├── storage.js         # LocalStorage operations
│   ├── validators.js      # Regex validation patterns
│   ├── auth.js            # Authentication logic
│   ├── search.js          # Search and highlighting
│   ├── state.js           # Application state management
│   ├── ui.js              # UI rendering and accessibility
│   ├── library.js         # Library page functionality
│   └── particles.js       # Background particle effects
└── README.md
```

## Regex Catalog

### Authentication Patterns

**Username** (`/^[a-zA-Z0-9_]+$/`)
- Matches: letters, numbers, underscores
- No spaces or special characters
- Example: `moon_scholar`, `user123`

**Email** (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- Standard email format
- Example: `moon@library.com`

**Password (with Lookahead)** (`/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/`)
- Minimum 8 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one digit
- Uses positive lookahead assertions
- Example: `Password123`

### Book Record Patterns

**Title** (`/^\S(?:.*\S)?$/`)
- No leading or trailing whitespace
- Can contain internal spaces
- Example: `Grimoire of Shadows`

**Pages** (`/^(0|[1-9]\d*)$/`)
- Non-negative integers
- No leading zeros (except for 0 itself)
- Example: `320`, `0`

**Date** (`/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/`)
- YYYY-MM-DD format
- Valid month ranges (01-12)
- Valid day ranges (01-31)
- Additional JavaScript validation for invalid dates (e.g., Feb 30)
- Example: `2025-10-16`

**Tag** (`/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/`)
- Letters only
- Optional spaces or hyphens between words
- Example: `Arcane`, `Science-Fiction`, `Epic Fantasy`

**Author Repeated Surname (Backreference)** (`/\b(\w+)\s+\1\b/i`)
- Detects repeated words (warning, not blocking)
- Uses backreference `\1` to match repeated patterns
- Case-insensitive
- Example: Matches `Smith Smith` or `John John`

## Keyboard Navigation

### Global
- `Tab` / `Shift+Tab`: Navigate between interactive elements
- `Enter` / `Space`: Activate buttons and links
- `Esc`: Close modals

### Landing Page
- `Tab` to navigation links
- Skip-to-content link available (press `Tab` on page load)
- Smooth scroll to sections

### Library Dashboard
- `Tab` through search input, action buttons, sort controls, and book cards
- Focus visible on all interactive elements
- Edit/delete buttons accessible via keyboard

### Forms
- `Tab` through form fields
- `Enter` to submit
- Real-time validation feedback
- ARIA live regions announce errors

## Getting Started

### 1. Open the Application

Simply open `index.html` in a modern web browser, or serve the files using a local server:

```bash
python -m http.server 5000
```

Then navigate to `http://localhost:5000`

### 2. Register an Account

1. Click "Register Now" on the landing page
2. Fill in the registration form:
   - Username: letters, numbers, underscores only
   - Email: valid email format
   - Password: ≥8 chars with uppercase, lowercase, number
   - Confirm password must match
3. Submit to create your account

### 3. Login

1. Use your username/email and password
2. Access your personal library dashboard

### 4. Manage Your Library

**Add Books:**
- Click "Add Book" button
- Fill in all required fields (validated with regex)
- Save to add to your collection

**Search:**
- Type in the search bar
- Live filtering across title, author, tag, and pages
- Matches highlighted with `<mark>` tags

**Sort:**
- Click sort buttons (Title, Author, Pages, Date Added)
- Toggle between ascending/descending
- Visual indicators show current sort

**Edit/Delete:**
- Use card action buttons
- Inline editing with validation
- Confirmation dialog for deletions

**View Stats:**
- Click "Stats" button
- See total records, pages, frequent tags, and recent activity

**Import/Export:**
- Export: Downloads JSON file of your library
- Import: Upload JSON file to restore data

### 5. Customize

**Theme Toggle:**
- Click moon/sun icon in header
- Switches between dark and light mystical themes
- Preference saved in localStorage

## Testing

### Manual Testing

Open `tests.html` to see all regex patterns tested with various inputs:
- Username validation
- Email validation
- Password with lookahead
- Title format
- Pages validation
- Date format
- Tag format
- Author repeated surname detection

Each test shows expected vs. actual results with visual pass/fail indicators.

### Testing Checklist

- [ ] Register with valid/invalid credentials
- [ ] Login with correct/incorrect credentials
- [ ] Add book with all valid fields
- [ ] Try adding book with invalid data (test each field)
- [ ] Search for books by various criteria
- [ ] Sort by each column in both directions
- [ ] Edit existing book records
- [ ] Delete book records
- [ ] View statistics dashboard
- [ ] Export library to JSON
- [ ] Import library from JSON
- [ ] Toggle theme (light/dark)
- [ ] Navigate entire app using only keyboard
- [ ] Test on mobile device (responsive design)
- [ ] Test with screen reader

## Sample Data

Load `seed.json` to populate your library with 12 mystical books:
1. Use the Import feature in the library dashboard
2. Select the `seed.json` file
3. Confirm import

Books include titles like "Grimoire of Shadows", "Chronicles of the Ethereal Realm", and "The Alchemist's Codex" with authors like Eldric Moon and Seraphina Nightshade.

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Modern mobile browsers

Requires JavaScript enabled and localStorage support.

## Accessibility Notes

- WCAG 2.1 Level AA compliant
- All interactive elements keyboard accessible
- Color contrast ratios meet accessibility standards
- Dynamic content announced to screen readers
- Semantic HTML5 structure
- ARIA labels and live regions throughout
- No reliance on color alone for information

## Future Enhancements

- Service worker for offline functionality
- CSV export option
- Password hashing for enhanced security
- Advanced search filters (date ranges, multi-tag selection)
- Pagination for large collections
- Sorting persistence across sessions
- Batch operations (delete multiple, bulk edit)
- Book cover image uploads
- Reading progress tracking

## License

This project is for educational purposes demonstrating vanilla web technologies, regex validation, and accessibility best practices.

## Author

Built with ❤️ by ema-love