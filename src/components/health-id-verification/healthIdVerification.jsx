import React, {Fragment, useEffect, useState} from "react";
import axios from 'axios';
import './healthIdVerification.scss';

const HealthIdVerification = props => {
    const [healthId, setHealthId] = useState('');
    const [authModes, setAuthModes] = useState([]);
    const [selAuthMode, setSelAuthMode] = useState('');
    const [showHealthId, setShowHealthId] = useState(true);
    const [showOtpField, setShowOtpField] = useState(false);
    var hipData;

    let authModesList = authModes.length > 0
        && authModes.map((item, i) => {
            return (
                <option key={i} value={item}>{item}</option>
            )
        });
    useEffect(() =>{
        {window.addEventListener("message", function (hipData) {
            hipData = hipData;
        }, false)}
    } );

    function healthIdOnChangeHandler(e) {
        setHealthId(e.target.value);
    }

    function onDropdownSelected(e) {
        setSelAuthMode(e.target.value);
    }

    function confirmAuth(e) {
        window.parent.postMessage(healthId, "*");
    }

    async function verifyHealthId(e) {
        const headers = {
            'Content-Type': 'application/json'
        }
        const data = {
            "healthId": healthId,
            "purpose": "KYC_AND_LINK"
        }
        await axios.post("http://localhost:9052/v0.5/hip/fetch-modes", data, headers).then(res => {
            setAuthModes(res.data.authModes);
            setShowHealthId(false);
        });
    }

    async function initAuth(e) {
        const headers = {
            'Content-Type': 'application/json'
        }
        const data = {
            "healthId": healthId,
            "authMode": selAuthMode,
            "purpose": "KYC_AND_LINK"
        }
        await axios.post("http://localhost:9052/v0.5/hip/auth/init", data, headers).then(res => {
            setShowOtpField(true);
        });

    }

    return (
        <Fragment>
            <div className="NDHM-template">
                <table className="userAuth" cellspacing="0" cellpadding="0" width="100%">
                    <tr>
                        <td><label class="label-style">Enter Health ID </label></td>
                        <td><input type="text" name="healthId" value={healthId} onChange={healthIdOnChangeHandler}/>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <button class="verify-btn" name="verify-btn" type="button" onClick={verifyHealthId}
                                    disabled={!showHealthId}>Verify
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td><label hidden={showHealthId}>Preferred mode of Authentication </label></td>
                        <td>
                            <select id="dropdown" hidden={showHealthId} onChange={onDropdownSelected}>
                                {authModesList}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <button id="authenticate" hidden={showHealthId} onClick={initAuth}>Authenticate</button>
                        </td>
                    </tr>
                    <tr>
                        <td><label hidden={!showOtpField}>Enter OTP </label></td>
                        <td><input type="text" hidden={!showOtpField}/></td>
                    </tr>
                    <tr hidden={!showOtpField}>
                        <td></td>
                        <td>
                            <button id="confirm" onClick={confirmAuth}>Confirm</button>
                        </td>
                    </tr>
                </table>
            </div>
        </Fragment>
    );
}

export default HealthIdVerification;