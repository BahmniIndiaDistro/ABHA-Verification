import React, {useState} from "react";
import './creation.scss';
import {checkIfNotNull} from "../verifyHealthId/verifyHealthId";
import Spinner from "../spinner/spinner";

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');

    function otpOnChangeHandler(e) {
        setOtp(e.target.value);
    }

    return (
        <div>
           <div className="otp-verify" >
                <label htmlFor="otp">Enter OTP </label>
                <div className="otp-verify-input-btn" >
                    <div className="otp-verify-input">
                        <input type="text" id="otp" name="otp" value={otp} onChange={otpOnChangeHandler} />
                    </div>
                    <button type="button" type="submit">Confirm</button>
                </div>
            </div>
            {/*{loader && <Spinner />}*/}
        </div>
    );
}

export default VerifyOTP;