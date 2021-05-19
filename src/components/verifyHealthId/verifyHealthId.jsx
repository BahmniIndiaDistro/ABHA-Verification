import React, {useState} from "react";
import {getAuthModes, fetchPatientFromBahmniWithHealthId} from '../../api/hipServiceApi';
import AuthModes from '../auth-modes/authModes';
import './verifyHealthId.scss';

const VerifyHealthId = () => {
    const [healthId, setHealthId] = useState('');
    const [authModes, setAuthModes] = useState([]);
    const [showAuthModes, setShowAuthModes] = useState(false);
    const [matchingPatientFound, setMatchingPatientFound] = useState(false);
    const [matchingpatientUuid, setMatchingPatientUuid] = useState('');

    function healthIdOnChangeHandler(e) {
        setHealthId(e.target.value);
    }

    async function verifyHealthId() {
        const matchingPatient = await fetchPatientFromBahmniWithHealthId(healthId);
        if (matchingPatient.error === undefined) {
            setMatchingPatientFound(true);
            setMatchingPatientUuid(matchingPatient);
        } else {
            const response = await getAuthModes(healthId);
            setShowAuthModes(true);
            setAuthModes(response);
        }
    }

    function redirectToPatientDashboard() {
        window.parent.postMessage({"patientUuid" : matchingpatientUuid}, "*");
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
            {matchingPatientFound && <div className="patient-existed" onClick={redirectToPatientDashboard}>
                Matching record with Health ID found
            </div>}
            {showAuthModes && <AuthModes healthId={healthId} authModes={authModes}/>}
        </div>
    );
}

export default VerifyHealthId;
