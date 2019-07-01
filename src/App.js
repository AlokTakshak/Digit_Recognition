import React, { Component } from "react";
import Canvas from "./Canvas";
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
    // this.run();
  }

  /**
   * @summary sets up the model for image classification
   */
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
    this.data = data;
    await this.data.load();
    this.showExample();
    this.getmodel();
    tfvis.show.modelSummary({ name: "Model Architecture" }, this.model);
    await this.train();
  }

  /**
   * @summary extract individual image from data reshape it to 28x28
   * and draw it on canvas
   */
  async showExample() {
    // create a container in the visor
    let surface = tfvis
      .visor()
      .surface({ name: "Image Data Examples", tab: "Image Data" });

    //Get Examples
    let examples = this.data.nextTestBatch(20);
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

  async train() {
    const metrics = ["loss", "val_loss", "acc", "val_acc"];
    const container = { name: "Model Training", styles: { height: "1000px" } };

    let fitCallbacks = tfvis.show.fitCallbacks(container, metrics);

    const BATCH_SIZE = 512,
      TRAIN_DATA_SIZE = 5500,
      TEST_DATA_SIZE = 1000;

    // getting the training dataset
    const [trainXs, trainYs] = tf.tidy(() => {
      let train_data = this.data.nextTrainBatch(TRAIN_DATA_SIZE);
      return [
        train_data.xs.reshape([TRAIN_DATA_SIZE, 28, 28, 1]),
        train_data.labels
      ];
    });

    // getting the testting dataset for validation
    const [testXs, testYs] = tf.tidy(() => {
      let test_data = this.data.nextTestBatch(TEST_DATA_SIZE);
      return [
        test_data.xs.reshape([TEST_DATA_SIZE, 28, 28, 1]),
        test_data.labels
      ];
    });

    return await this.model.fit(trainXs, trainYs, {
      batchSize: BATCH_SIZE,
      validationData: [testXs, testYs],
      epochs: 10,
      shuffle: true,
      callbacks: fitCallbacks
    });
  }

  render() {
    return (
      <div className="App">
        <div className="row-header">Welcome to digit recoginizer</div>
        <Canvas />
      </div>
    );
  }
}

export default App;
