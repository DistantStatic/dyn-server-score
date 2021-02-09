import React, { Component } from "react";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Input,
    Label
} from "reactstrap";

import FlightBox from '../../../components/flightdata/flightbox/FlightBox'

import classes from './SearchModal.module.css';

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
        let { value } = e.target;
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
        e.target.className = ("selected " + e.target.className );
        if (Object.keys(this.state.activeElement).length > 0) {
            this.state.activeElement.classList.remove("selected");
        }
        this.setState({activePlayer: this.state.resultList[test], activeElement: e.target})
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
                    <div className={classes.ModalResultsList}>
                        {
                            Object.keys(response).map((key, entry) => {
                                return (
                                    <p id={"" + key} onClick={(e) => this.playerSelect(e)} className={classes.SearchResultsItem}>{response[entry]["name"]}</p>
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
                <FlightBox
                    playerName={pname}
                    playerData={pdict}
                    />
            )
        }
    }

    render() {
        const { toggle } = this.props;
        return (
        <Modal isOpen={true} toggle={toggle}>
            <ModalHeader toggle={toggle}> Player Search </ModalHeader>
            <ModalBody className={classes.ModalSearchBody}>
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