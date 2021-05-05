import React, {useState} from "react";
import {getAuthModes} from '../../api/hipServiceApi';
import AuthModes from '../auth-modes/authModes';

const VerifyHealthId = () => {
    const [healthId, setHealthId] = useState('');
    const [authModes, setAuthModes] = useState([]);
    const [showAuthModes, setShowAuthModes] = useState(false);

    function healthIdOnChangeHandler(e) {
        setHealthId(e.target.value);
    }

    async function verifyHealthId() {
        const response = await getAuthModes(healthId);
        setShowAuthModes(true);
        setAuthModes(response);
    }

    return (
        <div>
            <div className="verify-health-id">
                <label htmlFor="healthId" className="label">Enter Health ID: </label>
                <div className="verify-health-id-input-btn">
                    <div className="verify-health-id-input">
                        <input type="text" id="healthId" name="healthId" value={healthId} onChange={healthIdOnChangeHandler}/>
                    </div>
                    <button name="verify-btn" type="button" onClick={verifyHealthId} disabled={showAuthModes}>Verify</button>
                </div>
            </div>
            {showAuthModes && <AuthModes healthId={healthId} authModes={authModes}/>}
        </div>
    );
}

export default VerifyHealthId;
