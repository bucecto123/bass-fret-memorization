let detector;
let currentPrompt;
let isActive = false;

const startBtn = document.getElementById('startBtn');
const promptDiv = document.getElementById('prompt');
const notePrompt = document.getElementById('notePrompt');
const feedback = document.getElementById('feedback');

startBtn.addEventListener('click', startTraining);

async function startTraining() {
    if (isActive) return;
    isActive = true;
    startBtn.style.display = 'none';
    feedback.textContent = '';

    detector = await initPitchDetection();
    if (!detector) {
        startBtn.style.display = 'block';
        isActive = false;
        return;
    }

    nextPrompt();
    detectLoop();
}

function nextPrompt() {
    currentPrompt = generateRandomPrompt();
    notePrompt.textContent = `Play fret ${currentPrompt.fret} on string ${currentPrompt.string} (${currentPrompt.note})`;
    promptDiv.style.display = 'block';
    feedback.textContent = '';

    // Remove timeout, just wait for correct note
}

function detectLoop() {
    if (!isActive) return;

    const frequency = detectPitch();
    if (frequency > 0) {
        const detectedMidi = frequencyToMidi(frequency);
        if (Math.abs(detectedMidi - currentPrompt.midi) <= 0.5) {
            // Correct
            feedback.textContent = 'Correct!';
            setTimeout(nextPrompt, 1000);
        }
    }

    requestAnimationFrame(detectLoop);
}

function stopTraining() {
    isActive = false;
    promptDiv.style.display = 'none';
    startBtn.style.display = 'block';
    feedback.textContent = '';
}