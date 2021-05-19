import React, { useState } from "react";
import { getAuthModes } from '../../api/hipServiceApi';
import AuthModes from '../auth-modes/authModes';

const VerifyHealthId = () => {
    const [healthId, setHealthId] = useState('');
    const [authModes, setAuthModes] = useState([]);
    const [showAuthModes, setShowAuthModes] = useState(false);
    const [errorHealthId, setErrorHealthId] = useState('');
    const [showError, setShowError] = useState(false);

    function healthIdOnChangeHandler(e) {
        setHealthId(e.target.value);
    }

    async function verifyHealthId() {
        const response = await getAuthModes(healthId);
        if (response.error !== undefined) {
            setShowError(true)
            setErrorHealthId(response.error.message);
        }
        else {
            setShowError(false);
            setShowAuthModes(true);
            setAuthModes(response.authModes);
        }
    }

    return (
        <div>
            <div className="verify-health-id">
                <label htmlFor="healthId" className="label">Enter Health ID: </label>
                <div className="verify-health-id-input-btn">
                    <div className="verify-health-id-input">
                        <input type="text" id="healthId" name="healthId" value={healthId} onChange={healthIdOnChangeHandler} />
                    </div>
                    <button name="verify-btn" type="button" onClick={verifyHealthId} disabled={showAuthModes}>Verify</button>
                    {showError && <h6 className="error">{errorHealthId}</h6>}
                </div>
            </div>
            {showAuthModes && <AuthModes healthId={healthId} authModes={authModes} />}
        </div>
    );
}

export default VerifyHealthId;
