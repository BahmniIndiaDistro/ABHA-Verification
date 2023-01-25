import React, {useState} from "react";
import './creation.scss';

const Footer = (props) => {
    const [setProceed] = [props.setProceed];

    function onClick() {
        setProceed(true);
    }
    return (
        <div className="footer">
            <div className="left-button">
                <button type="button" className="back">Back</button>
            </div>
            <div className="right-button">
                <button type="button" className="proceed" onClick={onClick}>Proceed</button>
            </div>
        </div>
    );
}

export default Footer;