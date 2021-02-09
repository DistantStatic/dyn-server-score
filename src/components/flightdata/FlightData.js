import FlightBox from './flightbox/FlightBox';
import classes from './FlightData.module.css';

const makeFlightData = (props) => {
    let pname = ""
    let pdict = {}
    return (
        <div className={[classes.PlayerData, "scroll-test"].join(" ")}>
            {props.dataDump.map((entry) => {
                if (entry["f_time_s"] > 7000) {
                pname = entry["name"];
                pdict = entry;
                return (
                    <FlightBox
                        key={pname}
                        playerName={pname}
                        playerData={pdict}
                        />
                    )
                }
                return null 
            })}
        </div>
    )
}

export default makeFlightData;