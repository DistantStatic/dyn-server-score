import FlightBox from './flightbox/FlightBox';

const makeFlightData = (props) => {
    let pname = ""
    let pdict = {}
    return props.dataDump.map((entry) => {
        if (entry["f_time_s"] > 7000){
            pname = entry["name"];
            pdict = entry;
            return(
                <FlightBox
                    playerName={pname}
                    playerData={pdict}
                    />
            )
         }
        return null 
    })
}

export default makeFlightData;