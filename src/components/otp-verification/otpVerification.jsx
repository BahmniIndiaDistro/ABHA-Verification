import React, { useState } from "react";
import {authConfirm} from '../../api/hipServiceApi';
import PatientDetails from '../patient-details/patientDetails';

const OtpVerification = (props) => {
    const [otp, setOtp] = useState('');
    const [showDetailsComparision, setShowDetailsComparision] = useState(false);
    const [ndhmDetails, setNdhmDetails] = useState({});

    const healthId = props.healthId;
    const selectedAuthMode = props.selectedAuthMode;

    async function confirmAuth() {
        const patient = await authConfirm(healthId, otp);
        setNdhmDetails(parseNdhmDetails(patient));
        setShowDetailsComparision(true);
    }

    function otpOnChangeHandler(e) {
        setOtp(e.target.value);
    }

    function parseNdhmDetails(patient) {
        const ndhm = {
            gender: patient.gender,
            name: patient.name,
            yearOfBirth: patient.yearOfBirth,
            address: addressAsString(patient.address),
            addressObj: patient.address,
            identifiers: patient.identifiers
        };
        return ndhm;
    }

    function addressAsString(address) {
        var addressString = "";
        for (var key in address) {
            addressString += address[key] + ", " ;
        }
        return addressString;
    }

    return (
        <div>
            <div className="otp-verify" >
                <label htmlFor="otp">Enter OTP </label>
                <div className="otp-verify-input-btn" >
                    <div className="otp-verify-input">
                        <input type="text" id="otp" name="otp" value={otp} onChange={otpOnChangeHandler} />
                    </div>
                    <button type="button" disabled={showDetailsComparision} onClick={confirmAuth}>Confirm</button>
                </div>
            </div>
            {showDetailsComparision && <PatientDetails ndhmDetails={ndhmDetails} healthId={healthId}/>}
        </div>
    );
}

export default OtpVerification;
