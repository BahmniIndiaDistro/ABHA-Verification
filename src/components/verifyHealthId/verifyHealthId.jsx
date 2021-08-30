import React, {useState} from "react";
import {getAuthModes, fetchPatientFromBahmniWithHealthId} from '../../api/hipServiceApi';
import AuthModes from '../auth-modes/authModes';
import Spinner from '../spinner/spinner';
import './verifyHealthId.scss';

const VerifyHealthId = () => {
    const [healthId, setHealthId] = useState('');
    const [authModes, setAuthModes] = useState([]);
    const [showAuthModes, setShowAuthModes] = useState(false);
    const [matchingPatientFound, setMatchingPatientFound] = useState(false);
    const [matchingpatientUuid, setMatchingPatientUuid] = useState('');
    const [errorHealthId, setErrorHealthId] = useState('');
    const [showError, setShowError] = useState(false);
    const [loader, setLoader] = useState(false);

    function healthIdOnChangeHandler(e) {
        setHealthId(e.target.value);
    }

    async function verifyHealthId() {
        setLoader(true);
        setShowError(false);
        const matchingPatient = await fetchPatientFromBahmniWithHealthId(healthId);
        if (matchingPatient.Error === undefined) {
            if (matchingPatient.error === undefined) {
                setMatchingPatientFound(true);
                setMatchingPatientUuid(matchingPatient);
            } else {
                const response = await getAuthModes(healthId);
                if (response.error !== undefined) {
                    setShowError(true)
                    setErrorHealthId(response.error.message);
                }
                else {
                    setShowAuthModes(true);
                    setAuthModes(response.authModes);
                }
            }
        } else {
            setShowError(true)
            setErrorHealthId(matchingPatient.Error.message);
        }
        setLoader(false);
    }

    function redirectToPatientDashboard() {
        window.parent.postMessage({"patientUuid" : matchingpatientUuid}, "*");
    }

    return (
        <div>
            <div className="verify-health-id">
                <label htmlFor="healthId" className="label">Enter Health ID/PHR Address: </label>
                <div className="verify-health-id-input-btn">
                    <div className="verify-health-id-input">
                        <input type="text" id="healthId" name="healthId" value={healthId} onChange={healthIdOnChangeHandler} />
                    </div>
                    <button name="verify-btn" type="button" onClick={verifyHealthId} disabled={showAuthModes}>Verify</button>
                    {showError && <h6 className="error">{errorHealthId}</h6>}
                </div>
            </div>
            {matchingPatientFound && <div className="patient-existed" onClick={redirectToPatientDashboard}>
                Matching record with Health ID found
            </div>}
            {loader && <Spinner />}
            {showAuthModes && <AuthModes healthId={healthId} authModes={authModes}/>}
        </div>
    );
}

export default VerifyHealthId;
