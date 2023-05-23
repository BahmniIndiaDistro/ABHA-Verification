import React, { useState } from "react";
import {authConfirm, healthIdConfirmOtp} from '../../api/hipServiceApi';
import Spinner from '../spinner/spinner';
import {checkIfNotNull} from "../verifyHealthId/verifyHealthId";
import {getDate} from "../Common/DateUtil";

const OtpVerification = (props) => {
    const [otp, setOtp] = useState('');
    const [ndhmDetails, setNdhmDetails] = [props.ndhmDetails,props.setNdhmDetails];
    const [errorHealthId, setErrorHealthId] = useState('');
    const [showError, setShowError] = useState(false);
    const [loader, setLoader] = useState(false);


    async function confirmAuth() {
        setLoader(true);
        setShowError(false);
        if(!props.isHealthNumberNotLinked){
            const response = await healthIdConfirmOtp(otp,props.selectedAuthMode);
            if(response.data !== undefined) {
                mapPatient(response.data);
            }
            else {
                setShowError(true);
                setErrorHealthId(response.details[0].message || response.message);
            }
        }
        else {
            const response = await authConfirm(props.id, otp);
            if (response.error !== undefined || response.Error !== undefined) {
                setShowError(true)
                setErrorHealthId((response.Error && response.Error.Message) || response.error.message);
            }
            else {
                setNdhmDetails(parseNdhmDetails(response));
            }
        }


        setLoader(false);
    }

    function mapPatient(patient){
        var identifier = patient?.mobile !== undefined ? [{
            value: patient.mobile
        }] : undefined;
        var address =  {
            line: patient?.address,
            city: patient?.townName,
            district: patient?.districtName,
            state: patient?.stateName,
            pincode: patient?.pincode
        };
        const ndhm = {
            healthIdNumber: patient?.healthIdNumber,
            id: patient?.healthId,
            gender: patient.gender,
            name: patient.name,
            isBirthDateEstimated: patient?.birthdate !== undefined ? false : (patient?.monthOfBirth == null || patient?.dayOfBirth == null),
            dateOfBirth:  patient?.birthdate === undefined  ? getDate(patient) : patient?.birthdate.split('-').reverse().join('-'),
            address: address,
            identifiers: identifier,
            uuid: patient?.uuid
        };
        setNdhmDetails(ndhm);
    }

    function otpOnChangeHandler(e) {
        setOtp(e.target.value);
    }

    function parseNdhmDetails(patient) {
        const ndhm = {
            id: patient.id,
            gender: patient.gender,
            name: patient.name,
            isBirthDateEstimated: patient?.monthOfBirth == null || patient?.dayOfBirth == null,
            dateOfBirth: getDate(patient),
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
