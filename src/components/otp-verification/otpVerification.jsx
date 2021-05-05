import React, { useState } from "react";

const OtpVerification = (props) => {
    const [otp, setOtp] = useState('');
    const healthId = props.healthId;
    const selectedAuthMode = props.selectedAuthMode;

    function confirmAuth(e) {
        window.parent.postMessage("sdss", "*");
    }
      function otpOnChangeHandler(e) {
        setOtp(e.target.value);
    }

    return (
        <div className="otp-verify" >
            <div className="otp-verify-input">
                <label >Enter OTP </label>
                <input type="text" id="otp" name="otp" value={otp} onChange={otpOnChangeHandler} />
            </div>
            <div className="otp-verify-btn" >
                <button id="confirm" type="button" onClick={confirmAuth}>Confirm</button>
            </div>
        </div>
    );
}

export default OtpVerification;
