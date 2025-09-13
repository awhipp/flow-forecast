# Flow Forecast - Copilot Instructions

Flow Forecast is a standalone HTML/CSS/JavaScript web application that provides monthly period probability calculations using Monte Carlo simulation. It requires no build system, package management, or complex dependencies.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Application Overview
- **Type**: Single-page web application (separate HTML, CSS, and JavaScript files)
- **Dependencies**: No external dependencies (Chart.js removed for pure CSS implementation)
- **Deployment**: Static files served via HTTP server
- **No build system**: No package.json, Makefile, npm scripts, or build tools
- **No testing framework**: No automated tests or testing infrastructure

## Working Effectively

### Repository Structure
```
c:\Users\alexr\OneDrive\Desktop\flow-forecast\
├── .git/
├── .github/
│   └── copilot-instructions.md
├── README.md
├── index.html (main HTML structure)
├── index.css (responsive styles)
└── index.js (optimized Monte Carlo simulation)
```

### Development Environment Setup
Run these commands to set up and test the application:

```bash
cd "c:\Users\alexr\OneDrive\Desktop\flow-forecast"
python -m http.server 8000
```
- **Timing**: Server starts in 1-2 seconds
- **Access**: Open http://localhost:8000/index.html in browser
- **Note**: Server runs indefinitely until stopped with Ctrl+C or `pkill -f "python -m http.server"`

### Validation and Testing

**CRITICAL: Manual Testing Required**
Always manually test the application after making changes by running through these user scenarios:

1. **Start the HTTP server**:
   ```bash
   cd "c:\Users\alexr\OneDrive\Desktop\flow-forecast"
   python -m http.server 8000 &
   ```

2. **Test Complete User Workflow**:
   - Navigate to http://localhost:8000/index.html
   - Verify form loads with default values (today's date, cycle length 28, period length 5)
   - Test month navigation: click "Previous" and "Next" buttons
   - Enter custom values in form fields
   - Click "Calculate Monthly Forecast" button
   - Verify results display with percentage and peak probability day
   - Test auto-calculation when navigating between months

3. **Stop the server**:
   ```bash
   pkill -f "python -m http.server"
   ```

**Expected Results**:
- Application loads within 2-3 seconds
- Form accepts date input and numeric values for cycle/period length
- Month navigation changes displayed month and auto-calculates
- Calculation produces probability percentages (e.g., "100.0%" with "Peak probability: Day 10 (62.7%)")
- All interactions are responsive and functional

### File Editing Guidelines

**Main Application Files**:
- `index.html`: Main HTML structure and document layout
- `index.css`: Complete responsive styling and animations
- `index.js`: Optimized Monte Carlo simulation and UI logic

**Key Functions to Understand**:
- `updateMonthDisplay()`: Updates month navigation display using Intl.DateTimeFormat
- `changeMonth(direction)`: Handles Previous/Next navigation with auto-calculation
- `calculateMonthProbability()`: Core Monte Carlo simulation with performance optimizations
- `drawCalendarHeatmap()`: Creates calendar heat map with DOM fragment optimization

## Common Development Tasks

### Making Code Changes
1. Edit the appropriate file (`index.html`, `index.css`, or `index.js`) directly
2. Test changes immediately by refreshing browser (no build step required)
3. **Always run complete manual validation** after changes

### Debugging Issues
- Use browser developer tools for JavaScript debugging
- Check browser console for errors and performance issues
- Verify responsive design across different screen sizes

### Code Style Guidelines
- Follow existing JavaScript formatting and use modern ES6+ features
- Maintain responsive CSS design patterns with optimized transitions
- Keep Monte Carlo simulation logic efficient (uses timestamp calculations for better performance)
- Use DOM fragments for calendar rendering to minimize layout thrashing

## Timing Expectations
- **Server startup**: 1-2 seconds
- **Page load**: 2-3 seconds (instant loading with no external dependencies)
- **Calculation time**: Under 0.5 seconds for Monte Carlo simulation (optimized with timestamp calculations)
- **No build time**: Application requires no compilation or bundling

## Limitations and Considerations
- **No automated testing**: All validation must be manual
- **No external dependencies**: Pure HTML/CSS/JavaScript implementation
- **Separated file architecture**: HTML, CSS, and JavaScript in separate files for maintainability
- **No package management**: No dependencies to manage
- **No CI/CD**: No GitHub workflows or automated builds

## Security Notes
- Application handles no sensitive data storage
- All calculations performed client-side
- No server-side processing or database connections

## Browser Compatibility
- Requires modern browser with ES6+ support
- Uses native Canvas API for chart rendering
- Responsive design works on mobile and desktop

---

**Remember**: This is a simple, standalone web application. Do not attempt to add build systems, package managers, or testing frameworks unless specifically required. Always validate changes through manual testing of the complete user workflow.