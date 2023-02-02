import React, {useEffect, useState} from "react";
import './creation.scss';
import VerifyOTP from "./verifyOtp";
import Spinner from "../spinner/spinner";
import {getAuthMethods, transaction, verifyOtpInput} from "../../api/hipServiceApi";
import {GoVerified} from "react-icons/all";

const LinkExistingABHAAddress = (props) => {
    const [loader, setLoader] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [error, setError] = useState('');
    const [otp, setOtp] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);
    const [authModes, setAuthmodes]= useState([])
    const [chosenAuthMode, setChosenAuthMode] = useState('');


    function onAuthModeChange(e) {
        setChosenAuthMode(e.target.value);
    }


    function resetToDefault(){
        setError('');
        setOtp('');
        setShowOtpInput(false);
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
                    setOtpVerified(true);
                }
            }
        }
    }

    async function fetchAuthModes() {
        resetToDefault()
        setLoader(true);
        var response = await getAuthMethods(props.healthIdNumber);
        if (response) {
            setLoader(false);
            if (response.data === undefined) {
                if (response.details !== undefined && response.details.length > 0)
                    setError(response.details[0].message)
                else
                    setError("An error occurred while processing your request")
            }
            else {
               setAuthmodes(response.data.authMethods);
            }
        }
    }

    async function authenticate() {
        setLoader(true);
        var response = await transaction(chosenAuthMode);
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


    useEffect(() => {
        if(otp !== '')
            verifyOtp();
    },[otp]);

    let authModesList = authModes.length > 0 && authModes.map((item, i) => {
        return (
            <option key={i} value={item}>{item}</option>
        )
    });

    return (
        <div>
            {!otpVerified && <div>
                <div className="abha">
                    <label htmlFor="abha-number" className="label">ABHA Number</label>
                    <div className="verify-abha-input-btn">
                        <div className="verify-abha-input">
                            <input type="text" id="abha-number" name="abha-number" value={props.healthIdNumber} disabled={true} />
                        </div>
                        <button type="submit" className="proceed" onClick={fetchAuthModes}>verify</button>
                    </div>
                </div>
                {authModes.length > 0 &&
                <div className="select-option">
                    <label htmlFor="auth-modes">Preferred mode of Authentication</label>
                    <div className="select-btn">
                        <div className="select">
                           <select id="auth-modes" onChange={onAuthModeChange}>
                               {authModesList}
                           </select>
                       </div>
                       <button type="button" disabled={chosenAuthMode === ''} onClick={authenticate}>Authenticate</button>
                   </div>
               </div>}
            {showOtpInput && <VerifyOTP setOtp={setOtp}/>}
            {error !== '' && <h6 className="error">{error}</h6>}
            {loader && <Spinner />}
            </div>}
            {otpVerified &&  <p className="note success"> <GoVerified /> <strong>ABHA Address Linked Successfully</strong></p>}
        </div>
    );
}

export default LinkExistingABHAAddress;
