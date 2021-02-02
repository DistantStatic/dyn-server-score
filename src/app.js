import React, { Component } from "react";
import {
    Card,
    CardBody,
    Col,
    Container,
    Row
} from "reactstrap";
import { ResponsiveBubble } from '@nivo/circle-packing'
import PlayerSearchModal from "./searchModal"
import Papa_Dump from './NewData.json'

// Temp fuel data
const dynadata = { "Al Qusayr" :{"amt":67.304099121099,"co":0,"fc":"000000006E24ED00","id":2,"v":false}, "Aleppo" :{"amt":513.549,"co":0,"fc":"0000000DF582FF50","id":23,"v":false},"Bassel Al-Assad":{"amt":786.18481982422,"co":0,"fc":"0000000DF5812270","id":17,"v":false},"Hama":{"amt":765.55572253418,"co":0,"fc":"000000006E273010","id":10,"v":false},"Hatay":{"amt":72.886288574219,"co":0,"fc":"000000006E2663B0","id":11,"v":false},"Incirlik":{"amt":569.508,"co":0,"fc":"000000006E2685C0","id":12,"v":false},"Jirah":{"amt":100,"co":0,"fc":"0000000DF58188A0","id":13,"v":false},"Minakh":{"amt":25,"co":0,"fc":"0000000DF5836580","id":22,"v":false}}

// Color schemes for graph
const colorSchemes = {
    "blue": "blues",
    "red": "reds",
    "fuel": "blues"
}

class App extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            searchModal: false,
            playerDump: {},
            dataDump: [], //players
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

    // Toggles the player search modal
    toggle = () => {
        this.setState({ modal: !this.state.modal });
    }
      
    componentDidMount = () => {
        console.log(Papa_Dump.PlayerScores);
        this.digest(Papa_Dump.PlayerScores);
        this.giveBlueBaseStrength(Papa_Dump)
    }

    // Formats player data for makeFlightData()
    digest = (d) => {
        let formatted = [];
        Object.keys(d).forEach((key) => {
            formatted.push({name: key, ...d[key]})
        })
        this.setState({dataDump: formatted});
    }

    // Formats and sets as default Base Strength in the Nivo Bubblegraph
    giveBlueBaseStrength = (data) => {
        let baseDict = data["BaseData"]["blueCoalition"]["baseData"]
        let formatedBaseList = [];
        Object.keys(baseDict).forEach((key) => {
            console.log(key);
            let unitList = [];
            let unorderedUnitList = baseDict[key]["type"]
            Object.keys(unorderedUnitList).forEach( (key) =>{
                unitList.push({
                    name: key,
                    amt: unorderedUnitList[key]
                })
            } )
            
            formatedBaseList.push({
                name: key,
                amt: baseDict[key]["str"],
                children: unitList
            })
        })
        console.log(formatedBaseList);
        let replacement = {
            "name": "xsaf",
                "color": "hsl(27, 70%, 50%)",
                "children": formatedBaseList
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
        Object.keys(dynadata).forEach((key) => {
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

    orderByKills = () => {
        let temp = this.state.dataDump
        temp.sort((a, b) => {
            return b["Air Kills"] - a["Air Kills"]
        })
        this.setState({dataDump: temp})
    }

    orderByKDR = () => {
        let temp = this.state.dataDump
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

    // Creates Player Data Cards
    makeFlightData = () => {
        let pname = ""
        let pdict = {}
        let ret = [];
        this.state.dataDump.forEach((entry, index) => {
            if (entry["f_time_s"] > 7000){
                pname = entry["name"];
                pdict = entry;  
                ret.push(
                    <Card>
                        <CardBody>
                            <h3 className="card-title">{pname}</h3>
                            <h5 className="card-sub-title mb-2 text-muted">Flight Time: {pdict["SeatTime"]}</h5>
                            <div className="card-section">
                                <Row className="row-cols-3">
                                    <Col className="stat">
                                        <span><b>Air Kills: </b>{pdict["Air Kills"]}</span>
                                    </Col>
                                    <Col className="stat">
                                        <span><b>Deaths: </b>{pdict["Deaths"]}</span>
                                    </Col>
                                    <Col className="stat">
                                        <span><b>Kill/Death Ratio: </b>{pdict["KtoDr"].toFixed(2)}</span>
                                    </Col>
                                    <Col className="stat">
                                        <span><b>Ground Kills: </b>{pdict["Unit Kills"]}</span>
                                    </Col>
                                    <Col className="stat">
                                        <span><b>Building Kills: </b>{pdict["Building Kills"]}</span>
                                    </Col>
                                    <Col className="stat">  
                                        <span><b>Ejections: </b>{pdict["Ejections"]}</span>
                                    </Col>
                                </Row>
                            </div>
                        </CardBody>
                    </Card>
                )
            }    
        })
        return ret
    }

    // Nivo Bubble Graph to show Base Strength and Fuel
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

    // Title Bar
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

    render = () => {
        return (
            <main className="content">
                {this.pageTitleBar()}
                <div className="custom-container opac-window">
                    <Row>
                        <Col md="6">
                            <div className="title col-title opac-window-text">
                                <h3>Airfield Data</h3>
                            </div>
                            <div className="btn-mygroup">
                                <button className="my-btn btn btn-info" onClick={() => this.giveBlueBaseStrength(Papa_Dump)}>Blue Strength</button>
                                <button className="my-btn btn btn-info" onClick={() => this.giveBaseFuel()}>Blue Fuel</button>
                            </div>
                            <Container className="first">
                                {this.MyResponsiveBubbleHtml(this.state.mainDataChart)}
                            </Container>
                        </Col>
                        <Col md="6">
                            <div className="title col-title opac-window-text">
                                <h3>Player Data</h3>
                            </div>
                            <div className="btn-mygroup">
                                {/*<button className="my-btn btn btn-primary" onClick={() => this.digest(Papa_Dump.PlayerScores)}>Refresh Data</button>*/}
                                <button className="my-btn btn btn-primary" onClick={() => this.orderByKDR()}>Kill/Death</button>
                                <button className="my-btn btn btn-success" onClick={() => this.orderByKills()}>Kills</button>
                                <button className="my-btn btn btn-danger" onClick={() => this.orderByDeaths()}>Deaths</button>
                                <button className="my-btn btn btn-info" onClick={() => this.orderByTime()}>Time</button>
                                <button class="my-btn btn btn-secondary" onClick={() => this.toggle()}>Search</button>
                            </div>
                            <div className="nexttest player-data scroll-test">
                                {this.makeFlightData()}
                            </div>
                        </Col>
                    </Row>
                    
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