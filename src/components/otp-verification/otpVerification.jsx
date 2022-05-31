import React, { useState } from "react";
import { authConfirm } from '../../api/hipServiceApi';
import PatientDetails from '../patient-details/patientDetails';
import Spinner from '../spinner/spinner';

const OtpVerification = (props) => {
    const [otp, setOtp] = useState('');
    const [showDetailsComparision, setShowDetailsComparision] = useState(false);
    const [ndhmDetails, setNdhmDetails] = useState({});
    const [errorHealthId, setErrorHealthId] = useState('');
    const [showError, setShowError] = useState(false);
    const [loader, setLoader] = useState(false);

    const id = props.id;
    const selectedAuthMode = props.selectedAuthMode;

    async function confirmAuth() {
        setLoader(true);
        setShowError(false);
        const response = await authConfirm(id, otp);
        if (response.error !== undefined || response.Error !== undefined) {
            setShowError(true)
            setErrorHealthId((response.Error && response.Error.Message) || response.error.message);
        }
        else {
            setNdhmDetails(parseNdhmDetails(response));
            setShowDetailsComparision(true);
        }
        setLoader(false);
    }

    function otpOnChangeHandler(e) {
        setOtp(e.target.value);
    }

    function parseNdhmDetails(patient) {
        const ndhm = {
            id: patient.id,
            gender: patient.gender,
            name: patient.name,
            dateOfBirth: patient.dateOfBirth,
            address: addressAsString(patient.address),
            addressObj: patient.address,
            identifiers: patient.identifiers
        };
        return ndhm;
    }

    function addressAsString(address) {
        var addressString = "";
        for (var key in address) {
            addressString += address[key] + ", ";
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
                    <button type="button" disabled={showDetailsComparision} onClick={confirmAuth}>Fetch ABDM Data</button>
                    {showError && <h6 className="error">{errorHealthId}</h6>}
                </div>
            </div>
            {loader && <Spinner />}
            {showDetailsComparision && <PatientDetails ndhmDetails={ndhmDetails} id={id} />}
        </div>
    );
}

export default OtpVerification;
