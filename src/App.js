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

  getmodel() {
    this.model = tf.sequential();

    const IMAGE_WIDTH = 28,
      IMAGE_HEIGHT = 28,
      IMAGE_CHANNEL = 1;

    // In the first layer of our convolutional neural network we have
    // to specify the input shape. Then we specify some parameters for
    // the convolution operation that takes place in this layer.
    this.model.add(
      tf.layers.conv2d({
        inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNEL],
        kernelSize: 5,
        filters: 8,
        strides: 1,
        activation: "relu",
        kernelInitializer: "varianceScaling"
      })
    );

    //pooling layer
    this.model.add(
      tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] })
    );

    //adding one more conv+maxpool layers
    this.model.add(
      tf.layers.conv2d({
        kernelSize: 5,
        filters: 16,
        strides: 1,
        activation: "relu",
        kernelInitializer: "varianceScaling"
      })
    );
    this.model.add(
      tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] })
    );

    //flatten the output from 2d to 1d filter
    this.model.add(tf.layers.flatten());

    //dense layer for output prediction
    const NUMBER_OF_OUTPUT_CLASS = 10;
    this.model.add(
      tf.layers.dense({
        units: NUMBER_OF_OUTPUT_CLASS,
        activation: "softmax",
        kernelInitializer: "varianceScaling"
      })
    );

    // Choose an optimizer, loss function and accuracy metric,
    // then compile and return the model
    const optimiser = tf.train.adam();
    this.model.compile({
      optimizer: optimiser,
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"]
    });
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
