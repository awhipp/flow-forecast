// Global variables
let currentMonthDate = new Date();
let lastCalculatedData = null; // Store last calculation for resize redraw

// Set default values and initialize month navigation
window.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    const pad = n => n.toString().padStart(2, '0');
    const yyyy = today.getFullYear();
    const mm = pad(today.getMonth() + 1);
    const dd = pad(today.getDate());
    const todayStr = `${yyyy}-${mm}-${dd}`;

    document.getElementById('lastPeriod').value = todayStr;

    // Set current month to next month
    currentMonthDate.setMonth(currentMonthDate.getMonth() + 1);
    updateMonthDisplay();
    
    // Initialize blank calendar
    initializeBlankCalendar();
});

// Handle window resize to redraw calendar responsively
window.addEventListener('resize', () => {
    if (lastCalculatedData) {
        // Small delay to ensure layout has updated
        setTimeout(() => {
            drawCalendarHeatmap(lastCalculatedData.dailyPercentages, lastCalculatedData.daysInMonth);
        }, 100);
    }
});

// Update the month display
function updateMonthDisplay() {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const monthDisplay = `${monthNames[currentMonthDate.getMonth()]} ${currentMonthDate.getFullYear()}`;
    document.getElementById('currentMonth').textContent = monthDisplay;
}

// Change month (direction: -1 for previous, +1 for next)
function changeMonth(direction) {
    currentMonthDate.setMonth(currentMonthDate.getMonth() + direction);
    updateMonthDisplay();

    // Auto-calculate if we have valid inputs
    const lastPeriod = document.getElementById('lastPeriod').value;
    const cycleLength = document.getElementById('cycleLength').value;
    const periodLength = document.getElementById('periodLength').value;
    const simulations = document.getElementById('simulations').value;

    if (lastPeriod && cycleLength && periodLength && simulations) {
        calculateMonthProbability();
    } else {
        // Show blank calendar if inputs are not complete
        initializeBlankCalendar();
    }
}

// Main calculation function for monthly forecast
function calculateMonthProbability() {
    const button = document.querySelector('button[onclick="calculateMonthProbability()"]');
    const originalText = button.textContent;
    
    // Show loading state
    button.disabled = true;
    button.innerHTML = '<span class="loading-spinner"></span>Calculating...';
    
    // Use setTimeout to allow UI to update before starting computation
    setTimeout(() => {
        try {
            const lastPeriod = new Date(document.getElementById('lastPeriod').value);
            const cycleLength = parseInt(document.getElementById('cycleLength').value);
            const periodLength = parseInt(document.getElementById('periodLength').value);
            const simulations = parseInt(document.getElementById('simulations').value);

            if (!lastPeriod || isNaN(cycleLength) || isNaN(periodLength) || isNaN(simulations)) {
                document.getElementById('result').textContent = "Please fill all inputs correctly.";
                clearChart();
                return;
            }

    // Get the first and last day of the current viewing month
    const firstDayOfMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Monte Carlo simulation
    const dailyProbabilities = Array(daysInMonth).fill(0);
    let anyPeriodInMonth = 0;

    for (let i = 0; i < simulations; i++) {
        // Add variation to cycle and period lengths
        const cycle = cycleLength + (Math.random() * 4 - 2); // +/- 2 days variation
        const period = periodLength + (Math.random() * 2 - 1); // +/- 1 day variation

        // Find all periods that could overlap with the target month
        let nextPeriodStart = new Date(lastPeriod);
        let foundPeriodInMonth = false;

        // Look ahead to find periods that might affect this month
        for (let cycles = 0; cycles < 12; cycles++) { // Check up to 12 cycles ahead
            nextPeriodStart.setDate(nextPeriodStart.getDate() + cycle);

            const periodStart = new Date(nextPeriodStart);
            const periodEnd = new Date(nextPeriodStart);
            periodEnd.setDate(periodStart.getDate() + period - 1); // period length includes start day

            // Check if this period overlaps with our target month
            if (periodEnd >= firstDayOfMonth && periodStart <= lastDayOfMonth) {
                foundPeriodInMonth = true;

                // Mark each day in the month that has period
                for (let day = 1; day <= daysInMonth; day++) {
                    const checkDate = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), day);
                    if (checkDate >= periodStart && checkDate <= periodEnd) {
                        dailyProbabilities[day - 1]++;
                    }
                }
            }

            // Stop if we're well past the target month
            if (nextPeriodStart > lastDayOfMonth &&
                (nextPeriodStart.getTime() - lastDayOfMonth.getTime()) > (90 * 24 * 60 * 60 * 1000)) {
                break;
            }
        }

        if (foundPeriodInMonth) {
            anyPeriodInMonth++;
        }
    }

    // Convert counts to percentages
    const dailyPercentages = dailyProbabilities.map(count => (count / simulations) * 100);
    const monthlyChance = (anyPeriodInMonth / simulations) * 100;

    // Find peak probability day
    const maxProbability = Math.max(...dailyPercentages);
    const peakDay = dailyPercentages.indexOf(maxProbability) + 1;

    // Display results
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentMonthDate);
    document.getElementById('result').innerHTML =
        `<strong>${monthName}</strong><br>` +
        `Chance of period: <strong>${monthlyChance.toFixed(1)}%</strong><br>` +
        `Peak probability: Day ${peakDay} (${maxProbability.toFixed(1)}%)`;

    // Store data for resize redraw
    lastCalculatedData = {
        dailyPercentages: dailyPercentages,
        daysInMonth: daysInMonth
    };

    // Create calendar heat map
    drawCalendarHeatmap(dailyPercentages, daysInMonth);
        } finally {
            // Restore button state
            button.disabled = false;
            button.textContent = originalText;
        }
    }, 10); // Small delay to allow UI update
}

// Initialize blank calendar without probability data
function initializeBlankCalendar() {
    const lastDayOfMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    drawCalendarHeatmap(null, daysInMonth);
}

// Draw the calendar heat map
function drawCalendarHeatmap(dailyPercentages, daysInMonth) {
    const container = document.getElementById('calendarHeatmap');
    container.innerHTML = '';

    // Create calendar structure
    const firstDayOfMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 0);
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay()); // Start from Sunday of first week

    const endDate = new Date(lastDayOfMonth);
    const daysToAdd = 6 - lastDayOfMonth.getDay(); // Add days to complete the last week
    endDate.setDate(endDate.getDate() + daysToAdd);

    // Day headers
    const headers = document.createElement('div');
    headers.className = 'calendar-headers';
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        headers.appendChild(header);
    });
    container.appendChild(headers);

    // Calendar grid
    const calendar = document.createElement('div');
    calendar.className = 'calendar-heatmap';

    const today = new Date();
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';

        const dayOfMonth = currentDate.getDate();
        const isCurrentMonth = currentDate.getMonth() === currentMonthDate.getMonth();
        const isToday = currentDate.toDateString() === today.toDateString();

        dayElement.textContent = dayOfMonth;

        if (!isCurrentMonth) {
            dayElement.classList.add('other-month');
        }

        if (isToday) {
            dayElement.classList.add('today');
        }

        // Add probability styling for current month days
        if (isCurrentMonth && dailyPercentages && dailyPercentages.length > 0) {
            const probability = dailyPercentages[dayOfMonth - 1] || 0;

            // Determine color based on probability ranges
            let backgroundColor, textColor;
            if (probability === 0) {
                backgroundColor = '#f9fafb'; // Very light gray
                textColor = '#374151';
            } else if (probability <= 25) {
                backgroundColor = '#fecaca'; // Light red
                textColor = '#374151';
            } else if (probability <= 50) {
                backgroundColor = '#f87171'; // Medium-light red
                textColor = '#ffffff';
            } else if (probability <= 75) {
                backgroundColor = '#ef4444'; // Medium red
                textColor = '#ffffff';
            } else {
                backgroundColor = '#dc2626'; // Dark red
                textColor = '#ffffff';
            }

            dayElement.style.backgroundColor = backgroundColor;
            dayElement.style.color = textColor;

            // Add tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'probability-tooltip';
            tooltip.textContent = `${probability.toFixed(1)}% chance`;
            dayElement.appendChild(tooltip);
        }

        calendar.appendChild(dayElement);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    container.appendChild(calendar);

    // Add legend only when there's probability data
    if (dailyPercentages && dailyPercentages.length > 0) {
        const legend = document.createElement('div');
        legend.className = 'calendar-legend';
        
        const legendItems = [
            { color: '#f9fafb', label: '0%' },
            { color: '#fecaca', label: '1-25%' },
            { color: '#f87171', label: '26-50%' },
            { color: '#ef4444', label: '51-75%' },
            { color: '#dc2626', label: '75%+' }
        ];

        legendItems.forEach(item => {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            
            const colorBox = document.createElement('div');
            colorBox.className = 'legend-color';
            colorBox.style.backgroundColor = item.color;
            
            const label = document.createElement('span');
            label.textContent = item.label;
            
            legendItem.appendChild(colorBox);
            legendItem.appendChild(label);
            legend.appendChild(legendItem);
        });

        container.appendChild(legend);
    }
}// Clear calendar when needed
function clearChart() {
    const container = document.getElementById('calendarHeatmap');
    if (container) {
        container.innerHTML = '';
    }
    lastCalculatedData = null; // Clear stored data
}