import React, { useState } from "react";
import { authConfirm } from '../../api/hipServiceApi';
import PatientDetails from '../patient-details/patientDetails';
import Spinner from '../spinner/spinner';
import {checkIfNotNull} from "../verifyHealthId/verifyHealthId";

const OtpVerification = (props) => {
    const [otp, setOtp] = useState('');
    const [ndhmDetails, setNdhmDetails] = [props.ndhmDetails,props.setNdhmDetails];
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
        }
        setLoader(false);
    }

    function otpOnChangeHandler(e) {
        setOtp(e.target.value);
    }

    function getBirthDate(patient) {
        return  new Date(patient.yearOfBirth,(patient?.monthOfBirth ?? 1) - 1,patient?.dayOfBirth ?? 1)
    }


    function parseNdhmDetails(patient) {
        const ndhm = {
            id: patient.id,
            gender: patient.gender,
            name: patient.name,
            isBirthDateEstimated: patient?.monthOfBirth == null || patient?.dayOfBirth == null,
            dateOfBirth: getBirthDate(patient),
            address: patient.address,
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
            {!checkIfNotNull(ndhmDetails) && <div className="otp-verify" >
                <label htmlFor="otp">Enter OTP </label>
                <div className="otp-verify-input-btn" >
                    <div className="otp-verify-input">
                        <input type="text" id="otp" name="otp" value={otp} onChange={otpOnChangeHandler} />
                    </div>
                    <button type="button" disabled={checkIfNotNull(ndhmDetails)} onClick={confirmAuth}>Fetch ABDM Data</button>
                    {showError && <h6 className="error">{errorHealthId}</h6>}
                </div>
            </div>}
            {loader && <Spinner />}
        </div>
    );
}

export default OtpVerification;
