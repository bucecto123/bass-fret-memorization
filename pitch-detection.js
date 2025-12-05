// Custom pitch detection using autocorrelation
class PitchDetector {
    constructor(audioContext, analyser) {
        this.audioContext = audioContext;
        this.analyser = analyser;
        this.bufferLength = analyser.frequencyBinCount;
        this.dataArray = new Float32Array(this.bufferLength);
    }

    detectPitch() {
        this.analyser.getFloatTimeDomainData(this.dataArray);
        const pitch = this.autoCorrelate(this.dataArray, this.audioContext.sampleRate);
        return pitch;
    }

    autoCorrelate(buffer, sampleRate) {
        const size = buffer.length;
        const correlations = new Array(size);

        for (let i = 0; i < size; i++) {
            let sum = 0;
            for (let j = 0; j < size - i; j++) {
                sum += buffer[j] * buffer[j + i];
            }
            correlations[i] = sum;
        }

        // Find the first peak
        let lastCorrelation = 1;
        let peakIndex = -1;
        for (let i = 1; i < correlations.length; i++) {
            const correlation = correlations[i];
            if (correlation > lastCorrelation && correlation > 0) {
                peakIndex = i;
                break;
            }
            lastCorrelation = correlation;
        }

        if (peakIndex === -1) return -1;

        // Refine the peak
        let refinedPeak = peakIndex;
        let maxCorrelation = correlations[peakIndex];
        for (let i = peakIndex - 1; i <= peakIndex + 1; i++) {
            if (i >= 0 && i < correlations.length && correlations[i] > maxCorrelation) {
                maxCorrelation = correlations[i];
                refinedPeak = i;
            }
        }

        const period = refinedPeak / sampleRate;
        return 1 / period;
    }
}

let analyser;
let audioContext;
let pitchDetector;

async function initPitchDetection() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        pitchDetector = new PitchDetector(audioContext, analyser);
        return pitchDetector;
    } catch (err) {
        console.error('Error accessing microphone:', err);
        alert('Please allow microphone access');
        return null;
    }
}

function detectPitch() {
    if (!pitchDetector) return -1;
    return pitchDetector.detectPitch();
}

// Function to convert frequency to MIDI
function frequencyToMidi(frequency) {
    return Math.round(12 * Math.log2(frequency / 440) + 69);
}