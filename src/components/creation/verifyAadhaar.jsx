import React, {useEffect, useState} from "react";
import './creation.scss';
import VerifyOTP from "./verifyOtp";
import Spinner from "../spinner/spinner";
import {generateAadhaarOtp, verifyAadhaarOtp} from "../../api/hipServiceApi";
import PatientAadhaarProfile from "./PatientAadhaarProfile";

const VerifyAadhaar = () => {
    const [aadhaar, setAadhaar] = useState('');
    const [loader, setLoader] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [error, setError] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);
    const [patient, setPatient] = useState({});
    const [otp, setOtp] = useState('');
    const [otpReceivingNumber, setOtpReceivingNumber] = useState(false);
    const [back, setBack] = useState(false);


    function idOnChangeHandler(e) {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            setAadhaar(e.target.value);
        }
        setError('');
        setShowOtpInput(false);
    }

    async function onVerify() {
        setError('');
        setShowOtpInput(false);
        if (aadhaar === '') {
            setError("Aadhaar number cannot be empty")
        } else {
            setLoader(true);
            var response = await generateAadhaarOtp(aadhaar);
            if(response){
                setLoader(false);
                if(response.data === undefined){
                    if(response.details !== undefined && response.details.length > 0)
                       setError(response.details[0].message)
                    else
                        setError("An error occurred while processing your request")
                }
                else {
                    setShowOtpInput(true);
                    setOtpReceivingNumber(response.data.mobileNumber);
                }
            }
        }
    }

    async function verifyOtp() {
        if (otp === '') {
            setError("otp cannot be empty")
        } else {
            setLoader(true);
            var response = await verifyAadhaarOtp(otp);
            if(response){
                setLoader(false);
                if(response.data === undefined){
                    if(response.details !== undefined && response.details.length > 0)
                        setError(response.details[0].message)
                    else
                        setError("An error occurred while processing your request")
                }
                else {
                    setPatient(response.data);
                    setOtpVerified(true);
                }
            }
        }
    }

    useEffect(() => {
        if(otp !== '')
            verifyOtp();
    },[otp]);

    useEffect (() => {
        if (back) {
            setAadhaar('');
            setShowOtpInput(false);
            setOtp('');
            setError('');
            setLoader(false);
            setOtpVerified(false);
            setBack(false);
        }
    },[back]);

    return (
       <div className="abha-creation">
           {!otpVerified && <div>
           <div className="aadhaar">
                <label htmlFor="aadhaar" className="label">Enter AADHAAR Number</label>
                <div className="verify-aadhaar-input-btn">
                    <div className="verify-aadhaar-input">
                        <input type="text" id="aadhaar" name="aadhaar" value={aadhaar} onChange={idOnChangeHandler} />
                    </div>
                    <button name="verify-btn" type="submit" onClick={onVerify}>Verify</button>
                </div>
            </div>
            {showOtpInput && <VerifyOTP setOtp={setOtp} mobile={otpReceivingNumber}/>}
            {error !== '' && <h6 className="error">{error}</h6>}
            {loader && <Spinner />}
           </div>}
           {otpVerified && <PatientAadhaarProfile patient={patient} setBack={setBack}/>}
        </div>

    );
}
export default VerifyAadhaar;
