import React, {useEffect, useState} from "react";
import {fetchPatientFromBahmniWithHealthId, getHealthIdStatus, checkIfHealthNumberExists} from '../../api/hipServiceApi';
import '../verifyHealthId/verifyHealthId.scss';

const CheckIdentifierExists = (props) => {
    const [matchingPatientFound, setMatchingPatientFound] = useState(false);
    const [matchingpatientUuid, setMatchingPatientUuid] = useState('');
    const [healthIdIsVoided, setHealthIdIsVoided] = useState(false);
    const [errorHealthId, setErrorHealthId] = useState('');
    const [showError, setShowError] = useState(false);
    const [healthIdNumberExists, setHealthIdNumberExists] = useState(false);

    async function checkIfAlreadyExistingIdentifier(id) {
        if(props.setABHAAlreadyExists !== undefined)
            props?.setABHAAlreadyExists(false);
        if(props.setHealthIdIsVoided !== undefined)
            props?.setHealthIdIsVoided(false);
        if(props.setMatchingPatientUuid !== undefined)
            props?.setMatchingPatientUuid('');
        if(props.setHealthNumberAlreadyLinked !== undefined)
            props?.setHealthNumberAlreadyLinked(false);
        else
            setHealthIdNumberExists(true);

        if (id !== '') {
            setHealthIdIsVoided(false);
            setMatchingPatientFound(false);
            setMatchingPatientUuid('');
            const matchingPatientId = await fetchPatientFromBahmniWithHealthId(id);
            if (matchingPatientId.Error === undefined && matchingPatientId.validPatient === true) {
                const healthIdStatus = await getHealthIdStatus(matchingPatientId.patientUuid);
                if (healthIdStatus) {
                    setHealthIdIsVoided(healthIdStatus);
                    if(props.setHealthIdIsVoided !== undefined)
                        props?.setHealthIdIsVoided(healthIdStatus);
                }
                else {
                    setMatchingPatientFound(true);
                    setMatchingPatientUuid(matchingPatientId.patientUuid);
                }
                if(props.setABHAAlreadyExists !== undefined)
                    props?.setABHAAlreadyExists(true);
                if(props.setMatchingPatientUuid !== undefined)
                    props?.setMatchingPatientUuid(matchingPatientId);
                if(props.setHealthNumberAlreadyLinked !== undefined) {
                    const response = await checkIfHealthNumberExists(matchingPatientId);
                    if(response.error === undefined) {
                        setHealthIdNumberExists(response);
                        props?.setHealthNumberAlreadyLinked(response);
                    }
                }
            }
            else {
                if (matchingPatientId.Error !== undefined) {
                    setShowError(true)
                    setErrorHealthId(matchingPatientId.Error.message);
                }
            }
        }
    }

    useEffect(async () => {
        await checkIfAlreadyExistingIdentifier(props.id);
    },[props.id])

    function redirectToPatientDashboard() {
        window.parent.postMessage({"patientUuid" : matchingpatientUuid}, "*");
    }


    return (
        <div>
            {matchingPatientFound && healthIdNumberExists && <div className="patient-existed" onClick={redirectToPatientDashboard}>
                Matching record with {props.id} found
            </div>}
            {matchingPatientFound && !healthIdNumberExists && <div className="matched-patient-info">Matching record with {props.id} found. Please proceed to update the record</div>}
            {healthIdIsVoided && <div className="id-deactivated">
                {props.id} is deactivated
            </div>}
            {showError && <h6 className="error">{errorHealthId}</h6>}
        </div>
    );
}

export default CheckIdentifierExists;
