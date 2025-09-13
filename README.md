# Flow Forecast

A Monthly Period Probability Calculator

A responsive web UI for forecasting period probabilities across upcoming months, allowing users to navigate through unlimited future months and view probability distributions for each month.

## Features

- **Monthly Forecasting:** Navigate through future months to see period probability predictions for each month
- **Month-by-Month Navigation:** Use Previous/Next buttons to browse through unlimited future months
- **Probability Distribution:** View both overall monthly probability and daily breakdown showing peak probability days
- **Calendar Heat Map:** Visual calendar view with color-coded probability levels for each day of the month
- **Automatic Updates:** Forecasts automatically recalculate when navigating between months

## How It Works

The app uses an advanced Monte Carlo simulation to estimate monthly probabilities:

- Simulates thousands of possible cycles, accounting for natural variation in cycle and period length
- For each month, calculates the probability of having a period on each day of that month
- Provides overall monthly probability plus identification of peak probability days
- Results are displayed with detailed statistics and a color-coded calendar heat map showing probability levels

## Usage

1. Open `index.html` in your web browser.
2. Enter:
   - The date your last period started
   - Your average cycle length (in days)
   - Your average period length (in days)
3. Use the **Previous/Next** buttons to navigate to the month you want to forecast
4. Click **Calculate Monthly Forecast** to see predictions
5. View the monthly probability, peak days, and calendar heat map with color-coded probability levels

## Technology

- HTML, CSS (modern, responsive design)
- JavaScript (Monte Carlo simulation)
- Pure CSS and DOM manipulation for calendar heat map visualization (no external dependencies)

---
**Disclaimer:** This tool provides estimates for informational purposes only and should not be used for medical decision-making.
