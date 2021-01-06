import React, { Component } from "react";
import {XYPlot, XAxis, YAxis, HorizontalGridLines, Treemap, HexbinSeries, HeatmapSeries, MarkSeries, LineSeries, LabelSeries, HorizontalBarSeries, VerticalBarSeries, PolygonSeries} from 'react-vis';
import { ResponsiveBubble } from '@nivo/circle-packing'
import test from "./test.json" 
import dump from "./dump.json"
import pdump from "./dump_player.json"
import sdump from "./dump_skynet.json"
import { Button } from "bootstrap";
import PlayerSearchModal from "./searchModal"

const dataaa = { "asdf": 1234};
const dynadata = { "Al Qusayr" :{"amt":67.304099121099,"co":0,"fc":"000000006E24ED00","id":2,"v":false}, "Aleppo" :{"amt":513.549,"co":0,"fc":"0000000DF582FF50","id":23,"v":false},"Bassel Al-Assad":{"amt":786.18481982422,"co":0,"fc":"0000000DF5812270","id":17,"v":false},"Hama":{"amt":765.55572253418,"co":0,"fc":"000000006E273010","id":10,"v":false},"Hatay":{"amt":72.886288574219,"co":0,"fc":"000000006E2663B0","id":11,"v":false},"Incirlik":{"amt":569.508,"co":0,"fc":"000000006E2685C0","id":12,"v":false},"Jirah":{"amt":100,"co":0,"fc":"0000000DF58188A0","id":13,"v":false},"Minakh":{"amt":25,"co":0,"fc":"0000000DF5836580","id":22,"v":false}}
const colorSchemes = {
    "blue": "blues",
    "red": "reds",
    "fuel": "blues"
}
class App extends Component {
    
    constructor(props) {
        super()
        this.state = {
            searchModal: false,
            playerDump: {},
            dataDump: [],
            skynetDump: {},
            fuelDataJSON: {},
            mainDataChart: [],
            chartCircleColorBy: "depth", //depth or name
            chartCircleLines: true,
            charCircleColors: colorSchemes["blue"],
            chartMotionDamp: 2,
            baseCount: 0,
            nivoFuel: {
                "name": "xsaf",
                "color": "hsl(27, 70%, 50%)",
                "children": 
                    [ 
                        /* Populate dynamic with data */
                    ]
                }
        }
    }

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    }
      
    componentDidMount = () => {
        this.giveBlueBaseStrength(sdump);
        this.digest(dump);
        this.digestSkynet(sdump);
    }

    digest = (d) => {
        let formatted = [];
        Object.keys(d).map((key, index) => {
            formatted.push({name: key, ...d[key]})
        })
        this.setState({dataDump: formatted});
    }

    giveBlueBaseStrength = (a) => {
        let baseDict = a["bspaceData"]["blue"]["base"];
        let formatBaseList = [];
        Object.keys(baseDict).map( (key, index) => {
            let unitList = [];
            let unordersUnitList = baseDict[key]["types"]
            console.log("Inside Map")
            console.log(unordersUnitList)
            Object.keys(unordersUnitList).map( (key, index) =>{
                unitList.push({
                    name: key,
                    amt: unordersUnitList[key]
                })
            } )
            
            formatBaseList.push({
                name: key,
                amt: baseDict[key]["str"],
                children: unitList
            })
        })
        let replacement = {
            "name": "xsaf",
                "color": "hsl(27, 70%, 50%)",
                "children": formatBaseList
                }
        this.setState({
                chartMotionDamp: 2,
                mainDataChart: replacement, 
                chartCircleColorBy: "name", 
                chartCircleLines: true, 
                charCircleColors: colorSchemes["blue"]
            })
    }

    giveBaseFuel = () => {
        let replacement = {
            name: "xsaf", 
            color:"hsl(27, 70%, 50%)", 
            children: []
        };
        let count = 0;
        Object.keys(dynadata).map(function(key, index) {
            replacement["children"].push( 
                {
                    name: key,
                    color: "hsl(84, 70%, 50%)",
                    amt:  dynadata[key].amt,
                }
            )
            count += 1;
        });
        this.setState({
            BaseCount: count,
            chartMotionDamp: 30,
            mainDataChart: replacement, 
            chartCircleColorBy: "name", 
            chartCircleLines: false,
            charCircleColors: colorSchemes["fuel"]
        })
    }

    digestSkynet = (d) => {
        let formatted = [];
        Object.keys(d).map((key, index) => {
            formatted.push({name: key, ...d[key]})
        })
        this.setState({skynetDump: formatted});
    }
    
    digestBases = (d) => {
        let formatted = [];
        Object.keys(d).map((key, index) => {
            formatted.push({name: key, ...d[key]})
        })
        this.setState({skynetDump: formatted});
    }

    orderByKills = () => {
        let temp = this.state.dataDump
        temp.sort((a, b) => {
            return b["Air Kills"] - a["Air Kills"]
        })
        this.setState({dataDump: temp})
    }

    orderByKDR = () => {
        let temp = this.state.dataDump
        temp.forEach((entry, index) =>{
            if (temp[index]["KtoDr"] > 1) {
                console.log("theres data");
            }
        })
        temp.sort((a, b) => {
            return b["KtoDr"] - a["KtoDr"]
        })
        this.setState({dataDump: temp})
    }

    orderByDeaths = () => {
        let temp = this.state.dataDump
        temp.sort((a, b) => {
            return b["Deaths"] - a["Deaths"]
        })
        this.setState({dataDump: temp})
    }

    orderByTime = () => {
        let temp = this.state.dataDump
        temp.sort((a, b) => {
            return b["f_time_s"] - a["f_time_s"]
        })
        this.setState({dataDump: temp})
    }

    makeFlightData = () => {
        let pname = ""
        let pdict = {}
        let ret = [];
        this.state.dataDump.forEach((entry, index) => {
            if (entry["f_time_s"] > 7000){
                pname = entry["name"];
                pdict = entry;  
                ret.push(
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title">{pname}</h3>
                            <h5 className="card-sub-title mb-2 text-muted">Flight Time: {pdict["SeatTime"]}</h5>
                            <div className="card-section">
                                <div className="row row-cols-3">
                                    <div className="col stat">
                                        <span><b>Air Kills: </b>{pdict["Air Kills"]}</span>
                                    </div>
                                    <div className="col stat">
                                        <span><b>Deaths: </b>{pdict["Deaths"]}</span>
                                    </div>
                                    <div className="col stat">   
                                        <span><b>Kill/Death Ratio: </b>{pdict["KtoDr"]}</span>
                                    </div>
                                    <div className="col stat">
                                        <span><b>Ground Kills: </b>{pdict["Unit Kills"]}</span>
                                    </div>
                                    <div className="col stat">  
                                        <span><b>Building Kills: </b>{pdict["Building Kills"]}</span>
                                    </div>
                                    <div className="col stat">  
                                        <span><b>Ejections: </b>{pdict["Ejections"]}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }    
        })
        return ret
    }

    MyResponsiveBubbleHtml = (d) => (
        <ResponsiveBubble
            root={d}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            identity="name"
            value="amt"
            colors={{ scheme: this.state.charCircleColors }}
            colorBy={this.state.chartCircleColorBy}
            padding={6}
            labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1 ] ] }}
            borderWidth={2}
            borderColor={{ from: 'color' }}
            defs={[
                {
                    id: 'lines',
                    type: 'patternDots',
                    background: 'none',
                    color: 'inherit',
                    rotation: -45,
                    lineWidth: 5,
                    spacing: 8
                }
            ]}
            fill={ this.state.chartCircleLines ? [ { match: { depth: 1 }, id: 'lines' } ] : []}
            animate={true}
            motionStiffness={80}
            motionDamping={12}
        />
    )

    pageTitleBar = () => {
        return (
            <div className="title-group">
                <div className="title site-title">
                    <h1>[XSAF] Camelot Dynamic Server</h1>
                </div>
                <div className="title site-title">
                    <h1>Server Data</h1>
                </div>
            </div>
        )
    }

    TitleBar = () => {
        return (
            <div className="title-group">
                <div className="title site-title">
                    <h1>[XSAF] Camelot Dynamic Server</h1>
                </div>
                <div className="title site-title">
                    <h1>Server Data</h1>
                </div>
            </div>
        )
    }

    render() {
        return (
            <main className="content">
                {this.pageTitleBar()}
                <div className="custom-container opac-window">
                    <div className="row">
                        <div className="col">
                            <div className="title col-title opac-window-text">
                                <h3>Airfield Data</h3>
                            </div>
                            <div className="btn-mygroup">
                                <button className="my-btn btn btn-info" onClick={() => this.giveBlueBaseStrength(sdump)}>Blue Strength</button>
                                <button className="my-btn btn btn-info" onClick={() => this.giveBaseFuel()}>Blue Fuel</button>
                            </div>
                            <div className="first">
                                {this.MyResponsiveBubbleHtml(this.state.mainDataChart)}
                            </div>
                        </div>
                        <div className="col">
                            <div className="title col-title opac-window-text">
                                <h3>Player Data</h3>
                            </div>
                            <div className="btn-mygroup">
                                <button className="my-btn btn btn-primary" onClick={() => this.digest(dump)}>Refresh Data</button>
                                <button className="my-btn btn btn-info" onClick={() => this.orderByKDR()}>Kill/Death</button>
                                <button className="my-btn btn btn-success" onClick={() => this.orderByKills()}>Kills</button>
                                <button className="my-btn btn btn-danger" onClick={() => this.orderByDeaths()}>Deaths</button>
                                <button className="my-btn btn btn-info" onClick={() => this.orderByTime()}>Time</button>
                                <button class="my-btn btn btn-secondary" onClick={() => this.toggle()}>Search</button>
                            </div>
                            <div className="nexttest player-data example">
                                {this.makeFlightData()}
                            </div>
                        </div>
                    </div>
                    
                    {this.state.modal ? (
                        <PlayerSearchModal
                            searchList={this.state.dataDump}
                            toggle={this.toggle}
                            onSave={this.handleSubmit}
                            />
                        ) : null}
                </div>
            </main>
        )
    }
}
export default App