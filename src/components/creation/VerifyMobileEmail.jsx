import React, {useEffect, useState} from "react";
import './creation.scss';
import VerifyOTP from "./verifyOtp";
import Spinner from "../spinner/spinner";
import {getUserToken, mobileEmailInit, verifyOtpInput} from "../../api/hipServiceApi";
import LinkABHAAddress from "./LinkABHAAddress";

const VerifyMobileEmail = (props) => {
    const [mobile, setMobile] = useState('');
    const [loader, setLoader] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [error, setError] = useState('');
    const [otp, setOtp] = useState('');
    const [mappedPhrAddress, setMappedPhrAddress] = useState([]);
    const [abhaAddress, setABHAAddress] = useState('');
    const [proceed, setProceed] = useState(false);


    function OnChangeHandler(e) {
        setMobile(e.target.value);
        resetToDefault()
    }

    function resetToDefault(){
        setError('');
        setShowOtpInput(false);
    }

    async function onVerify() {
        resetToDefault()
        if (mobile === '') {
            setError("Mobile number cannot be empty")
        } else {
            setLoader(true);
            var response = await mobileEmailInit(mobile);
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
    }

    async function verifyOtp() {
        if (otp === '') {
            setError("otp cannot be empty")
        } else {
            setLoader(true);
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
                    setMappedPhrAddress(response.data.mappedPhrAddress);
                }
            }
        }
    }

    function onABHAAddressSelected(e) {
        setABHAAddress(e.target.value);
    }


    async function authenticate() {
        setLoader(true);
        var response = await getUserToken(abhaAddress);
        if (response) {
            setLoader(false);
            if (response.data === undefined) {
                if (response.details !== undefined && response.details.length > 0)
                    setError(response.details[0].message)
                else
                    setError("An error occurred while processing your request")
            }
            else {
                setProceed(true);
            }
        }
    }


    useEffect(() => {
        if(otp !== '') {
            console.log("hi " + otp);
            verifyOtp();
        }
    },[otp]);

    let abhaAddressList = mappedPhrAddress.length > 0 && mappedPhrAddress.map((item, i) => {
        return (
            <option key={i} value={item}>{item}</option>
        )
    });


    return (
        <div>
            {!proceed &&
            <div>
                <div className="mobile">
                    <label htmlFor="mobile" className="label">Enter Mobile Number / Email</label>
                    <div className="verify-mobile-input-btn">
                        <div className="verify-mobile-input">
                            <input type="text" id="mobile" name="mobile" value={mobile} onChange={OnChangeHandler} />
                        </div>
                        <button name="verify-btn" type="submit" onClick={onVerify}>Verify</button>
                    </div>
                </div>
                {showOtpInput && <VerifyOTP setOtp={setOtp}/>}
                {mappedPhrAddress.length > 0 &&
                <div className="select-option">
                    <label htmlFor="abha-address">Choose a ABHA Address to link</label>
                    <div className="select-btn">
                        <div className="select">
                            <select id="abha-address" onChange={onABHAAddressSelected}>
                                {abhaAddressList}
                            </select>
                        </div>
                        <button type="button" className="proceed"  disabled={abhaAddress === ''} onClick={authenticate}>Proceed</button>
                    </div>
                </div>}
                {error !== '' && <h6 className="error">{error}</h6>}
                {loader && <Spinner />}
            </div>}
            {proceed && <LinkABHAAddress healthIdNumber={props.healthIdNumber}/>}
        </div>
    );
}

export default VerifyMobileEmail;
