let pitchDetector;
let currentPrompt;
let timerInterval;
let timeoutTimer;
let isActive = false;

const startBtn = document.getElementById('startBtn');
const promptDiv = document.getElementById('prompt');
const notePrompt = document.getElementById('notePrompt');
const timerEl = document.getElementById('timer');
const feedback = document.getElementById('feedback');

startBtn.addEventListener('click', startTraining);

async function startTraining() {
    if (isActive) return;
    isActive = true;
    startBtn.style.display = 'none';
    feedback.textContent = '';

    const pd = await initPitchDetection();
    if (!pd) {
        startBtn.style.display = 'block';
        isActive = false;
        return;
    }
    pitchDetector = pd;

    nextPrompt();
    detectLoop();
}

function nextPrompt() {
    currentPrompt = generateRandomPrompt();
    notePrompt.textContent = `Play ${currentPrompt.note} on string ${currentPrompt.string}`;
    promptDiv.style.display = 'block';
    timerEl.textContent = '5';
    feedback.textContent = '';

    let timeLeft = 5;
    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showSolution();
        }
    }, 1000);

    timeoutTimer = setTimeout(showSolution, 5000);
}

function showSolution() {
    clearInterval(timerInterval);
    clearTimeout(timeoutTimer);
    feedback.textContent = `Time’s up! The note is at fret ${currentPrompt.fret} on string ${currentPrompt.string}`;
    setTimeout(nextPrompt, 2000);
}

function detectLoop() {
    if (!isActive) return;

    const frequency = detectPitch();
    if (frequency > 0) {
        const detectedMidi = frequencyToMidi(frequency);
        if (Math.abs(detectedMidi - currentPrompt.midi) <= 0.5) {
            // Correct
            clearInterval(timerInterval);
            clearTimeout(timeoutTimer);
            feedback.textContent = 'Correct!';
            setTimeout(nextPrompt, 1000);
        }
    }

    requestAnimationFrame(detectLoop);
}

function stopTraining() {
    isActive = false;
    clearInterval(timerInterval);
    clearTimeout(timeoutTimer);
    promptDiv.style.display = 'none';
    startBtn.style.display = 'block';
    feedback.textContent = '';
}