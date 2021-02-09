import {
    Card,
    CardBody,
    CardTitle,
    CardSubtitle,
    CardHeader,
    Col,
    Row,
} from "reactstrap";

import {
    Building,
    Bullseye,
    Eject,
    EmojiDizzy,
    LifePreserver,
    Basket,
    Percent,
    PersonX,
    Truck,
    Trophy
} from 'react-bootstrap-icons'

import classes from './FlightBox.module.css';

const flightBox = (props) => {
    return (
        <Card>
            <CardHeader className={classes.Header}>
                <CardTitle><strong>{props.playerName}</strong></CardTitle>
                <Row>
                    <Col><CardSubtitle className=" mb-2 text-muted">Flight Time: {props.playerData["SeatTime"]}<span></span></CardSubtitle></Col>
                    <Col><CardSubtitle className={classes.HangRightTitle}><Trophy /> Score: {props.playerData["Score"]}</CardSubtitle></Col>
                </Row>
            </CardHeader>
            <CardBody>
                    <Row className="row-cols-3">
                        <Col>
                            <span className={classes.VertCenter}><Bullseye /> Air: {props.playerData["Air Kills"]}</span>
                        </Col>
                        <Col>
                            <span className={classes.VertCenter}><EmojiDizzy /> Deaths: {props.playerData["Deaths"]}</span>
                        </Col>
                        <Col>
                            <span className={classes.VertCenter}><Percent /> K/D: {props.playerData["KtoDr"].toFixed(2)}</span>
                        </Col>
                        <Col>
                            <span className={classes.VertCenter}><Truck /> Unit Kills: {props.playerData["Unit Kills"]}</span>
                        </Col>
                        <Col>
                            <span className={classes.VertCenter}><Building /> Buldings: {props.playerData["Building Kills"]}</span>
                        </Col>
                        <Col>  
                            <span className={classes.VertCenter}><Eject /> Ejections: {props.playerData["Ejections"]}</span>
                        </Col>
                        <Col>  
                            <span className={classes.VertCenter}><LifePreserver /> Ship Kills: {props.playerData["Ship Kills"]}</span>
                        </Col>
                        <Col>  
                            <span className={classes.VertCenter}><Basket /> Crates Loaded: {props.playerData["CratesLoaded"]}</span>
                        </Col>
                        <Col>  
                            <span className={classes.VertCenter}><PersonX /> Troops: {props.playerData["Troops"]}</span>
                        </Col>
                    </Row>
            </CardBody>
        </Card>
    )
}

export default flightBox