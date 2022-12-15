import React, {useState} from "react";
import {
    getAuthModes,
    fetchPatientFromBahmniWithHealthId,
    getHealthIdStatus,
    saveTokenOnQRScan
} from '../../api/hipServiceApi';
import AuthModes from '../auth-modes/authModes';
import Spinner from '../spinner/spinner';
import QrReader from 'react-qr-scanner';
import PatientDetails from '../patient-details/patientDetails';
import { FcWebcam } from 'react-icons/fc';
import './verifyHealthId.scss';

const VerifyHealthId = () => {
    const [id, setId] = useState('');
    const [authModes, setAuthModes] = useState([]);
    const [showAuthModes, setShowAuthModes] = useState(false);
    const [matchingPatientFound, setMatchingPatientFound] = useState(false);
    const [matchingpatientUuid, setMatchingPatientUuid] = useState('');
    const [healthIdIsVoided, setHealthIdIsVoided] = useState(false);
    const [errorHealthId, setErrorHealthId] = useState('');
    const [showError, setShowError] = useState(false);
    const [loader, setLoader] = useState(false);
    const [scanningStatus, setScanningStatus] = useState(false);
    const [ndhmDetails, setNdhmDetails] = useState({});

    function idOnChangeHandler(e) {
        setId(e.target.value);
    }

    async function verifyHealthId() {
        setLoader(true);
        setShowError(false);
        const matchingPatientId = await fetchPatientFromBahmniWithHealthId(id);
        const healthIdStatus = matchingPatientId.Error !== undefined ? await getHealthIdStatus(matchingPatientId) : false;
        if (matchingPatientId.Error === undefined) {
            if(healthIdStatus === true)
                setHealthIdIsVoided(true);
            else if (matchingPatientId.error === undefined) {
                setMatchingPatientFound(true);
                setMatchingPatientUuid(matchingPatientId);
            } else {
                setMatchingPatientFound(false);
                const response = await getAuthModes(id);
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
            setErrorHealthId(matchingPatientId.Error.message);
        }
        setLoader(false);
    }

    function mapToNdhmDetails(scannedData) {
        var patient = JSON.parse(scannedData.text)
        var patientAddress = patient.address == '-' ? '' : patient.address
        var ABHA = patient['hidn'] === '-' ? null : patient['hidn']
        return {
            id: patient['phr'],
            gender: patient['gender'],
            name: patient['name'],
            dateOfBirth: patient['dob'].replace(/([0-9]+)\-([0-9]+)/,'$2-$1'),
            isBirthDateEstimated: true,
            address: {
                line: patientAddress,
                district: patient['district_name'],
                state: patient['state name'],
                pincode: patient['pincode']
            },
            identifiers: [
                {
                    "type": "MOBILE",
                    "value": patient['mobile']
                },
                {
                    "type": "HEALTH_NUMBER",
                    "value": ABHA
                }
            ]
        };
    }

    async function handleScan(scannedData) {
        if (scannedData != null) {
            var ndhmDetails = mapToNdhmDetails(scannedData)
            setScanningStatus(false);
            const matchingPatientId = await fetchPatientFromBahmniWithHealthId(ndhmDetails.id);
            const healthIdStatus = matchingPatientId.Error !== undefined ? await getHealthIdStatus(matchingPatientId) : false;
            if (matchingPatientId.Error === undefined) {
                if (healthIdStatus === true)
                    setHealthIdIsVoided(true);
                else if (matchingPatientId.error === undefined) {
                    setMatchingPatientFound(true);
                    setMatchingPatientUuid(matchingPatientId);
                } else {
                    setMatchingPatientFound(false);
                    setId(ndhmDetails.id);
                    setNdhmDetails(ndhmDetails);
                    await saveTokenOnQRScan(ndhmDetails);
                }
            } else {
                setShowError(true)
                setErrorHealthId(matchingPatientId.Error.message);
            }
        }
    }

    function getYear(dob) {
        var datearray = dob.split("/");
        var newdate = datearray[1] + '/' + datearray[0] + '/' + datearray[2];
        return new Date(newdate).getFullYear();
    }


    function redirectToPatientDashboard() {
        window.parent.postMessage({"patientUuid" : matchingpatientUuid}, "*");
    }

    return (
        <div>
        {!checkIfNotNull(ndhmDetails) &&
            <div>
                <div className="verify-health-id">
                    <label htmlFor="healthId" className="label">Enter ABHA/ABHA Address: </label>
                    <div className="verify-health-id-input-btn">
                        <div className="verify-health-id-input">
                            <input type="text" id="healthId" name="healthId" value={id} onChange={idOnChangeHandler} />
                        </div>
                        <button name="verify-btn" type="button" onClick={verifyHealthId} disabled={showAuthModes || checkIfNotNull(ndhmDetails)}>Verify</button>
                        {showError && <h6 className="error">{errorHealthId}</h6>}
                    </div>
                </div>
                <div className="alternative-text">
                    OR
                </div>
                <div className="qr-code-scanner">
                    <button name="scan-btn" type="button" onClick={()=> setScanningStatus(!scanningStatus)} disabled={showAuthModes || checkIfNotNull(ndhmDetails)}>Scan Patient's QR code <span id="cam-icon"><FcWebcam /></span></button>
                    {scanningStatus && <QrReader
                        delay={10}
                        onScan={handleScan}
                        style={{ width: '60%', margin: '50px' }}
                    />}
                </div>
                {matchingPatientFound && <div className="patient-existed" onClick={redirectToPatientDashboard}>
                    Matching record with Health ID/PHR Address found
                </div>}
                {healthIdIsVoided && <div className="id-deactivated">
                    Health ID is deactivated
                </div>}
                {loader && <Spinner />}
                {showAuthModes && <AuthModes id={id} authModes={authModes} ndhmDetails={ndhmDetails} setNdhmDetails={setNdhmDetails}/>}
            </div>}
            {!matchingPatientFound && !healthIdIsVoided && checkIfNotNull(ndhmDetails) && <PatientDetails ndhmDetails={ndhmDetails} id={id} />}
        </div>
    );
}

export const checkIfNotNull = (patient) => {
    return JSON.stringify(patient) !== JSON.stringify({})
}

export default VerifyHealthId;
