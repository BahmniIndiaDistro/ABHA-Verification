import React, {useEffect, useState} from "react";
import './creation.scss';
import VerifyOTP from "./verifyOtp";
import Spinner from "../spinner/spinner";
import {fetchGlobalProperty, generateAadhaarOtp, verifyAadhaarOtp} from "../../api/hipServiceApi";
import PatientAadhaarProfile from "./PatientAadhaarProfile";
import AadhaarConsent from "./AadhaarConsent";
import AuthModes from "./AuthModes";
import DemoAuth from "../demo-auth/demoAuth";
import {enableDemographics} from "../../api/constants";

const VerifyAadhaar = props => {

    const [aadhaar, setAadhaar] = useState('');
    const [loader, setLoader] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [error, setError] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);
    const [patient, setPatient] = useState({});
    const [otp, setOtp] = useState('');
    const [otpReceivingNumber, setOtpReceivingNumber] = useState(false);
    const [back, setBack] = useState(false);
    const [isConsentGranted, setConsentGrated] = useState(false);
    const [aadhaarError, setAadhaarError] = useState('');
    const [showAuthMode, setShowAuthMode] = useState(false);
    const [showDemographics, setShowDemographics] = useState(false);
    const [selectedAuthMode, setSelectedAuthMode] = useState('');


    function idOnChangeHandler(e) {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            setAadhaar(e.target.value);
        }
        setAadhaarError('');
        setShowOtpInput(false);
    }

    async function getAuthModes(){
        setAadhaarError('');
        if (aadhaar === '') {
            setAadhaarError("Aadhaar number cannot be empty")
        }
        else {
            setShowAuthMode(true);
        }
    }

    async function onVerify() {
        setShowOtpInput(false);
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

    async function verifyOtp() {
        setError('');
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

    useEffect(async () => {
        setError('');
        if(selectedAuthMode === "AADHAAR OTP") {
            await onVerify();
        }
        if(selectedAuthMode === "AADHAAR DEMOGRAHICS") {
            await checkIfAuthModeSupported();
        }
    }, [selectedAuthMode])

    async function checkIfAuthModeSupported(){
        setLoader(true);
        const response = await fetchGlobalProperty(enableDemographics);
        if (response.Error === undefined && response !== '' && response) {
            setShowDemographics(true);
        } else {
            setError("The selected Authentication Mode is currently not supported!");
        }
        setLoader(false);
    }

    return (
       <div className="abha-creation">
           {!showDemographics && !otpVerified && <div>
           <div className="aadhaar">
                <label htmlFor="aadhaar" className="label">Enter AADHAAR Number</label>
                <div className="verify-aadhaar-input-btn">
                    <div className="verify-aadhaar-input">
                        <input type="text" id="aadhaar" name="aadhaar" value={aadhaar} onChange={idOnChangeHandler} />
                    </div>
                </div>
            </div>
            {aadhaarError !== '' && <h6 className="error">{aadhaarError}</h6>}
            {!showAuthMode && <AadhaarConsent setConsentGrated={setConsentGrated}/>}
            {!showAuthMode && !loader && <div className="center">
                <button type="button" disabled={!isConsentGranted} name="verify-btn" onClick={getAuthModes}>Accept & Proceed</button>
            </div>}
            {showAuthMode &&
                <AuthModes showOtpInput={showOtpInput} setSelectedAuthMode={setSelectedAuthMode}/>
            }
            {showOtpInput && <VerifyOTP setOtp={setOtp} mobile={otpReceivingNumber}/>}
            {error !== '' && <h6 className="error">{error}</h6>}
            {loader && <Spinner />}
           </div>}
           {showDemographics && <DemoAuth aadhaar={aadhaar} isAadhaarDemoAuth={true} />}
           {otpVerified && <PatientAadhaarProfile patient={patient} setBack={setBack} />}
        </div>

    );
}

export default VerifyAadhaar;
