import React, { useState, useEffect } from "react";
import "./creation.scss";
import Spinner from "../spinner/spinner";
import { verifyAadhaarOtpAndCreateABHA } from "../../api/hipServiceApi";

const VerifyOTPAndCreateABHA = (props) => {
	const [otp, setOtp] = useState("");
	const [mobile, setMobile] = useState("");
	const [confirmDisabled, setConfirmDisabled] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

	function otpOnChangeHandler(e) {
		setOtp(e.target.value);
	}

	function mobileOnChangeHandler(e) {
		setMobile(e.target.value);
	}

	useEffect(() => {
		if (otp.length === 6 && mobile.length === 10) {
			setConfirmDisabled(false);
		} else {
			setConfirmDisabled(true);
		}
	}, [otp, mobile]);

	async function verifyOTP() {
		setIsLoading(true);
        var response = await verifyAadhaarOtpAndCreateABHA(otp, mobile);
        setIsLoading(false);
        console.log(response);
	}

	return (
		<div>
			<div className="aadhaar">
				<label htmlFor="otp" className="label">
					Enter OTP sent to the Mobile Number {props.mobile}
				</label>
				<div className="otp-verify-input-btn">
					<div className="otp-verify-input">
						<input
							type="text"
							id="otp"
							name="otp"
							value={otp}
							onChange={otpOnChangeHandler}
						/>
					</div>
				</div>
			</div>
			<div className="aadhaar">
				<label htmlFor="mobile" className="label">
					Mobile Number used for ABHA Communications
				</label>
				<div className="verify-mobile-input-btn">
					<div className="verify-mobile-input">
						<input
							type="text"
							id="mobile"
							name="mobile"
							value={mobile}
							onChange={mobileOnChangeHandler}
						/>
					</div>
				</div>
			</div>
			<div className="center">
				<button type="button" disabled={confirmDisabled} onClick={verifyOTP}>
					Confirm
				</button>
			</div>
			{isLoading && <Spinner />}
		</div>
	);
};

export default VerifyOTPAndCreateABHA;
