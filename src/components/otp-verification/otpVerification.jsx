import React, { useState } from "react";
import {authConfirm} from '../../api/hipServiceApi';

const OtpVerification = (props) => {
    const [otp, setOtp] = useState('');
    const healthId = props.healthId;
    const selectedAuthMode = props.selectedAuthMode;

   async function confirmAuth(e) {
        window.parent.postMessage("sdss", "*");
        const response = await authConfirm(healthId,otp);
    }
      function otpOnChangeHandler(e) {
        setOtp(e.target.value);
    }

    return (
        <div className="otp-verify" >
            <label htmlFor="otp">Enter OTP </label>
            <div className="otp-verify-input-btn" >
                <div className="otp-verify-input">
                    <input type="text" id="otp" name="otp" value={otp} onChange={otpOnChangeHandler} />
                </div>
                <button id="confirm" type="button" onClick={confirmAuth}>Confirm</button>
            </div>
        </div>
    );
}

export default OtpVerification;
