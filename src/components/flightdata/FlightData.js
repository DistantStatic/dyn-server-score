import {
    Card,
    CardBody,
    Col,
    Row,
} from "reactstrap";

const makeFlightData = (props) => {
    let pname = ""
    let pdict = {}
    const ret = [];
    props.dataDump.forEach((entry, _) => {
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

export default makeFlightData;