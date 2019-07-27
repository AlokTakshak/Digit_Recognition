import React, { Component } from "react";
import { LINE_WIDTH, STROKE_STYLE } from "./constants";
import * as tf from "@tensorflow/tfjs";
import BarGraph from "./Graph";
import "./Canvas.css";

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = { draw: false };
    this.draw = false;
    this.result = null;
  }

  componentDidMount() {
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
  }

  clearCanvas = () => {
    let { height, width } = this.canvas;
    this.context.clearRect(0, 0, width, height);
  };

  drawCircle(startX, startY, radius = 10) {
    this.context.save();
    this.context.lineWidth = 1;
    this.context.fillStyle = STROKE_STYLE;
    this.context.beginPath();
    this.context.arc(startX, startY, radius, 0, Math.PI * 2);
    this.context.stroke();
    this.context.fill();
    this.context.restore();
  }

  getCursorPosition = event => {
    let { left, top } = this.canvas.getBoundingClientRect();
    return { x: event.clientX - left, y: event.clientY - top };
  };

  onMouseDown = event => {
    this.draw = true;
    let cursorPosition = this.getCursorPosition(event);
    this.context.strokeStyle = STROKE_STYLE;
    this.context.lineJoin = "round";
    this.context.lineWidth = LINE_WIDTH;
    this.drawCircle(cursorPosition.x, cursorPosition.y);
    this.context.beginPath();
    this.context.moveTo(cursorPosition.x, cursorPosition.y);
  };

  onMouseMove = event => {
    if (this.draw == true) {
      let cursorPosition = this.getCursorPosition(event);
      this.context.lineTo(cursorPosition.x, cursorPosition.y);
      this.context.stroke();
    }
  };

  onMouseUp = event => {
    let cursorPosition = this.getCursorPosition(event);
    this.drawCircle(cursorPosition.x, cursorPosition.y);
    this.context.closePath();
    this.draw = false;
  };

  Predict = () => {
    let { predict } = this.props;
    let inputImage = tf.tidy(() => {
      let inputImage = tf.browser.fromPixels(this.canvas, 1);
      let reSizedImage = tf.image.resizeBilinear(inputImage, [28, 28]);
      let inputImageData = reSizedImage.flatten().dataSync();
      return tf.tensor4d([...inputImageData], [1, 28, 28, 1]);
    });

    // inputImage.reshape(28, 28, 1);

    let result = predict(inputImage);

    let data = result.dataSync();
    this.graph.drawBarGraph(data);
  };

  render() {
    return (
      <div className="row-canvas_component">
        <h3>Draw Here for testing model</h3>
        <div className="drawer">
          <canvas
            id="canvas"
            width="280"
            height="280"
            onMouseDown={this.onMouseDown}
            onMouseMove={this.onMouseMove}
            onMouseUp={this.onMouseUp}
          />
          <div className="row-button">
            <button className="button" onClick={this.Predict}>
              Predict
            </button>
            <button className="button" onClick={this.clearCanvas}>
              Clear
            </button>
          </div>
        </div>

        <div className="row-graph">
          <BarGraph
            data={this.result}
            ref={node => {
              this.graph = node;
            }}
          />
        </div>
      </div>
    );
  }
}

export default Canvas;
