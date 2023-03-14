import React, {useEffect, useState} from "react";
import './creation.scss';
import VerifyOTP from "./verifyOtp";
import Spinner from "../spinner/spinner";
import {getUserToken, mobileEmailInit, verifyOtpInput} from "../../api/hipServiceApi";
import LinkExistingABHAAddress from "./LinkExistingABHAAddress";
import Footer from "./Footer";
import CheckIdentifierExists from "../Common/CheckIdentifierExists";

const VerifyMobileEmail = (props) => {
    const [mobile, setMobile] = useState('');
    const [loader, setLoader] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [error, setError] = useState('');
    const [otp, setOtp] = useState('');
    const [mappedPhrAddress, setMappedPhrAddress] = useState([]);
    const [abhaAddress, setABHAAddress] = useState('');
    const [proceed, setProceed] = useState(false);
    const [ABHAAlreadyLinked, setABHAAlreadyLinked ] = useState(false);
    const [ABHALinkError, setABHALinkError]=useState('');
    const [back, setBack] = useState(false);
    const [link, goToLink] = useState(false);
    const [ABHAChosen, setABHAChosen ] = useState(false);
    const [ABHAAlreadyExists, setABHAAlreadyExists] = useState(false);
    const [matchingPatientUuid, setMatchingPatientUuid] = useState(undefined);
    const [healthNumberAlreadyExists, setHealthNumberAlreadyExists] = useState(false);


    function OnChangeHandler(e) {
        setMobile(e.target.value);
        resetToDefault()
    }

    function resetToDefault(){
        setError('');
        setShowOtpInput(false);
        setABHALinkError('');
        setOtp('');
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
        setABHAAddress('');
        setABHAAlreadyLinked(false);
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
                if(response.data.healthIdNumber !== undefined){
                    if(response.data.healthIdNumber === props.patient.healthIdNumber){
                        setABHALinkError("ABHA Address " + abhaAddress + " is already linked to the ABHA Number");
                    }
                    else {
                        setABHALinkError("ABHA Address " + abhaAddress + " is already linked to the different ABHA Number");
                    }
                    setABHAAlreadyLinked(true);
                    setMobile('');
                    setShowOtpInput(false);
                }
                else {
                    setProceed(true);
                }
            }
        }
    }

    function setToInitialValues() {
        setABHALinkError('');
        setABHAAlreadyLinked(true);
        setMobile('');
        setShowOtpInput(false);
        setMappedPhrAddress([]);
        goToLink(false);
        setOtp('');
        setLoader(false);
        setError('');
        setProceed(false);
        setBack(false);
    }


    useEffect(() => {
        if(otp !== '') {
            verifyOtp();
        }
        if(back || link){
            setToInitialValues()
        }
    },[otp,back,link]);

    useEffect(() => {
        if(ABHAChosen){
            authenticate();
        }
    },[ABHAChosen])

    function onSelect(abha){
        setABHAChosen(false);
        setError('');
        setABHAAddress(abha);
    }

    useEffect(() => {
        props.mappedPatient.uuid = matchingPatientUuid;
    },[matchingPatientUuid])

    let abhaAddressList = mappedPhrAddress.length > 0 && mappedPhrAddress.map((item, i) => {
        return (
            <button onClick={() => onSelect(mappedPhrAddress[i]) } className={abhaAddress === item ? "active" : "abha-list"}>{item}</button>
        )
    });


    return (
        <div>
            {ABHALinkError != '' && <p className="error-msg">{ABHALinkError}</p>}
            {(ABHAAlreadyLinked || (!proceed && mappedPhrAddress.length === 0)) &&
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
                {error !== '' && <h6 className="error">{error}</h6>}
                {loader && <Spinner />}
                <Footer setBack={props.setBack}/>
            </div>}
            {!proceed && !ABHAAlreadyLinked && mappedPhrAddress.length > 0 &&
            <div>
                <div>
                    <div className="choose-abha-address">
                        <div className="abha-list-label">
                            <label htmlFor="abha-address">Choose a ABHA Address to link</label>
                        </div>
                        <div>
                            {abhaAddressList}
                        </div>
                    </div>
                    <CheckIdentifierExists id={abhaAddress} setABHAAlreadyExists={setABHAAlreadyExists} setMatchingPatientUuid={setMatchingPatientUuid} setHealthNumberAlreadyExists={setHealthNumberAlreadyExists}/>
                    {error !== '' && <h6 className="error">{error}</h6>}
                    {loader && <Spinner />}
                </div>
                <Footer setBack={goToLink}/>
                {!ABHAAlreadyExists && <Footer setProceed={setABHAChosen}/>}
                {ABHAAlreadyExists && !healthNumberAlreadyExists && <Footer setProceed={setABHAChosen}/>}
            </div>
            }
            {proceed && <LinkExistingABHAAddress patient={props.patient} healthId={abhaAddress} mappedPatient={props.mappedPatient} setBack={setBack}/>}
        </div>
    );
}
export default VerifyMobileEmail;
