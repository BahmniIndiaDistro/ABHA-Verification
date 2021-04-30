import React, {Fragment, useEffect, useState} from "react";

import {verifyHealthIdSrv, initAuthSrv} from "./healthIdVerficationService";
import './healthIdVerification.scss';

const HealthIdVerification = props => {
    const [healthId, setHealthId] = useState('');
    const [authModes, setAuthModes] = useState([]);
    const [selAuthMode, setSelAuthMode] = useState('');
    const [showHealthId, setShowHealthId] = useState(true);
    const [showOtpField, setShowOtpField] = useState(false);
    var hipUrl;

    let authModesList = authModes.length > 0
        && authModes.map((item, i) => {
            return (
                <option key={i} value={item}>{item}</option>
            )
        });
    useEffect(() =>{
        window.addEventListener("message", function (hipData) {
            hipUrl = hipData.data.value;
            console.log("HIP URL received from registration page" + hipUrl);
        }, false)}
     ,[]);

    function healthIdOnChangeHandler(e) {
        setHealthId(e.target.value);
    }

    function onDropdownSelected(e) {
        setSelAuthMode(e.target.value);
    }

    const verifyHealthId = async (e) => {
        const response =  await verifyHealthIdSrv(healthId);
        if (response.error) {
            //TODO when fails ?
        } else {
            setAuthModes(response.result.authModes);
            setShowHealthId(false);
        }
    };
    const initAuth = async (e) => {
        const response = await initAuthSrv(healthId, selAuthMode);
        if (response.error) {
            //TODO when fails ?
        } else {
            setShowOtpField(true);
        };
    };

    function confirmAuth(e) {
        window.parent.postMessage(healthId, "*");
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