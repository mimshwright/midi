const OCTAVE = [
  "C",
  "C#/Db",
  "D",
  "D#/Eb",
  "E",
  "F",
  "F#/Gb",
  "G",
  "G#/Ab",
  "A",
  "A#/Bb",
  "B"
];

function makeMidiNoteMappings() {
  const notes = {};

  for (let i = 21; i <= 108; i += 1) {
    notes[i] = OCTAVE[i % 12];
  }

  return notes;
}

function makeNoteCoords() {
  const NOTES = {};
  let yPos = 134.5;

  for (let i = 41; i <= 79; i += 1) {
    if (i === 60) yPos = 65.5;
    NOTES[i] = yPos;
    yPos -= 5;
    if (![47, 52, 59, 64, 71, 76].includes(i)) i += 1;
  }

  return NOTES;
}

const NOTE_COORDS = makeNoteCoords();
const MIDI_NOTE_MAPPINGS = makeMidiNoteMappings();

function midiInit(cb) {
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then((access) => {
      const inputs = access.inputs.values();
      const notes = [];

      for (const input of inputs) {
        input.onmidimessage = (e) => {
          const [command, noteValue] = e.data;

          // note begins
          if (command === 144) {
            notes.push({
              name: MIDI_NOTE_MAPPINGS[noteValue],
              value: noteValue,
              coords: NOTE_COORDS[noteValue],
            });

            if (cb) cb(notes);
          }

          // note ends
          if (command === 128) {
            notes.splice(0, notes.length);
          }
        };
      }
    });

    return true;
  }

  return false;
}

export default midiInit;
