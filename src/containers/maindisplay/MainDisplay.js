import { Component } from 'react';
import {
    Col,
    Container,
    Row,
} from "reactstrap";
import PlayerSearchModal from "../modals/SearchModal/SearchModal";
import Papa_Dump from '../../data/Papa_Export.json';
import Sierra_Dump from '../../data/Sierra_Export.json';
import Alpha_Dump from '../../data/Alpha_Export.json';

import FlightData from '../../components/flightdata/FlightData';
import MyResponsiveBubble from '../../components/nivo/respbubble/MyResponsiveBubble';

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

export default class MainDisplay extends Component {
    state = {
        searchModal: false,
        playerDump: {},
        dataSet: "Alpha",
        dataDump: [], //players
        fuelDataJSON: {},
        mainDataChart: {
            name: "xsaf", 
            children: []
        },
        chartCircleColorBy: "depth", //depth or name
        chartCircleLines: true,
        chartCircleColors: colorSchemes["blue"],
        chartMotionDamp: 2,
        nivoFuel: {
            "name": "xsaf",
            "children": 
                [ 
                    /* Populate dynamic with data */
                ]
            }
    }

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    }

    shouldComponentUpdate(nextState, nextProps){
        if (nextState !== this.state){
            return true;
        }
    }

    componentDidMount() {
        this.setState({dataSet: this.props.dataSet})
        this.digest(this.props.dataSet);
        this.giveBlueBaseStrength(this.props.dataSet);
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
                chartCircleColors: colorSchemes["blue"]
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
    
    render() {
            return (
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
                                <MyResponsiveBubble
                                    data={this.state.mainDataChart}
                                    chartCircleColors={this.state.chartCircleColors}
                                    chartCircleColorBy={this.state.chartCircleColorBy}
                                    chartCircleLines={this.state.chartCircleLines}
                                />
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
                                <FlightData dataDump={this.state.dataDump} />
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
            )
    }
}