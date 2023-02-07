import React, {useEffect, useState} from "react";
import './creation.scss';
import VerifyOTP from "./verifyOtp";
import Spinner from "../spinner/spinner";
import {createABHA, generateMobileOtp, verifyMobileOtp} from "../../api/hipServiceApi";
import {GoVerified} from "react-icons/all";
import Footer from "./Footer";
import ABHACreationSuccess from "./ABHACreationSuccess";
import PatientAadhaarProfile from "./PatientAadhaarProfile";

const VerifyMobile = (props) => {
    const [mobile, setMobile] = useState('');
    const [loader, setLoader] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [error, setError] = useState('');
    const [mobileLinked, setMobileLinked] = useState(false);
    const [proceed, setProceed] = useState(false);
    const [back, setBack] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);
    const [patient, setPatient] = useState({});
    const [abhaCreated, setABHACreated] = useState(false);


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
        if(otp !== '')
            verifyOtp();
        },[otp]);

    async function createABHANumber() {
        setLoader(true);
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
                setABHACreated(true);
            }
        }
    }

    useEffect(async () => {
        if (proceed) {
            await createABHANumber();
        }
    },[proceed])



    return (
        <div>
            {!back && !proceed &&
                <div>
                    <div>
                        <div className="mobile">
                            <label htmlFor="mobile" className="label">Enter Mobile Number</label>
                            <div className="verify-mobile-input-btn">
                                <div className="verify-mobile-input">
                                    <input type="text" id="mobile" name="mobile" value={mobile} onChange={OnChangeHandler} />
                                </div>
                                <button name="verify-btn" type="submit" onClick={onVerify}>Verify</button>
                            </div>
                        </div>
                        <div className="message">This number will be used to authenticate your ABHA Number.
                            It is recommended to use your AADHAAR linked mobile number
                        </div>
                    </div>
                    {error !== '' && <h6 className="error">{error}</h6>}
                    {showOtpInput && <VerifyOTP setOtp={setOtp}/>}
                    {otpVerified && <p className="note success"> <GoVerified /> <strong>OTP Verfied Successfully</strong></p>}
                    {mobileLinked && <p className="note success"> <GoVerified /> <strong>mobile already Linked </strong></p>}
                    {loader && <Spinner />}
                    <Footer setBack={setBack}/>
                    {otpVerified && <Footer setProceed={setProceed}/>}
                </div>}
                {back && <PatientAadhaarProfile patient={props.patient}/>}
                {proceed && !abhaCreated && <Spinner />}
                {abhaCreated && <ABHACreationSuccess patient={patient}/>}
            </div>
    );
}
export default VerifyMobile;
