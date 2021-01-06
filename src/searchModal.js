import React, { Component } from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Input,
    Label
} from "reactstrap";
import * as JsSearch from 'js-search';

export default class PlayerSearchModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
        searchList: this.props.searchList,
        searchTerm: "",
        resultList: [],
        renderList: [],
        search: new JsSearch.Search('name'),
        activePlayer: {},
        activeElement: {},
        };
        this.state.search.addIndex("name")
        this.state.search.addDocuments(this.state.searchList)
    }

    handleChange = (e) => {
        let { name, value } = e.target;
        this.setState({searchTerm: value});
        this.searchThings(value)
    };

    searchThings = (a) => {
        let result = this.state.search.search(a)
        console.log(result);
        this.setState({resultList: result, renderList: this.handleResults(result)})
    }

    playerSelect = (e) => {
        console.log(e.target.id)
        let test = e.target.id.valueOf()
        e.target.className = (e.target.className.includes("selected")) ? "my-centered-text search-results-item" : ( "selected " + e.target.className );
        this.setState({activePlayer: this.state.resultList[test], activeElement: e})
    }

    handleResults = (response) => {
        let flag = typeof(response)
        let temp = [];
        if (flag === "object"){
            if (Array.isArray(flag)){
                console.log("ARRAY???")
            } else {
                console.log("dict")
                temp.push(
                    <div className="modal-results-list">
                        {
                            Object.keys(response).map((key, entry) => {
                                return (
                                    <p id={"" + key} onClick={(e) => this.playerSelect(e)} className="my-centered-text search-results-item">{response[entry]["name"]}</p>
                                )
                            })
                        }
                    </div>
                )
            }
        }
        return temp
    }

    isEmpty = (obj) => {
        if (typeof obj === "undefined"){
            return true
        }
        return Object.keys(obj).length === 0;
    }

    makePlayerArea = () => {
        if (!this.isEmpty(this.state.activePlayer)){
            let pname = this.state.activePlayer["name"]
            let pdict = this.state.activePlayer
            return (
                <div className="selected-player-area">
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
                </div>
            )
        }
    }

    render() {
        const { toggle } = this.props;
        return (
        <Modal isOpen={true} toggle={toggle} className="modal-player-window">
            <ModalHeader toggle={toggle}> Player Search </ModalHeader>
            <ModalBody className="modal-search-body">
                <Form>
                    <FormGroup>
                        <Label for="search-bar">Search: </Label>
                        <Input
                            type="text"
                            autoComplete="off"
                            name="search-bar"
                            onKeyUp={this.handleChange}
                            placeholder="Enter Player Name"
                        />
                    </FormGroup>
                </Form>
            <div>{this.state.renderList}</div>
            </ModalBody>
            <ModalFooter>
                {this.makePlayerArea()}
            </ModalFooter>
        </Modal>
        );
    }
}