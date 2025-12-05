const STRING_TUNINGS = {
  1: { note: "G", octave: 2, midi: 55 },
  2: { note: "D", octave: 2, midi: 50 },
  3: { note: "A", octave: 1, midi: 45 },
  4: { note: "E", octave: 1, midi: 40 }
};

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function midiToNote(midi) {
    const noteIndex = midi % 12;
    const octave = Math.floor(midi / 12) - 1;
    return NOTES[noteIndex] + octave;
}

function getFretForNoteOnString(targetMidi, stringMidi) {
    return targetMidi - stringMidi;
}

function generateRandomPrompt() {
    const string = Math.floor(Math.random() * 4) + 1;
    const fret = Math.floor(Math.random() * 13); // 0-12
    const stringMidi = STRING_TUNINGS[string].midi;
    const targetMidi = stringMidi + fret;
    const note = midiToNote(targetMidi);
    return {
        string,
        fret,
        note,
        midi: targetMidi
    };
}