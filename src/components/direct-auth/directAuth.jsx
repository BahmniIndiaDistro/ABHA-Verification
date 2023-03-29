import React, {useState} from "react";
import {checkAndGetPatientDetails} from '../../api/hipServiceApi';
import Spinner from '../spinner/spinner';
import {checkIfNotNull} from "../verifyHealthId/verifyHealthId";
import {getDate} from "../Common/DateUtil";

const DirectAuth = (props) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [loader, setLoader] = useState(false);
    const [ndhmDetails, setNdhmDetails] = [props.ndhmDetails,props.setNdhmDetails];

    const id = props.healthId;

    async function getPatientDetails() {
        setLoader(true);
        setShowError(false)
        const response = await checkAndGetPatientDetails(id);
        console.log("response" + JSON.stringify(response));
        if (response.error !== undefined) {
            setShowError(true)
            setErrorMessage(response.error.message);
        }
        else {
            setNdhmDetails(parseNdhmDetails(response.data));
        }
        setLoader(false);
    }

    function parseNdhmDetails(patient) {
        const ndhm = {
            id: patient.id,
            gender: patient.gender,
            name: patient.name,
            isBirthDateEstimated: patient?.monthOfBirth == null || patient?.dayOfBirth == null,
            dateOfBirth: getDate(patient),
            address: patient.address,
            identifiers: patient.identifiers
        };
        return ndhm;
    }


    return (
        <div>
            {!checkIfNotNull(ndhmDetails) &&
            <div className="direct-auth">
                <div className="fetch-patient">
                    {!loader &&
                        <div>
                            <p className="note direct-auth-note">Please ask the patient to login to the PHR app and grant the consent</p>
                            <button type="button" onClick={getPatientDetails}>Fetch Patient Details</button>
                        </div>}
                    {showError && <h6 className="error">{errorMessage}</h6>}
                    {loader &&
                    <div>
                        <Spinner />
                        <span>Fetching Patient Details...</span>
                    </div>}
                </div>
            </div>}
        </div>
    );
}
export default DirectAuth;
