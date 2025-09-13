// Global variables
let currentMonthDate = new Date();
let lastCalculatedData = null; // Store last calculation for resize redraw

// Set default values and initialize month navigation
window.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    // Use native toISOString for better performance and shorter code
    const todayStr = today.toISOString().split('T')[0];

    document.getElementById('lastPeriod').value = todayStr;

    // Set current month to next month
    currentMonthDate.setMonth(currentMonthDate.getMonth() + 1);
    updateMonthDisplay();

    // Initialize blank calendar
    initializeBlankCalendar();
});

// Handle window resize to redraw calendar responsively
let resizeTimer;
window.addEventListener('resize', () => {
    if (lastCalculatedData) {
        // Debounce resize events for better performance
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            drawCalendarHeatmap(lastCalculatedData.dailyPercentages, lastCalculatedData.daysInMonth);
        }, 100);
    }
});

// Update the month display
function updateMonthDisplay() {
    // Use native Intl.DateTimeFormat for better performance and fewer hardcoded strings
    const monthDisplay = new Intl.DateTimeFormat('en-US', { 
        month: 'long', 
        year: 'numeric' 
    }).format(currentMonthDate);
    document.getElementById('currentMonth').textContent = monthDisplay;
}

// Change month (direction: -1 for previous, +1 for next)
function changeMonth(direction) {
    currentMonthDate.setMonth(currentMonthDate.getMonth() + direction);
    updateMonthDisplay();

    // Hide progress bar from any previous calculation
    const progressContainer = document.getElementById('progressContainer');
    if (progressContainer) {
        progressContainer.style.display = 'none';
    }

    // Auto-calculate if we have valid inputs
    const inputs = {
        lastPeriod: document.getElementById('lastPeriod').value,
        cycleLength: document.getElementById('cycleLength').value,
        periodLength: document.getElementById('periodLength').value,
        simulations: document.getElementById('simulations').value
    };

    if (inputs.lastPeriod && inputs.cycleLength && inputs.periodLength && inputs.simulations) {
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
    const progressContainer = document.getElementById('progressContainer');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const resultDiv = document.getElementById('result');

    // Show loading state
    button.disabled = true;
    button.innerHTML = '<span class="loading-spinner"></span>Calculating...';
    progressContainer.style.display = 'block';
    resultDiv.textContent = '';

    // Get input values
    const lastPeriod = new Date(document.getElementById('lastPeriod').value);
    const cycleLength = parseInt(document.getElementById('cycleLength').value);
    const periodLength = parseInt(document.getElementById('periodLength').value);
    const simulations = parseInt(document.getElementById('simulations').value);

    if (!lastPeriod || isNaN(cycleLength) || isNaN(periodLength) || isNaN(simulations)) {
        resetCalculationUI(button, originalText, progressContainer);
        resultDiv.textContent = "Please fill all inputs correctly.";
        clearChart();
        return;
    }

    // Cache month calculations for better performance
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Pre-allocate arrays for better performance
    const dailyProbabilities = new Array(daysInMonth).fill(0);
    let anyPeriodInMonth = 0;

    // Constants for optimization
    const firstDayTime = firstDayOfMonth.getTime();
    const lastDayTime = lastDayOfMonth.getTime();
    const dayMs = 24 * 60 * 60 * 1000;

    // Progressive simulation with UI updates
    let completed = 0;
    const batchSize = Math.min(1000, Math.max(100, Math.floor(simulations / 50))); // Adaptive batch size

    function runSimulationBatch() {
        const batchEnd = Math.min(completed + batchSize, simulations);
        
        for (let i = completed; i < batchEnd; i++) {
            // Add variation to cycle and period lengths
            const cycle = cycleLength + (Math.random() * 4 - 2); // +/- 2 days variation
            const period = periodLength + (Math.random() * 2 - 1); // +/- 1 day variation

            // Find all periods that could overlap with the target month
            let nextPeriodTime = lastPeriod.getTime();
            let foundPeriodInMonth = false;
            const cycleMs = cycle * dayMs;
            const periodMs = (period - 1) * dayMs; // period length includes start day

            // Look ahead to find periods that might affect this month
            for (let cycles = 0; cycles < 12; cycles++) { // Check up to 12 cycles ahead
                nextPeriodTime += cycleMs;
                const periodEndTime = nextPeriodTime + periodMs;

                // Check if this period overlaps with our target month
                if (periodEndTime >= firstDayTime && nextPeriodTime <= lastDayTime) {
                    foundPeriodInMonth = true;

                    // Mark each day in the month that has period
                    const periodStartDay = Math.max(1, Math.ceil((nextPeriodTime - firstDayTime) / dayMs) + 1);
                    const periodEndDay = Math.min(daysInMonth, Math.floor((periodEndTime - firstDayTime) / dayMs) + 1);
                    
                    for (let day = periodStartDay; day <= periodEndDay; day++) {
                        dailyProbabilities[day - 1]++;
                    }
                }

                // Stop if we're well past the target month (90 days)
                if (nextPeriodTime > lastDayTime && (nextPeriodTime - lastDayTime) > (90 * dayMs)) {
                    break;
                }
            }

            if (foundPeriodInMonth) {
                anyPeriodInMonth++;
            }
        }

        completed = batchEnd;

        // Update progress
        const progress = (completed / simulations) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${completed.toLocaleString()} / ${simulations.toLocaleString()} simulations`;

        // Continue or finish
        if (completed < simulations) {
            // Continue with next batch
            setTimeout(runSimulationBatch, 1);
        } else {
            // Simulation complete - display results
            finishCalculation();
        }
    }

    function finishCalculation() {
        // Convert counts to percentages
        const dailyPercentages = dailyProbabilities.map(count => (count / simulations) * 100);
        const monthlyChance = (anyPeriodInMonth / simulations) * 100;

        // Find peak probability day
        const maxProbability = Math.max(...dailyPercentages);
        const peakDay = dailyPercentages.indexOf(maxProbability) + 1;

        // Display results
        const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentMonthDate);
        resultDiv.innerHTML =
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

        // Reset UI
        resetCalculationUI(button, originalText, progressContainer);
    }

    function resetCalculationUI(button, originalText, progressContainer) {
        button.disabled = false;
        button.textContent = originalText;
        progressContainer.style.display = 'none';
    }

    // Start the simulation
    setTimeout(runSimulationBatch, 10);
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
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay()); // Start from Sunday of first week

    const endDate = new Date(lastDayOfMonth);
    const daysToAdd = 6 - lastDayOfMonth.getDay(); // Add days to complete the last week
    endDate.setDate(endDate.getDate() + daysToAdd);

    // Create document fragment for better performance
    const fragment = document.createDocumentFragment();

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
    fragment.appendChild(headers);

    // Calendar grid
    const calendar = document.createElement('div');
    calendar.className = 'calendar-heatmap';

    const today = new Date();
    const todayStr = today.toDateString();
    const currentDate = new Date(startDate);

    // Pre-define color mapping for performance
    const getColorForProbability = (probability) => {
        if (probability === 0) return { bg: '#f9fafb', text: '#374151' };
        if (probability <= 25) return { bg: '#fecaca', text: '#374151' };
        if (probability <= 50) return { bg: '#f87171', text: '#ffffff' };
        if (probability <= 75) return { bg: '#ef4444', text: '#ffffff' };
        return { bg: '#dc2626', text: '#ffffff' };
    };

    while (currentDate <= endDate) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';

        const dayOfMonth = currentDate.getDate();
        const isCurrentMonth = currentDate.getMonth() === month;
        const isToday = currentDate.toDateString() === todayStr;

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
            const colors = getColorForProbability(probability);

            dayElement.style.backgroundColor = colors.bg;
            dayElement.style.color = colors.text;

            // Add tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'probability-tooltip';
            tooltip.textContent = `${probability.toFixed(1)}% chance`;
            dayElement.appendChild(tooltip);
        }

        calendar.appendChild(dayElement);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    fragment.appendChild(calendar);

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

        fragment.appendChild(legend);
    }

    // Single DOM update for better performance
    container.appendChild(fragment);
}

// Clear calendar when needed
function clearChart() {
    const container = document.getElementById('calendarHeatmap');
    if (container) {
        container.innerHTML = '';
    }
    lastCalculatedData = null; // Clear stored data
}