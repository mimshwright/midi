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

const WHOLE_NOTES = [0,2,4,5,7,9,11];
const HALF_NOTES = [1,3,6,8,10];

const MIDI_PRESS = 144;
const MIDI_RELEASE = 128;


const SEMITONES = 12;

export const midiCodeToNote = midiCode => midiCode % SEMITONES;
export const noteToString = note => OCTAVE[note];

async function initializeMidiHandler( navigator, callback) {
 
  if (navigator.requestMIDIAccess === false ) {
    throw new Error("No MIDI API available.");
  }
  
  const midiHandler = await navigator.requestMIDIAccess();
  const inputs = midiHandler.inputs.values();
  const notes = [];

  const onMidiMessage = (event) => {
    const [command, rawValue] = event.data;

    if (command === MIDI_PRESS) {
      const note = midiCodeToNote(rawValue);

      const isSharp = HALF_NOTES.includes(note);
      const nearestWholeNote = isSharp ? note - 1 : note;

      const noteProps = {
        name: noteToString(note),
        note,
        rawValue,
        command,
        nearestWholeNoteIndex: WHOLE_NOTES.indexOf(nearestWholeNote),
        isSharp
      }
      notes.push(noteProps);
      
      console.log(noteProps.name);

      if (callback) { callback(notes); }
    }

    if (command === MIDI_RELEASE) {
      notes.splice(0, notes.length);
    }
  };
  
  let input;
  for (input of inputs) {
   input.onmidimessage = onMidiMessage;
  }


  return true;
}

export default initializeMidiHandler;


