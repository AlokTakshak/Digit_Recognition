import React, { Component } from "react";
import {
  MINEPOCHS,
  MAXEPOCHS,
  MINTEST,
  MINTRAIN,
  MAXTEST,
  MAXTRAIN
} from "./constants";
import "./InputsSelector.css";

class InputSelector extends Component {
  constructor(props) {
    super(props);
    this.state = { epochs: 0, trainSize: 0, testSize: 0 };
  }
  render() {
    let { epochs, trainSize, testSize } = this.state;
    return (
      <div>
        <p className="text">Select Epochs</p>
        <input
          className="slider"
          type="range"
          min={MINEPOCHS}
          max={MAXEPOCHS}
          value={epochs}
          onChange={event => {
            this.setState({ epochs: event.target.value });
          }}
        />
        <p className="text">Train Data Set Size </p>
        <input
          className="slider"
          type="range"
          min={MINTRAIN}
          max={MAXTRAIN}
          value={trainSize}
          onChange={event => {
            this.setState({ trainSize: event.target.value });
          }}
        />
        <p className="text">Test Data Set Size </p>
        <input
          className="slider"
          type="range"
          min={MINTEST}
          max={MAXTEST}
          value={testSize}
          onChange={event => {
            this.setState({ testSize: event.target.value });
          }}
        />
        <div>
          <button
            className="button"
            onClick={() => this.props.train(epochs, trainSize, testSize)}
          >
            Train
          </button>
        </div>
      </div>
    );
  }
}

export default InputSelector;
