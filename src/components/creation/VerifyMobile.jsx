import React, {useEffect, useState} from "react";
import './creation.scss';
import VerifyOTP from "./verifyOtp";
import Spinner from "../spinner/spinner";
import {createABHA, generateMobileOtp, verifyMobileOtp} from "../../api/hipServiceApi";
import {GoVerified} from "react-icons/all";
import Footer from "./Footer";
import LinkABHAAddress from "./LinkABHAAddress";

const VerifyMobile = (props) => {
    const [mobile, setMobile] = useState('');
    const [loader, setLoader] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [error, setError] = useState('');
    const [mobileLinked, setMobileLinked] = useState(false);
    const [proceed, setProceed] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);
    const [patient, setPatient] = useState({});
    const [abhaCreated, setABHACreated] = useState(false);
    const [showSuccessMsg, setShowSuccessMsg] = useState(true);

    function OnChangeHandler(e) {
        setMobile(e.target.value);
        resetToDefault()
    }

    function resetToDefault(){
        setError('');
        setShowOtpInput(false);
        setOtp('');
        setMobileLinked(false);
        setOtpVerified(false);
    }

    async function onVerify() {
        resetToDefault()
        if (mobile === '') {
            setError("Mobile number cannot be empty")
        } else {
            setLoader(true);
            var response = await generateMobileOtp(mobile);
            if (response) {
                setLoader(false);
                if (response.data === undefined) {
                    if (response.details !== undefined && response.details.length > 0)
                        setError(response.details[0].message)
                    else
                        setError("An error occurred while processing your request")
                }
                else {
                    if(response.data?.mobileLinked === "true")
                        setMobileLinked(true)
                    else
                        setShowOtpInput(true);
                }
            }
        }
    }

    async function verifyOtp() {
        if (otp === '') {
            setError("otp cannot be empty")
        } else {
            setLoader(true);
            var response = await verifyMobileOtp(otp);
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


    useEffect(() => {
        setError('');
        if(otp !== '')
            verifyOtp();
        },[otp]);

    async function createABHANumber() {
        setLoader(true);
        setShowSuccessMsg(false);
        var response = await createABHA();
        if (response) {
            setLoader(false);
            if (response.data === undefined) {
                if (response.details !== undefined && response.details.length > 0)
                    setError(response.details[0].message)
                else
                    setError("An error occurred while processing your request")
            }
            else {
                setPatient(response.data);
                props.mappedPatient.healthIdNumber = response.data.healthIdNumber;
                if (props.mappedPatient.identifiers === undefined) {
                    props.mappedPatient.identifiers = response.data?.mobile !== undefined ? [{
                        value:  response.data?.mobile
                    }] : undefined
                }
                setABHACreated(true);
            }
        }
    }


    return (
        <div>
            {!proceed &&
                <div>
                    <div>
                        <div className="mobile">
                            <label htmlFor="mobile" className="label">Enter Mobile Number</label>
                            <div className="verify-mobile-input-btn">
                                <div className="verify-mobile-input">
                                    <input type="text" id="mobile" name="mobile" value={mobile} onChange={OnChangeHandler} disabled={abhaCreated}/>
                                </div>
                                <button name="verify-btn" type="submit" onClick={onVerify} disabled={abhaCreated}>Verify</button>
                            </div>
                        </div>
                        <div className="message">This number will be used to authenticate your ABHA Number.
                            It is recommended to use your AADHAAR linked mobile number
                        </div>
                    </div>
                    {showOtpInput && <VerifyOTP setOtp={setOtp} disabled={otpVerified || mobileLinked}/>}
                    {error !== '' && <h6 className="error">{error}</h6>}
                    {showSuccessMsg && <div>
                        {otpVerified && <p className="note success"><GoVerified/> <strong>OTP Verfied Successfully</strong></p>}
                        {mobileLinked && <p className="note success"><GoVerified/> <strong>mobile already Linked </strong></p>}
                    </div>}
                    {(otpVerified || mobileLinked) &&
                    <div className="create-btn">
                        <button type="button" className="proceed" onClick={createABHANumber} disabled={abhaCreated}>
                            Create ABHA Number
                        </button>
                    </div>}
                    {loader && <Spinner/>}
                </div>}
                {!proceed && abhaCreated &&
                <div>
                    <p className="note success"><GoVerified/> <strong>ABHA Created Successfully</strong></p>
                    <p className="note"><strong>ABHA Number: </strong> {patient.healthIdNumber} </p>
                    <Footer setBack={props.setBack} setProceed={setProceed}/>
                </div>}
                {proceed && <LinkABHAAddress patient={patient} mappedPatient={props.mappedPatient}/>}
            </div>
    );
}
export default VerifyMobile;
