import React, {useState} from "react";
import './creation.scss';

const Footer = () => {
    return (
        <div className="footer">
            <div className="left-button">
                <button type="button" type="button" className="back">Back</button>
            </div>
            <div className="right-button">
                <button type="button" type="button" className="proceed">Proceed</button>
            </div>
        </div>
    );
}

export default Footer;