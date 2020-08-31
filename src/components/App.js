import React, { Component } from "react";
import Staff from "./Staff";
import initializeMidiHandler from "../midi";

class App extends Component {
  state = {
    notes: [],
    isMidiAvailable: true,
  };

  componentDidMount() {
    try {
      initializeMidiHandler(window.navigator, (notes) => this.setState({ notes }));
    } catch (error) {
      this.setState({isMidiAvailable: false});
    }
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
