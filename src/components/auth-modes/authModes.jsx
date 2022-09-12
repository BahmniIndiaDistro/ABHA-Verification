import React, { useState } from "react";
import { authInit } from '../../api/hipServiceApi';
import OtpVerification from '../otp-verification/otpVerification';
import Spinner from '../spinner/spinner';
import {checkIfNotNull} from "../verifyHealthId/verifyHealthId";

const AuthModes = (props) => {
    const [selectedAuthMode, setSelectedAuthMode] = useState('');
    const [showOtpField, setShowOtpField] = useState(false);
    const [errorHealthId, setErrorHealthId] = useState('');
    const [showError, setShowError] = useState(false);
    const [loader, setLoader] = useState(false);
    const [ndhmDetails, setNdhmDetails] = [props.ndhmDetails,props.setNdhmDetails];

    const id = props.id;
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
        setLoader(true);
        if (selectedAuthMode !== "DEMOGRAPHICS") {
            setShowError(false)
            const response = await authInit(id, selectedAuthMode);
            if (response.error !== undefined) {
                setShowError(true)
                setErrorHealthId(response.error.message);
            }
            else {
                setShowOtpField(true);
            }
        } else {
            setErrorHealthId("The selected Authentication Mode is currently not supported!");
            setShowError(true);
        }
        setLoader(false);
    }


    return (
        <div>
            {!checkIfNotNull(ndhmDetails) && <div className="auth-modes">
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
            </div>}
            {loader && <Spinner />}
            {showOtpField && <OtpVerification id={id} selectedAuthMode={selectedAuthMode} ndhmDetails={ndhmDetails} setNdhmDetails={setNdhmDetails} />}
        </div>
    );
}
export default AuthModes;
