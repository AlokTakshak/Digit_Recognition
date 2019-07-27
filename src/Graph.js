import React, { Component } from "react";
import * as d3 from "d3";
import "./Graph.css";

const WIDTH = 600;
const HEIGHT = 300;
const GAP = 20;

class BarGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.initalize();
    this.drawBarGraph([]);
  }

  drawBarGraph = data => {
    let barGraph = d3.select("#bar");
    barGraph.selectAll("*").remove();
    let xAxis = d3
      .scaleBand()
      .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      .range([0, WIDTH])
      .padding([0.1]);
    let yAxis = d3
      .scaleLinear()
      .domain([0, 100])
      .range([HEIGHT - GAP, 0]);

    barGraph
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (height, index) => {
        return xAxis(index);
      })
      .attr("y", (height, index) => {
        return yAxis(height * 100);
      })
      .attr("width", (height, index) => {
        return xAxis.bandwidth();
      })
      .attr("height", (height, index) => {
        return HEIGHT - GAP - yAxis(height * 100);
      })
      .attr("fill", "#d0ff85")
      .attr("stroke", "black");
    barGraph
      .append("g")
      .attr("transform", `translate(0,${HEIGHT - GAP})`)
      .call(d3.axisBottom(xAxis));
  };

  /**
   * @summary adds a svg for drawing the bargraph for results
   */
  initalize() {
    d3.select("#graph")
      .append("svg")
      .attr("id", "bar")
      .attr("width", WIDTH)
      .attr("height", HEIGHT);
  }

  render() {
    return <div id="graph" />;
  }
}

export default BarGraph;
