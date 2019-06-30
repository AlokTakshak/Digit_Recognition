import React, { Component } from "react";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import { MnistData } from "./data";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.run();
  }

  /**
   * @summary loads data from mnist
   */
  async run() {
    let data = new MnistData();
    await data.load();
    this.showExample(data);
  }

  /**
   * @summary extract individual image from data reshape it to 28x28
   * and draw it on canvas
   */
  async showExample(data) {
    // create a container in the visor
    let surface = tfvis
      .visor()
      .surface({ name: "Image Data Examples", tab: "Image Data" });

    //Get Examples
    let examples = data.nextTestBatch(20);
    let numberOfExamples = examples.xs.shape[0];

    for (let i = 0; i < numberOfExamples; i++) {
      let imageTensor = tf.tidy(() => {
        //reshape tensor to 28x28
        return examples.xs
          .slice([i, 0], [1, examples.xs.shape[1]])
          .reshape([28, 28, 1]);
      });

      let canvas = document.createElement("canvas");
      canvas.width = 28;
      canvas.height = 28;
      canvas.style = "margin:4px";
      await tf.browser.toPixels(imageTensor, canvas);
      surface.drawArea.appendChild(canvas);
      imageTensor.dispose();
    }
  }

  render() {
    return (
      <div>
        <div className="header">Welcome to digit recoginizer</div>
      </div>
    );
  }
}

export default App;
