// =========================================
// STOPWATCH VARIABLES
// =========================================

let startTime = 0;
let elapsedTime = 0;
let lapStartTime = 0;

let animationFrame = null;
let isRunning = false;

let lapNumber = 0;


// =========================================
// GET HTML ELEMENTS
// =========================================

const minutesDisplay =
    document.getElementById("minutes");

const secondsDisplay =
    document.getElementById("seconds");

const millisecondsDisplay =
    document.getElementById("milliseconds");

const startButton =
    document.getElementById("startBtn");

const pauseButton =
    document.getElementById("pauseBtn");

const lapButton =
    document.getElementById("lapBtn");

const resetButton =
    document.getElementById("resetBtn");

const lapList =
    document.getElementById("lapList");

const lapCount =
    document.getElementById("lapCount");

const emptyMessage =
    document.getElementById("emptyMessage");


// =========================================
// FORMAT TIME
// =========================================

function formatTime(time) {

    time = Math.max(0, Math.floor(time));

    const minutes =
        Math.floor(time / 60000);

    const seconds =
        Math.floor((time % 60000) / 1000);

    const milliseconds =
        time % 1000;

    return {
        minutes: String(minutes).padStart(2, "0"),

        seconds: String(seconds).padStart(2, "0"),

        milliseconds:
            String(milliseconds).padStart(3, "0")
    };
}


// =========================================
// UPDATE DISPLAY
// =========================================

function updateDisplay() {

    const time = formatTime(elapsedTime);

    minutesDisplay.textContent =
        time.minutes;

    secondsDisplay.textContent =
        time.seconds;

    millisecondsDisplay.textContent =
        time.milliseconds;
}


// =========================================
// RUN STOPWATCH
// =========================================

function updateStopwatch(currentTime) {

    if (!isRunning) {
        return;
    }

    /*
        performance.now() provides accurate
        high-resolution timing.
    */

    elapsedTime =
        currentTime - startTime;

    updateDisplay();

    animationFrame =
        requestAnimationFrame(updateStopwatch);
}


// =========================================
// START
// =========================================

function startStopwatch() {

    /*
        Prevent multiple timers from running.
    */

    if (isRunning) {
        return;
    }

    isRunning = true;

    /*
        Continue from the existing elapsed time
        if the stopwatch was previously paused.
    */

    startTime =
        performance.now() - elapsedTime;

    lapStartTime =
        performance.now() -
        (elapsedTime - lapStartTime);

    animationFrame =
        requestAnimationFrame(updateStopwatch);

    // Button states
    startButton.disabled = true;

    pauseButton.disabled = false;

    lapButton.disabled = false;
}


// =========================================
// PAUSE
// =========================================

function pauseStopwatch() {

    if (!isRunning) {
        return;
    }

    /*
        Capture the exact time before pausing.
    */

    elapsedTime =
        performance.now() - startTime;

    isRunning = false;

    if (animationFrame !== null) {

        cancelAnimationFrame(animationFrame);

        animationFrame = null;
    }

    updateDisplay();

    // Button states
    startButton.disabled = false;

    pauseButton.disabled = true;

    lapButton.disabled = true;
}


// =========================================
// RESET
// =========================================

function resetStopwatch() {

    isRunning = false;

    if (animationFrame !== null) {

        cancelAnimationFrame(animationFrame);

        animationFrame = null;
    }

    // Reset timing
    startTime = 0;

    elapsedTime = 0;

    lapStartTime = 0;

    lapNumber = 0;

    // Reset display
    updateDisplay();

    // Remove lap records
    lapList.innerHTML = "";

    // Reset lap counter
    lapCount.textContent = "0 Laps";

    // Show empty message
    emptyMessage.style.display = "block";

    // Reset buttons
    startButton.disabled = false;

    pauseButton.disabled = true;

    lapButton.disabled = true;
}


// =========================================
// RECORD LAP
// =========================================

function recordLap() {

    /*
        Lap only works while stopwatch is running.
    */

    if (!isRunning) {
        return;
    }

    /*
        Get current stopwatch time.
    */

    const currentTime =
        performance.now();

    elapsedTime =
        currentTime - startTime;

    /*
        Calculate time since previous lap.
    */

    const lapTime =
        elapsedTime - lapStartTime;

    lapStartTime =
        elapsedTime;

    lapNumber++;

    const lapFormatted =
        formatTime(lapTime);

    const totalFormatted =
        formatTime(elapsedTime);


    // =========================================
    // CREATE LAP ITEM
    // =========================================

    const listItem =
        document.createElement("li");

    listItem.className =
        "lap-item";


    // Lap number
    const number =
        document.createElement("span");

    number.className =
        "lap-number";

    number.textContent =
        `Lap ${lapNumber}`;


    // Lap time
    const time =
        document.createElement("span");

    time.className =
        "lap-time";

    time.innerHTML = `
        ${lapFormatted.minutes}:${lapFormatted.seconds}:${lapFormatted.milliseconds}
        <span class="lap-total">
            Total: ${totalFormatted.minutes}:${totalFormatted.seconds}:${totalFormatted.milliseconds}
        </span>
    `;


    // Add elements
    listItem.appendChild(number);

    listItem.appendChild(time);


    /*
        Newest lap appears at the top.
    */

    lapList.prepend(listItem);


    // Hide empty message
    emptyMessage.style.display =
        "none";


    // Update lap count
    lapCount.textContent =
        `${lapNumber} ${lapNumber === 1 ? "Lap" : "Laps"}`;
}


// =========================================
// BUTTON EVENTS
// =========================================

startButton.addEventListener(
    "click",
    startStopwatch
);

pauseButton.addEventListener(
    "click",
    pauseStopwatch
);

lapButton.addEventListener(
    "click",
    recordLap
);

resetButton.addEventListener(
    "click",
    resetStopwatch
);


// =========================================
// INITIAL STATE
// =========================================

updateDisplay();
