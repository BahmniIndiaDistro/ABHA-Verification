import React, {useState} from "react";
import './creation.scss';


const VerifyOTP = (props) => {
    const [sendOtp] = [props.setOtp];
    const [otp,setOtp] = useState('');

    function otpOnChangeHandler(e) {
        setOtp(e.target.value);
    }

    function send(){
        sendOtp(otp);
    }

    return (
        <div>
           <div className="otp-verify" >
                <label htmlFor="otp">Enter OTP sent to the Mobile Number {props.mobile}</label>
                <div className="otp-verify-input-btn" >
                    <div className="otp-verify-input">
                        <input type="text" id="otp" name="otp" value={otp} onChange={otpOnChangeHandler} />
                    </div>
                    <button type="button" type="submit" onClick={send}>Confirm</button>
                </div>
            </div>
        </div>
    );
}

export default VerifyOTP;