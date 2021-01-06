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

export default class PlayerDetailsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
        searchList: this.props.searchList,
        searchTerm: "",
        resultList: [],
        renderList: [],
        search: new JsSearch.Search('name')
        };
        this.state.search.addIndex("name")
        this.state.search.addDocuments(this.state.searchList)
    }

    render() {
        const { toggle } = this.props;
        return (
        <Modal isOpen={true} toggle={toggle} className="modal-player-window">
            <ModalHeader toggle={toggle}> Player Details </ModalHeader>
            <ModalBody>
            <div>Did it work lol?</div>
            </ModalBody>
            <ModalFooter>
            </ModalFooter>
        </Modal>
        );
    }
}