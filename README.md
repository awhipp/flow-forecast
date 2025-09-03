# Flow Forcast

A Period Probability Calculator

A responsive web UI for estimating the probability of having a period on a specific date, with a visual bell curve of probabilities for days around the selected date.

### Features
- **Probability Calculator:** Enter your last period start date, average cycle length, average period length, and a future date to check the probability of having your period on that day.
- **Bell Curve Visualization:** See a chart showing the probability distribution for days before and after your selected date, helping you visualize the likelihood of your period across a range of days.

### How It Works
The app uses a Monte Carlo simulation to estimate the probability:
- It simulates thousands of possible cycles, accounting for natural variation in cycle and period length.
- For each simulation, it checks if the selected date (and nearby days) falls within a simulated period window.
- The results are displayed as a percentage and as a bell curve chart.

### Usage
1. Open `index.html` in your web browser.
2. Enter:
	- The date your last period started
	- Your average cycle length (in days)
	- Your average period length (in days)
	- The future date you want to check
3. Click **Calculate Probability**.
4. View the probability and the bell curve chart below the result.

### Technology
- HTML, CSS (modern, responsive design)
- JavaScript (Monte Carlo simulation)
- [Chart.js](https://www.chartjs.org/) for the bell curve visualization

---
**Disclaimer:** This tool provides estimates for informational purposes only and should not be used for medical decision-making.
# Flow Forecast