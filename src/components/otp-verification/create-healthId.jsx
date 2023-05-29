import React, { useState } from "react";
import {createDefaultHealthId, updateHealthId} from '../../api/hipServiceApi';
import Spinner from "../spinner/spinner";

const CreateHealthId = (props) => {
    const [ndhmDetails, setNdhmDetails] = [props.ndhmDetails,props.setNdhmDetails];
    const [errorHealthId, setErrorHealthId] = useState('');
    const [showError, setShowError] = useState(false);
    const [loader, setLoader] = useState(false);
    const [healthId, setHealthId] = useState('');

    async function createUserDefinedHealthId() {
        setLoader(true);
        setShowError(false);
        const response = await updateHealthId(healthId);
        if (response.data !== undefined) {
            mapHealthId(response.data.healthId);
        }
        else {
            setShowError(true)
            setErrorHealthId(response.details[0].message || response.message);
        }
        setLoader(false);
    }

    async function createDefault() {
        setLoader(true);
        setShowError(false);
        const response = await createDefaultHealthId();
        if (response.data !== undefined) {
            mapHealthId(response.data.healthId);
        }
        else {
            setShowError(true)
            setErrorHealthId(response.details[0].message || response.message);
        }
        setLoader(false);
    }


    function idOnChangeHandler(e) {
        setHealthId(e.target.value);
    }

    function mapHealthId(healthId){
        ndhmDetails.id = healthId;
        setNdhmDetails(ndhmDetails);
        props.setIsHealthIdCreated(true);
    }


    return (
        <div>
            <p className="note">You don't have ABHA Address/ Health Id linked to your ABHA Number</p>
             <div>
                <div className="qr-code-scanner">
                    <button name="default-healthId-btn" type="button" onClick={createDefault}>Create Default ABHA Address</button>
                </div>
                <div className="alternative-text">
                    OR
                </div>
                <div className="create-healthId" >
                    <label htmlFor="healthId">Enter ABHA Address </label>
                    <div className="create-healthId-btn" >
                        <div className="create-healthId-input">
                            <input type="text" id="healthId" name="healthId" value={healthId} onChange={idOnChangeHandler} />
                        </div>
                        <button type="button" onClick={createUserDefinedHealthId}>Create</button>
                        {showError && <h6 className="error">{errorHealthId}</h6>}
                    </div>
                </div>
                 {loader && <Spinner />}
            </div>
        </div>
    );
}

export default CreateHealthId;
