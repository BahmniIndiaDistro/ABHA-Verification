import React, {useState} from "react";
import './creation.scss';
import VerifyOTP from "./verifyOtp";
import Spinner from "../spinner/spinner";
import VerifyMobile from "./VerifyMobile";

const Creation = () => {
    const [id, setId] = useState('');
    const [loader, setLoader] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [error, setError] = useState('');
    const [otpVerified, setVerified] = useState(false);

    function idOnChangeHandler(e) {
        setId(e.target.value);
        setError('');
        setShowOtpInput(false);
    }

    function onVerify(){
        if(id === ''){
            setError("Aadhaar number cannot be empty")
        }
        else{
            setLoader(true);
            //make service call
            //setLoader false once received response showOtpInupt to true
            //check if any error from call if so setError
        }
    }

    return (
       <div className="abha-creation">
           {!otpVerified && <div>
           <div className="aadhaar">
                <label htmlFor="aadhaar" className="label">Enter AADHAAR Number</label>
                <div className="verify-aadhaar-input-btn">
                    <div className="verify-aadhaar-input">
                        <input type="text" id="aadhaar" name="aadhaar" value={id} onChange={idOnChangeHandler} />
                    </div>
                    <button name="verify-btn" type="submit" onClick={onVerify}>Verify</button>
                </div>
            </div>
            {error !== '' && <h6 className="error">{error}</h6>}
            {loader && <Spinner />}
            {showOtpInput && <VerifyOTP />}
           </div>}
           {otpVerified && <VerifyMobile />}
        </div>

    );
}


export default Creation;