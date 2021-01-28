// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/circle-packing
import { ResponsiveBubble } from '@nivo/circle-packing'
import {XYPlot, XAxis, YAxis, HorizontalGridLines, Treemap, HexbinSeries, HeatmapSeries, MarkSeries, LineSeries, LabelSeries, HorizontalBarSeries, VerticalBarSeries, PolygonSeries} from 'react-vis';
import React from 'react';
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const myData = {
    "name": "nivo",
    "color": "hsl(27, 70%, 50%)",
    "children": 
        [
            {
              "name": "Al Qusayr",
              "color": "hsl(228, 70%, 50%)",
              "loc": 67.304099121099
            },
            {
              "name": "Aleppo",
              "color": "hsl(226, 70%, 50%)",
              "loc": 513.549
            },
            {
              "name": "Bassel Al-Assad",
              "color": "hsl(84, 70%, 50%)",
              "loc": 786.18481982422
            },
            {
              "name": "Hama",
              "color": "hsl(295, 70%, 50%)",
              "loc": 765.55572253418
            },
            {
              "name": "Hatay",
              "color": "hsl(97, 70%, 50%)",
              "loc": 72.886288574219
            }
        ]
    }




export default class App extends React.Component {
    constructor(){
        super();
        this.state = {
            col: myData
        };
    }

    makeGraph = () => {
      return (
        <XYPlot
          width={300}
          height={300}
          xType="ordinal">
          <HorizontalGridLines />
          <VerticalBarSeries
            data={[
              {x: "test", y: 10},
              {x: 3, y: 5},
              {x: "4", y: 15}
            ]}/>
          <XAxis />
          <YAxis />
        </XYPlot>
      )
    }
    
    render() {
      return (
        <div className="centered-and-flexed">
            {this.makeGraph()}
        </div>
      );
    }
  }
