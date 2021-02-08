import {
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
    UncontrolledButtonDropdown
} from "reactstrap";

const pageTitleBar = (props) => {
    return (
        <div className="title-group">
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
                        <DropdownItem disabled onClick={() => props.togglePappa("Papa")}>Papa</DropdownItem>
                        <DropdownItem onClick={() => props.toggleSierra("Sierra")}>Sierra</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={() => props.toggleAlpha("Alpha")}>Alpha</DropdownItem>
                    </DropdownMenu>
                </UncontrolledButtonDropdown>
            </div>
        </div>
    )
}

export default pageTitleBar;