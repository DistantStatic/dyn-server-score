import { Component } from "react";
import {
    Card,
    CardBody,
    Col,
    Container,
    Row,
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
    UncontrolledButtonDropdown
} from "reactstrap";
import { ResponsiveBubble } from '@nivo/circle-packing';
import PlayerSearchModal from "./searchModal";
import Papa_Dump from './Papa_Export.json';
import Sierra_Dump from './Sierra_Export.json';
import Alpha_Dump from './Alpha_Export.json';

// Color schemes for graph
const colorSchemes = {
    "blue": "blues",
    "red": "reds",
    "fuel": "blues"
}

const data_sources = {
    "Alpha": Alpha_Dump,
    "Papa": Papa_Dump,
    "Sierra": Sierra_Dump
}

class App extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            searchModal: false,
            dataSet: "Alpha",
            playerDump: {},
            dataDump: [], //players
            fuelDataJSON: {},
            mainDataChart: [],
            chartCircleColorBy: "depth", //depth or name
            chartCircleLines: true,
            charCircleColors: colorSchemes["blue"],
            chartMotionDamp: 2,
            nivoFuel: {
                "name": "xsaf",
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

    toggleDataTypes = (type) => {
        this.setState({dataSet: type})
        this.digest(type);
        this.giveBlueBaseStrength(type);
    }
      
    componentDidMount = () => {
        this.digest(this.state.dataSet);
        this.giveBlueBaseStrength(this.state.dataSet);
    }

    // Formats player data for makeFlightData()
    digest = (type) => {
        const data = data_sources[type].PlayerScores
        let formatted = [];
        Object.keys(data).forEach((key) => {
            formatted.push({name: key, ...data[key]})
        })
        this.setState({dataDump: formatted});
    }

    // Formats and sets as default Base Strength in the Nivo Bubblegraph
    giveBlueBaseStrength = (type) => {
        const data = data_sources[type];
        const baseDict = data["BaseData"]["blueCoalition"]["baseData"];
        const formatedBaseList = [];
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
        const data = data_sources[this.state.dataSet]
        const baseDict = data["BaseData"]["blueCoalition"]["baseData"]
        let replacement = {
            name: "xsaf", 
            children: []
        };
        Object.keys(baseDict).forEach((key) => {
            console.log(key);
            console.log(baseDict[key].bFuel.amount);
            replacement["children"].push( 
                {
                    name: key,
                    amt:  baseDict[key].bFuel.amount,
                }
            )
        });
        this.setState({
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
                    <h1>[XSAF] Camelot Dynamic Campaign</h1>
                </div>
                <div className="title site-title">
                    <UncontrolledButtonDropdown>
                        <DropdownToggle caret size="lg">
                            <strong>Server: {this.state.dataSet}</strong>
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem header>Choose Server...</DropdownItem>
                            <DropdownItem disabled onClick={() => this.toggleDataTypes("Papa")}>Papa</DropdownItem>
                            <DropdownItem onClick={() => this.toggleDataTypes("Sierra")}>Sierra</DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem onClick={() => this.toggleDataTypes("Alpha")}>Alpha</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledButtonDropdown>
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
                                <button className="my-btn btn btn-info" onClick={() => this.giveBlueBaseStrength(this.state.dataSet)}>Blue Strength</button>
                                <button className="my-btn btn btn-info" onClick={() => this.giveBaseFuel(this.state.dataSet)}>Blue Fuel</button>
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