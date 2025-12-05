// Using Pitchy library for pitch detection
let pitchDetector;
let analyser;
let audioContext;

async function initPitchDetection() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        pitchDetector = Pitchy.PitchDetector.forFloat32Array(analyser.fftSize);
        return { pitchDetector, analyser };
    } catch (err) {
        console.error('Error accessing microphone:', err);
        alert('Please allow microphone access');
        return null;
    }
}

function detectPitch() {
    if (!analyser) return -1;
    const input = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(input);
    const [pitch, clarity] = pitchDetector.findPitch(input, audioContext.sampleRate);
    return pitch;
}

// Function to convert frequency to MIDI
function frequencyToMidi(frequency) {
    return Math.round(12 * Math.log2(frequency / 440) + 69);
}