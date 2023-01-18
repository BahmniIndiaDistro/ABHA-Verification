import React, {useEffect, useState} from "react";
import './creation.scss';
import Spinner from "../spinner/spinner";
import Footer from "./Footer";
import {createABHA, verifyAadhaarOtp} from "../../api/hipServiceApi";
import ABHACreationSuccess from "./ABHACreationSuccess";

const CreateABHA = () => {
    const [abhaAddress, setAbhaAddress] = useState('');
    const [proceed, setProceed] = useState(false);
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState('');
    const [patient, setPatient] = useState({});

    function OnChangeHandler(e) {
        setAbhaAddress(e.target.value);
    }

    async function onVerify() {
        setLoader(true);
        var response = await createABHA(abhaAddress);
        if (response) {
            setLoader(false);
            if (response.data === undefined) {
                if (response.details !== undefined && response.details.length > 0)
                    setError(response.details[0].message)
                else
                    setError("An error occurred while processing your request")
            }
            else {
                setPatient(response.data);
            }
        }
    }

    useEffect(async () => {
        if (proceed) {
            await onVerify();
            setProceed(false);
        }
    },[proceed])


    return (
        <div>
            {JSON.stringify(patient) === JSON.stringify({}) &&
            <div>
                <div className="abha-address" >
                    <label htmlFor="abhaAdddress">Enter ABHA ADDRESS </label>
                    <div className="abha-adddress-input" >
                            <input type="text" id="abhaAdddress" name="abhaAdddress" value={abhaAddress} onChange={OnChangeHandler} />
                    </div>
                </div>
                <p className="note">You can still click on proceed without entering ABHA Address</p>
                {error !== '' && <h6 className="error">{error}</h6>}
                {loader && <Spinner />}
                <Footer setProceed={setProceed}/>
            </div>}
            {JSON.stringify(patient) !== JSON.stringify({}) && <ABHACreationSuccess patient={patient}/>}
        </div>
    );
}
export default CreateABHA;