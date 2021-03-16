import {
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
    UncontrolledButtonDropdown
} from "reactstrap";
import { Link } from 'react-router-dom';

import Aux from '../../hoc/Aux';

const pageTitleBar = (props) => {
    return (
        <Aux>
            <div className="title site-title">
                <h1>[XSAF] Camelot Dynamic Campaign</h1>
            </div>
            <div className="title site-title">
                <UncontrolledButtonDropdown>
                    <DropdownToggle caret size="lg">
                        <strong>Server: {props.dataSet}</strong>
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem header>Choose Server...</DropdownItem>
                        <DropdownItem disabled>
                            <Link to={{pathname: "/papa"}}>Papa</Link>
                        </DropdownItem>
                        <DropdownItem >
                            <Link to={{pathname: "/sierra"}}>Sierra</Link>
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem >
                            <Link to={{pathname: "/alpha"}}>Alpha</Link>
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledButtonDropdown>
                <span>Last Updated 03/16/2021</span>
            </div>
        </Aux>
    )
}

export default pageTitleBar;