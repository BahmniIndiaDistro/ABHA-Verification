import React, { useState } from "react";
import { authInit } from '../../api/hipServiceApi';
import OtpVerification from '../otp-verification/otpVerification';

const AuthModes = (props) => {
    const [selectedAuthMode, setSelectedAuthMode] = useState('');
    const [showOtpField, setShowOtpField] = useState(false);
    const healthId = props.healthId;
    const authModes = props.authModes;
    let authModesList = authModes.length > 0 && authModes.map((item, i) => {
        return (
            <option key={i} value={item}>{item}</option>
        )
    });

    function onAuthModeSelected(e) {
        setSelectedAuthMode(e.target.value);
    }

    async function authenticate() {
        await authInit(healthId, selectedAuthMode);
        setShowOtpField(true);
    }

    return (
        <div>
            <div className="auth-modes">
                <label htmlFor="auth-modes">Preferred mode of Authentication</label>
                <div className="auth-modes-select-btn">
                    <div className="auth-modes-select">
                        <select id="auth-modes" onChange={onAuthModeSelected}>
                            {authModesList}
                        </select>
                    </div>
                    <button type="button" disabled={showOtpField} onClick={authenticate}>Authenticate</button>
                </div>
            </div>
            {showOtpField && <OtpVerification healthId={healthId} selectedAuthMode={selectedAuthMode} />}
        </div>
    );
}
export default AuthModes;
