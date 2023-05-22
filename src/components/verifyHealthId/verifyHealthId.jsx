import React, {useEffect, useState} from "react";
import {
    getAuthModes,
    fetchPatientFromBahmniWithHealthId,
    getHealthIdStatus,
    saveTokenOnQRScan, searchHealthId
} from '../../api/hipServiceApi';
import AuthModes from '../auth-modes/authModes';
import Spinner from '../spinner/spinner';
import QrReader from 'react-qr-scanner';
import PatientDetails from '../patient-details/patientDetails';
import { FcWebcam } from 'react-icons/fc';
import './verifyHealthId.scss';
import DemoAuth from "../demo-auth/demoAuth";

const VerifyHealthId = () => {
    const [id, setId] = useState('');
    const [year, setYear] = useState('');
    const [authModes, setAuthModes] = useState([]);
    const healthIdAuthModes = ["MOBILE_OTP", "AADHAAR_OTP"];
    const [showAuthModes, setShowAuthModes] = useState(false);
    const [matchingPatientFound, setMatchingPatientFound] = useState(false);
    const [matchingpatientUuid, setMatchingPatientUuid] = useState('');
    const [healthIdIsVoided, setHealthIdIsVoided] = useState(false);
    const [errorHealthId, setErrorHealthId] = useState('');
    const [showError, setShowError] = useState(false);
    const [loader, setLoader] = useState(false);
    const [scanningStatus, setScanningStatus] = useState(false);
    const [ndhmDetails, setNdhmDetails] = useState({});
    const [back, setBack] = useState(false);
    const [isDemoAuth, setIsDemoAuth] = useState(false);

    function idOnChangeHandler(e) {
        setId(e.target.value);
    }

    function yearOnChangeHandler(e) {
        setYear(e.target.value);
    }

    async function verifyHealthId() {
        setLoader(true);
        setShowError(false);
        const matchingPatientId = await fetchPatientFromBahmniWithHealthId(id);
        const healthIdStatus = matchingPatientId.Error !== undefined ? await getHealthIdStatus(matchingPatientId.patientUuid) : false;
        if (matchingPatientId.Error === undefined) {
            if(healthIdStatus === true)
                setHealthIdIsVoided(true);
            else if (matchingPatientId.validPatient === true) {
                setMatchingPatientFound(true);
                setMatchingPatientUuid(matchingPatientId.patientUuid);
            } else {
                setMatchingPatientFound(false);
                await searchByHealthId();
                // const response = await getAuthModes(id);
                // if (response.error !== undefined) {
                //     setShowError(true)
                //     setErrorHealthId(response.error.message);
                // }
                // else {
                //     setShowAuthModes(true);
                //     setAuthModes(response.authModes);
                // }
            }
        } else {
            setShowError(true)
            setErrorHealthId(matchingPatientId.Error.message);
        }
        setLoader(false);
    }

    async function searchByHealthId() {
        const response = await searchHealthId(id, year);
        if(response.data !== undefined){
            setShowAuthModes(true);
            setAuthModes(healthIdAuthModes);
        }
        else {
            setShowError(true)
            setErrorHealthId(response.details[0].message || response.message);
        }
    }

    function getIfVaild(str){
        return (str && str !== '-') ? str : null;
    }

    function mapToNdhmDetails(scannedData) {
        var patient = JSON.parse(scannedData.text)
        return {
            id: patient['phr'],
            gender: patient['gender'],
            name: patient['name'],
            dateOfBirth: patient['dob'].split('-').reverse().map(e => e !== "" ? e : "1").join('-'),
            isBirthDateEstimated: true,
            address: {
                line: getIfVaild(patient['address']),
                district: getIfVaild(patient['dist name']),
                state: getIfVaild(patient['state name']),
                pincode: getIfVaild(patient['pincode'])
            },
            identifiers: [
                {
                    "type": "MOBILE",
                    "value": patient['mobile']
                },
                {
                    "type": "HEALTH_NUMBER",
                    "value": getIfVaild(patient['hidn'])
                }
            ]
        };
    }

    async function handleScan(scannedData) {
        if (scannedData != null) {
            var ndhmDetails = mapToNdhmDetails(scannedData)
            setScanningStatus(false);
            const matchingPatientId = await fetchPatientFromBahmniWithHealthId(ndhmDetails.id);
            const healthIdStatus = matchingPatientId.Error !== undefined ? await getHealthIdStatus(matchingPatientId.patientUuid) : false;
            if (matchingPatientId.Error === undefined) {
                if (healthIdStatus === true)
                    setHealthIdIsVoided(true);
                else if (matchingPatientId.validPatient === true) {
                    setMatchingPatientFound(true);
                    setMatchingPatientUuid(matchingPatientId.patientUuid);
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

    useEffect(() => {
        if(back){
            setNdhmDetails({});
            setId('');
            setShowError(false);
            setShowAuthModes(false);
            setAuthModes([]);
            setMatchingPatientFound(false);
            setHealthIdIsVoided(false);
            setLoader(false);
            setBack(false);
            setIsDemoAuth(false);
        }

    },[back])

    return (
        <div>
        {!isDemoAuth && !checkIfNotNull(ndhmDetails) &&
            <div>
                <div className="verify-health-id">
                    <label htmlFor="healthId" className="label">Enter ABHA/ABHA Address: </label>
                    <div className="verify-health-id-input-btn">
                        <div className="verify-health-id-input">
                            <input type="text" id="healthId" name="healthId" value={id} onChange={idOnChangeHandler} />
                        </div>
                    </div>
                </div>
                <div className="verify-year">
                    <label htmlFor="yearOfBirth" className="label">Enter Year of Birth: </label>
                    <div className="verify-year-input-btn">
                        <div className="verify-year-input">
                            <input type="text" id="healthId" name="healthId" value={year} onChange={yearOnChangeHandler} />
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
                {showAuthModes && <AuthModes id={id} authModes={authModes} ndhmDetails={ndhmDetails} setNdhmDetails={setNdhmDetails} setIsDemoAuth={setIsDemoAuth}/>}
            </div>}
            {isDemoAuth && !checkIfNotNull(ndhmDetails) && <DemoAuth id={id} ndhmDetails={ndhmDetails} setNdhmDetails={setNdhmDetails} setBack={setBack}/>}
            {!matchingPatientFound && !healthIdIsVoided && checkIfNotNull(ndhmDetails) && <PatientDetails ndhmDetails={ndhmDetails} id={id} setBack={setBack} />}
        </div>
    );
}

export const checkIfNotNull = (patient) => {
    return JSON.stringify(patient) !== JSON.stringify({})
}

export default VerifyHealthId;
