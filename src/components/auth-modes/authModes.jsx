import React, { useState } from "react";
import { authInit } from '../../api/hipServiceApi';
import OtpVerification from '../otp-verification/otpVerification';

const AuthModes = (props) => {
    const [selectedAuthMode, setSelectedAuthMode] = useState('');
    const [showOtpField, setShowOtpField] = useState(false);
    const [errorHealthId, setErrorHealthId] = useState('');
    const [showError, setShowError] = useState(false);
    const healthId = props.healthId;
    const authModes = props.authModes;
    let authModesList = authModes !== undefined && authModes.length > 0 && authModes.map((item, i) => {
        return (
            <option key={i} value={item}>{item}</option>
        )
    });

    function onAuthModeSelected(e) {
        setSelectedAuthMode(e.target.value);
    }

    async function authenticate() {
        const response = await authInit(healthId, selectedAuthMode);
        if (response.error !== undefined) {
            setShowError(true)
            setErrorHealthId(response.error.message);
        }
        else {
            setShowError(false)
            setShowOtpField(true);
        }
    }

    return (
        <div>
            <div className="auth-modes">
                <label htmlFor="auth-modes">Preferred mode of Authentication</label>
                <div className="auth-modes-select-btn">
                    <div className="auth-modes-select">
                        <select id="auth-modes" onChange={onAuthModeSelected}>
                            <option>Select auth mode..</option>
                            {authModesList}
                        </select>
                    </div>
                    <button type="button" disabled={showOtpField} onClick={authenticate}>Authenticate</button>
                    {showError && <h6 className="error">{errorHealthId}</h6>}
                </div>
            </div>
            {showOtpField && <OtpVerification healthId={healthId} selectedAuthMode={selectedAuthMode} />}
        </div>
    );
}
export default AuthModes;
