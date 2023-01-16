import React, {useEffect, useState} from "react";
import './creation.scss';
import Spinner from "../spinner/spinner";
import Footer from "./Footer";
import {createABHA, verifyAadhaarOtp} from "../../api/hipServiceApi";
import {getDate} from "../Common/DateUtil";
import PatientDetails from "../patient-details/patientDetails";
import {GoVerified} from "react-icons/all";
const CreateABHA = () => {
    const [abhaAddress, setAbhaAddress] = useState('');
    const [proceed, setProceed] = useState(false);
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState('');
    const [patient, setPatient] = useState({});
    const [mappedPatient,setMappedPatient] = useState({});
    const [isPatientMapped,setIsPatientMapped] = useState(false);

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
                console.log(response, response.data);
                setPatient(response.data);
            }
        }
    }

    function mapPatient() {
        console.log(patient);
        var identifier = patient?.phone !== undefined ? [{
            value: patient.phone
        }] : undefined;
        var address =  {
            line: undefined,
            district: patient?.districtName,
            state: patient?.stateName,
            pincode: patient?.pincode
        };
        const ndhm = {
            healthIdNumber: patient.healthIdNumber,
            id: patient.healthId,
            gender: patient.gender,
            name: patient.name,
            isBirthDateEstimated: patient?.monthOfBirth == null || patient?.dayOfBirth == null,
            dateOfBirth: getDate(patient),
            address: address,
            identifiers: identifier
        };
        console.log(ndhm);
        setMappedPatient(ndhm);
        setIsPatientMapped(true);
    }

    useEffect(async () => {
        if (proceed) {
            await onVerify();
            setProceed(false);
        }
        if(JSON.stringify(patient) !== JSON.stringify({})){
            mapPatient();
        }
    },[proceed,patient])


    return (
        <div>
            {!isPatientMapped &&
            <div>
                <div className="abha-address" >
                    <label htmlFor="abhaAdddress">Enter ABHA ADDRESS </label>
                    <div className="abha-adddress-input" >
                            <input type="text" id="abhaAdddress" name="abhaAdddress" value={abhaAddress} onChange={OnChangeHandler} />
                    </div>
                </div>
                <p className="note">You can still click on proceed without entering ABHA Address</p>
                {error !== '' && <h6 className="error">{error}</h6>}
            </div>}
            {loader && <Spinner />}
            {isPatientMapped && <p className="note success"> <GoVerified /> <strong>ABHA Created Successfully</strong></p>}
            {!isPatientMapped && <Footer setProceed={setProceed}/>}
            {isPatientMapped &&  <PatientDetails ndhmDetails={mappedPatient}/>}
        </div>
    );
}

export default CreateABHA;