# Flow Forecast - Copilot Instructions

Flow Forecast is a standalone HTML/CSS/JavaScript web application that provides monthly period probability calculations using Monte Carlo simulation. It requires no build system, package management, or complex dependencies.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Application Overview
- **Type**: Single-page web application (index.html with embedded CSS/JavaScript)
- **Dependencies**: Chart.js library loaded from CDN (https://cdn.jsdelivr.net/npm/chart.js)
- **Deployment**: Static files served via HTTP server
- **No build system**: No package.json, Makefile, npm scripts, or build tools
- **No testing framework**: No automated tests or testing infrastructure

## Working Effectively

### Repository Structure
```
/home/runner/work/flow-forecast/flow-forecast/
├── .git/
├── README.md
└── index.html (18,882 bytes - complete application)
```

### Development Environment Setup
Run these commands to set up and test the application:

```bash
cd /home/runner/work/flow-forecast/flow-forecast
python3 -m http.server 8000
```
- **Timing**: Server starts in 1-2 seconds
- **Access**: Open http://localhost:8000/index.html in browser
- **Note**: Server runs indefinitely until stopped with Ctrl+C or `pkill -f "python3 -m http.server"`

### Validation and Testing

**CRITICAL: Manual Testing Required**
Always manually test the application after making changes by running through these user scenarios:

1. **Start the HTTP server**:
   ```bash
   cd /home/runner/work/flow-forecast/flow-forecast
   python3 -m http.server 8000 &
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
   pkill -f "python3 -m http.server"
   ```

**Expected Results**:
- Application loads within 2-3 seconds
- Form accepts date input and numeric values for cycle/period length
- Month navigation changes displayed month and auto-calculates
- Calculation produces probability percentages (e.g., "100.0%" with "Peak probability: Day 10 (62.7%)")
- All interactions are responsive and functional

### File Editing Guidelines

**Main Application File**: `/home/runner/work/flow-forecast/flow-forecast/index.html`
- Contains complete application: HTML structure, CSS styling, and JavaScript logic
- JavaScript starts at line 166 with `<script>` tag
- External dependency: Chart.js CDN link at line 165
- Application logic includes Monte Carlo simulation for probability calculations
- Global variables: `currentMonthDate`, `chart`

**Key Functions to Understand**:
- `updateMonthDisplay()`: Updates month navigation display
- `changeMonth(direction)`: Handles Previous/Next navigation
- `calculateForecast()`: Core Monte Carlo simulation logic
- `updateChart()`: Creates/updates probability distribution chart

## Common Development Tasks

### Making Code Changes
1. Edit `/home/runner/work/flow-forecast/flow-forecast/index.html` directly
2. Test changes immediately by refreshing browser (no build step required)
3. **Always run complete manual validation** after changes

### Debugging Issues
- Use browser developer tools for JavaScript debugging
- Check browser console for errors (especially Chart.js loading issues)
- Verify CDN connectivity if chart functionality fails

### Code Style Guidelines
- Follow existing JavaScript formatting in the file
- Maintain responsive CSS design patterns
- Keep Monte Carlo simulation logic efficient (currently processes thousands of cycles)

## Timing Expectations
- **Server startup**: 1-2 seconds
- **Page load**: 2-3 seconds (depends on CDN loading)
- **Calculation time**: Under 1 second for Monte Carlo simulation
- **No build time**: Application requires no compilation or bundling

## Limitations and Considerations
- **No automated testing**: All validation must be manual
- **CDN dependency**: Chart.js must load from external source
- **Single file architecture**: All code contained in one HTML file
- **No package management**: Dependencies managed via CDN links
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