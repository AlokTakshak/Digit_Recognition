import React, { Component } from "react";
import { LINE_WIDTH, STROKE_STYLE } from "./constants";
import "./Canvas.css";

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = { draw: false };
    this.draw = false;
  }

  componentDidMount() {
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
  }

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

  render() {
    return (
      <div className="canvas_component">
        <div className="row-canvas-header">Canvas Component</div>
        <canvas
          id="canvas"
          className="row-canvas"
          width="280"
          height="280"
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
        />
      </div>
    );
  }
}

export default Canvas;
