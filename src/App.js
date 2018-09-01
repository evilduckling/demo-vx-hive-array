import React, { Component } from "react";
import { GradientPinkBlue } from "@vx/gradient";
import { scaleLinear } from "@vx/scale";
import { Group } from "@vx/group";
import "./App.css";

const graphWidth = 1200;
const hostPerLine = 10;
const padding = graphWidth / (hostPerLine + 1) / 2;
const lineThickness = 8;
const fontSize = 22;
const hexaWidth = (graphWidth - padding * 2) / hostPerLine;

// Constants needed to draw an hexagone.
const halfHexaWidth = hexaWidth / 2;
const hexaRadius = hexaWidth / Math.sqrt(3);
const halfHexaRadius = hexaRadius / 2;
const vDedalsPerLine = hexaRadius + halfHexaRadius;

class App extends Component {
  state = { data: new Array(23).fill(10) };

  componentDidMount() {
    this.looper();
  }

  looper = () => {
    this.evolveData();
    setTimeout(this.looper, 2000);
  };

  addHost = () => {
    const { data } = this.state;
    data.push(0);
    this.setState({ data: data });
  };

  removeHost = () => {
    const { data } = this.state;
    data.pop();
    this.setState({ data });
  };

  shape = () => {
    const path = [
      { x: 0, y: halfHexaRadius },
      { x: halfHexaWidth, y: 0 },
      { x: hexaWidth, y: halfHexaRadius },
      { x: hexaWidth, y: hexaRadius + halfHexaRadius },
      { x: halfHexaWidth, y: hexaRadius * 2 },
      { x: 0, y: hexaRadius + halfHexaRadius }
    ];
    path.str = path.reduce((acc, element) => {
      return acc + " " + element.x + "," + element.y;
    }, "");
    return path;
  };

  /**
   * Get the x position of the upper left corner of the square including the hexagone to draw.
   */
  getXPosition = (d, i) => {
    let decal = 0;
    if (this.getLineNumber(i) % 2 === 0) {
      // Odd lines
      decal = halfHexaWidth;
    }
    return padding + decal + this.getPositionOnLine(i) * hexaWidth;
  };

  /**
   * Get the y position of the upper left corner of the square including the hexagone to draw.
   */
  getYPosition = (d, i) => {
    return padding + this.getLineNumber(i) * vDedalsPerLine;
  };

  // Very nice positions
  getLineNumber = index => {
    let line = 0;
    let even = true;
    while (index >= 0) {
      if (even) {
        index -= hostPerLine - 1;
      } else {
        index -= hostPerLine;
      }
      line++;
      even = !even;
    }
    return line - 1;
  };
  getPositionOnLine = index => {
    let even = true;
    let limit = hostPerLine - 1;
    while (index >= limit) {
      index -= limit;
      even = !even;
      if (even) {
        limit = hostPerLine - 1;
      } else {
        limit = hostPerLine;
      }
    }
    return index;
  };

  formatValue = d => d + " %";

  evolveData() {
    const { data } = this.state;

    this.setState({
      data: data.map((element, index) => {
        let v = Math.round(Math.random() * 20) - 10;
        return Math.min(Math.max(element + v, 0), 100);
      })
    });
  }

  render() {
    const { data } = this.state;

    const countLine = this.getLineNumber(data.length - 1) + 1;
    const graphHeight =
      hexaRadius * 2 + vDedalsPerLine * (countLine - 1) + 2 * padding;

    const colorScale = scaleLinear({
      range: ["#6ED071", "#D09902", "#D45D01", "#A1292E"],
      domain: [0, 33, 66, 100]
    });

    return (
      <div>
        <div>
          <h1>Host map !</h1>
          <button onClick={this.addHost}>Add host!</button>
          <button onClick={this.removeHost}>Remove host !</button>
        </div>
        <svg width={graphWidth} height={graphHeight}>
          <GradientPinkBlue id="teal" />
          <rect
            x={0}
            y={0}
            width={graphWidth}
            height={graphHeight}
            fill={`url(#teal)`}
            rx={20}
          />
          {data.map((d, i) => {
            return (
              <Group
                key={i}
                transform={
                  "translate(" +
                  this.getXPosition(d, i) +
                  "," +
                  this.getYPosition(d, i) +
                  ")"
                }
              >
                <polygon
                  points={this.shape().str}
                  stroke="black"
                  strokeWidth={lineThickness}
                  fill={colorScale(d)}
                />
                <text
                  x={halfHexaWidth}
                  y={hexaRadius}
                  textAnchor="middle"
                  alignmentBaseline="central"
                  fill="white"
                  fontSize={fontSize}
                  fontWeight="bold"
                  fontFamily="Lucida Grande"
                >
                  {this.formatValue(d)}
                </text>
              </Group>
            );
          })}
        </svg>
      </div>
    );
  }
}

export default App;
