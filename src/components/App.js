import React, { Component } from "react";
import { MIDI_NOTE_MAPPINGS } from "../config";
import Staff from "./Staff";

class App extends Component {
  state = {
    notes: [],
    isMidiAvailable: true
  };

  componentDidMount() {
    if (!navigator.requestMIDIAccess) {
      this.setState({ isMidiAvailable: false });
    } else {
      this.midiInit();
    }
  }

  midiInit = () => {
    navigator.requestMIDIAccess().then(access => {
      const inputs = access.inputs.values();
      const notes = [];

      for (const input of inputs) {
        input.onmidimessage = e => {
          const [command, note] = e.data;

          if (command === 144) {
            notes.push(note);
            this.setState({ notes });
          }

          if (command === 128) {
            notes.splice(0, notes.length);
            // this.setState({ notes });
          }
        };
      }

      // access.onstatechange = e => {
      //   console.log(e.port.name);
      // }
    });
  };

  render() {
    const { notes, isMidiAvailable } = this.state;

    if (!isMidiAvailable) return <h1>Your browser does not support MIDI.</h1>;

    const noteLetter = notes.map(n => MIDI_NOTE_MAPPINGS[n]);

    return (
      <div style={{ textAlign: "center" }}>
        <pre style={{ textAlign: "center", height: "10vh" }}>{noteLetter}</pre>
        <Staff notes={notes} />
      </div>
    );
  }
}

export default App;
