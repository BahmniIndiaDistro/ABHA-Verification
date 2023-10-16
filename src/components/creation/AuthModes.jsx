import React, { useState } from "react";
import Spinner from '../spinner/spinner';

const AuthModes = (props) => {
    const [selectedAuthMode, setSelectedAuthMode] = useState('AADHAAR OTP');

    const authModes = ['AADHAAR OTP', 'AADHAAR DEMOGRAHICS'];
    let authModesList = authModes.length > 0 && authModes.map((item, i) => {
        return (
            <option key={i} value={item}>{item}</option>
        )
    });

    function onAuthModeSelected(e) {
        setSelectedAuthMode(e.target.value);
    }

    function proceed() {
        props.setSelectedAuthMode(selectedAuthMode);
    }

    return (
        <div>
            <div className="select-option">
                <label htmlFor="auth-modes">Preferred mode of Authentication</label>
                <div className="select-btn">
                    <div className="select">
                        <select id="auth-modes" onChange={onAuthModeSelected}>
                            {authModesList}
                        </select>
                    </div>
                    <button type="button" disabled={props.showOtpInput} onClick={proceed}>Proceed</button>
                </div>
            </div>
        </div>
    );
}
export default AuthModes;
