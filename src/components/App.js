import React, { Component } from "react";
import Staff from "./Staff";
import midiInit from "../midi";

class App extends Component {
  state = {
    notes: [],
    isMidiAvailable: true,
  };

  componentDidMount() {
    const isMidiAvailable = midiInit((notes) => this.setState({ notes }));
    this.setState({ isMidiAvailable });
  }

  render() {
    const { notes, isMidiAvailable } = this.state;

    if (!isMidiAvailable) return <h1>Your browser does not support MIDI.</h1>;

    return (
      <div style={{ textAlign: "center" }}>
        <pre style={{ textAlign: "center", height: "10vh" }}>
          {notes.map((note) => note.name).sort().join(" ")}
        </pre>

        <Staff notes={notes} />
      </div>
    );
  }
}

export default App;
