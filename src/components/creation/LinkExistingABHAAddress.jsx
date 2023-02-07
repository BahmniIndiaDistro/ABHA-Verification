import React, {useEffect, useState} from "react";
import './creation.scss';
import VerifyOTP from "./verifyOtp";
import Spinner from "../spinner/spinner";
import {getAuthMethods, linkORUnlinkABHAAddress, transaction, verifyOtpInput} from "../../api/hipServiceApi";
import PatientDetails from "../patient-details/patientDetails";
import {getDate} from "../Common/DateUtil";
import {GoVerified} from "react-icons/all";
import Footer from "./Footer";

const LinkExistingABHAAddress = (props) => {
    const [loader, setLoader] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [error, setError] = useState('');
    const [otp, setOtp] = useState('');
    const [authModes, setAuthmodes]= useState([])
    const [chosenAuthMode, setChosenAuthMode] = useState('');
    const patient = props.patient
    const [isPatientMapped,setIsPatientMapped] = useState(false);
    const [mappedPatient,setMappedPatient] = useState({});
    const [otpVerified, setOtpVerified] = useState(false);


    function onAuthModeChange(e) {
        setChosenAuthMode(e.target.value);
        setError('');
    }

    function resetToDefault(){
        setError('');
        setOtp('');
        setShowOtpInput(false);
    }

    async function verifyOtp() {
        setLoader(true);
        setError('');
        if (otp === '') {
            setError("otp cannot be empty")
        } else {
            var response = await verifyOtpInput(otp);
            if (response) {
                setLoader(false);
                if (response.data === undefined) {
                    if (response.details !== undefined && response.details.length > 0)
                        setError(response.details[0].message)
                    else
                        setError("An error occurred while processing your request")
                }
                else {
                    setOtpVerified(true);
                }
            }
        }
    }

    async function link() {
        setLoader(true);
        var response = await linkORUnlinkABHAAddress("LINK");
        if (response) {
            setLoader(false);
            if (response.data === undefined) {
                if (response.details !== undefined && response.details.length > 0)
                    setError(response.details[0].message)
                else
                    setError("An error occurred while processing your request")
            }
            else {
                if(response.data.success === "true")
                    mapPatient();
                else {
                    setError("Failure in linking ABHA Address to ABHA Number")
                }
            }
        }
    }

    function mapPatient() {
        var identifier = patient?.phone !== undefined ? [{
            value: patient.phone
        }] : (patient?.mobile !== undefined ? [{
            value: patient.mobile
        }] : undefined);
        var address =  {
            line: undefined,
            district: patient?.districtName,
            state: patient?.stateName,
            pincode: patient?.pincode
        };
        const ndhm = {
            healthNumber: patient.healthIdNumber,
            id: props.healthId,
            gender: patient.gender,
            name: patient.name,
            isBirthDateEstimated: patient?.monthOfBirth == null || patient?.dayOfBirth == null,
            dateOfBirth: getDate(patient),
            address: address,
            identifiers: identifier
        };
        setMappedPatient(ndhm);
        setIsPatientMapped(true);
    }

    async function fetchAuthModes() {
        resetToDefault()
        setLoader(true);
        var response = await getAuthMethods(props.patient.healthIdNumber);
        if (response) {
            setLoader(false);
            if (response.data === undefined) {
                if (response.details !== undefined && response.details.length > 0)
                    setError(response.details[0].message)
                else
                    setError("An error occurred while processing your request")
            }
            else {
               setAuthmodes(response.data.authMethods);
               setChosenAuthMode(response.data.authMethods[0]);
            }
        }
    }

    async function authenticate() {
        setLoader(true);
        var response = await transaction(chosenAuthMode);
        if (response) {
            setLoader(false);
            if (response.data === undefined) {
                if (response.details !== undefined && response.details.length > 0)
                    setError(response.details[0].message)
                else
                    setError("An error occurred while processing your request")
            }
            else {
                setShowOtpInput(true);
            }
        }
    }


    useEffect(() => {
        setError('');
        if(otp !== '')
            verifyOtp();
    },[otp]);

    let authModesList = authModes.length > 0 && authModes.map((item, i) => {
        return (
            <option key={i} value={item}>{item}</option>
        )
    });

    return (
        <div>
            {!isPatientMapped && <div>
                <div className="abha">
                    <label htmlFor="abha-number" className="label">ABHA Number</label>
                    <div className="verify-abha-input-btn">
                        <div className="verify-abha-input">
                            <input type="text" id="abha-number" name="abha-number" value={props.patient.healthIdNumber} disabled={true} />
                        </div>
                        <button type="submit" className="proceed" onClick={fetchAuthModes}>verify</button>
                    </div>
                </div>
                {authModes.length > 0 &&
                <div className="select-option">
                    <label htmlFor="auth-modes">Preferred mode of Authentication</label>
                    <div className="select-btn">
                        <div className="select">
                           <select id="auth-modes" onChange={onAuthModeChange}>
                               {authModesList}
                           </select>
                       </div>
                       <button type="button" disabled={chosenAuthMode === ''} onClick={authenticate}>Authenticate</button>
                   </div>
               </div>}
            {showOtpInput && <VerifyOTP setOtp={setOtp}/>}
            {otpVerified && <p className="note success"> <GoVerified /> <strong>OTP Verfied Successfully</strong></p>}
            {otpVerified  &&  <div className="center">
                <button type="button" className="proceed" onClick={link}>Proceed</button>
                </div>
            }
                {error !== '' && <h6 className="error">{error}</h6>}
                {loader && <Spinner />}
                <Footer setBack={props.setBack} />
            </div>}
            {isPatientMapped && error !== '' && <h6 className="error">{error}</h6>}
            {isPatientMapped && loader && <Spinner />}
            {isPatientMapped && <PatientDetails ndhmDetails={mappedPatient} />}
        </div>
    );
}
export default LinkExistingABHAAddress;
