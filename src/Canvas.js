import React, { Component } from "react";
import "./Canvas.css";

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="canvas_component">
        <div className="row-canvas-header">Canvas Component</div>
        <canvas className="row-canvas" width="280" height="280" />
      </div>
    );
  }
}

export default Canvas;
