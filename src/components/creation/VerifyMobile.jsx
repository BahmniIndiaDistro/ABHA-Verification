import React, {useEffect, useState} from "react";
import './creation.scss';
import VerifyOTP from "./verifyOtp";
import Spinner from "../spinner/spinner";
import {generateMobileOtp, verifyMobileOtp} from "../../api/hipServiceApi";
import CreateABHA from "./CreateABHA";
import {GoVerified} from "react-icons/all";
const VerifyMobile = (props) => {
    const [mobile, setMobile] = useState('');
    const [loader, setLoader] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [error, setError] = useState('');
    const [mobileLinked, setMobileLinked] = useState(false);
    const [proceed, setProceed] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);


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
            console.log(response);
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

    function onBack(){
        props.setGoBack(true);
    }

    function onClick(){
       setProceed(true);
    }


    return (
        <div>
            {console.log(props.goBack)}
                { !proceed &&
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
                    <div className="footer">
                        <div className="left-button">
                            <button type="button" type="button" className="back" onClick={onBack}>Back</button>
                        </div>
                        {(otpVerified || mobileLinked) && <div className="right-button">
                            <button type="button" type="button" className="proceed" onClick={onClick}>Proceed</button>
                        </div>}
                    </div>
                </div>}
                {proceed && <CreateABHA />}
            </div>
    );
}
export default VerifyMobile;
