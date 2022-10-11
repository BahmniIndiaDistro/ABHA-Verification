import React, {useEffect, useState} from 'react';
import {fetchPatientDetailsFromBahmni, saveDemographics} from '../../api/hipServiceApi';
import './patientDetails.scss';
import {Address, FhirPatient, GENDER, Identifier, Name, Telecom, Type} from "../../FhirPatient";
import ConfirmPopup from "./confirmPopup";
import {checkIfNotNull} from "../verifyHealthId/verifyHealthId";
import PatientInfo from "./patientInfo";
import PatientQueue from "../patient-queue/patientQueue";

const PatientDetails = (props) => {
    const [selectedPatient, setSelectedPatient] = useState({});
    const [patients, setPatients] = useState([]);
    const [noRecords, setNoRecords] = useState(false);
    const [back, GoBack] = useState(false);

    const ndhmDetails = props.ndhmDetails;

    useEffect(() => {
        fetchBahmniDetails();
    }, []);

    async function fetchBahmniDetails() {
        const response = await fetchPatientDetailsFromBahmni(ndhmDetails);
        if (response.error === undefined) {
            const parsedPatients = response.map(patient => {parsePatient(patient); return patient});
            setPatients(parsedPatients);
        }
        else{
            setNoRecords(true);
        }
    }

    function parsePatient(patient) {
        patient.address = patient.address.replace(/null,|null/gm, "").trim();
        patient.address = patient.address.replace(",", ", ");
        patient.name = patient.name.replace(null,"");
    }

    function updateRecord(){
        save(false);
    }

    function confirmSelection(){
        save(true);
    }

    function getPhoneNumber() {
        var phoneNumber = ndhmDetails?.identifiers[0].value;
        var len = phoneNumber.length;
        return "+91".concat(phoneNumber.substring(len-10,len));
    }

    function save(isConfirmSelected) {
        var healthNumber = new Identifier(new Type("ABHA"),null)
        var healthId = new Identifier(new Type("ABHA Address"),ndhmDetails?.id || '-')

        const name = ndhmDetails?.name?.split(" ", 3);
        var familyName = name?.length === 3 ? name[2] : (name?.length > 1 ? name[1] : '')
        var middleName = name?.length === 3 ? name[1] : ''
        var firstName= name?.length > 0 ? name[0]: '';
        var names = new Name(familyName,[firstName,middleName])

        var gender = ndhmDetails?.gender
        var dob = ndhmDetails?.dateOfBirth

        var telecom = new Telecom("phone",getPhoneNumber())

        var address = new Address([ndhmDetails.address?.line],"",ndhmDetails.address?.district,ndhmDetails.address?.state,ndhmDetails.address?.pincode,"IN")
        var id;
        if(isConfirmSelected && selectedPatient.uuid !== undefined){
           id = selectedPatient.uuid;
        }

        let patient = new FhirPatient(id,[healthId,healthNumber],names,gender,dob,ndhmDetails?.isBirthDateEstimated, address,telecom,"")

        window.parent.postMessage({ "patient": patient }, "*");
        saveDemographics(ndhmDetails?.id,ndhmDetails)
    }

    function prepareMatchingPatientsList() {
        return patients.map((patient, i) => {
            return (
                <button onClick={() => setSelectedPatient(patients[i])} disabled={checkIfNotNull(selectedPatient)} className='matching-patient'><PatientInfo patient={patient}/></button>
            );
        });
    }

    return (
     <div className="matching-patients">
         {!back && <div className={checkIfNotNull(selectedPatient) ? 'greyed-out' : ''}>
                    <b>ABDM Record: </b>
                    <PatientInfo patient={ndhmDetails}/><br/>
                    {noRecords && <b>No Bahmni Record Found</b>}
                    {!noRecords && <b>Following Matched Bahmni Record Found:</b>}
                    {!noRecords && <div className="note">
                        <p>Select the appropriate <b>matched</b> Bahmni record to update the data for that patient in the system, or click on <b>Create New Record</b>, if you want to create a fresh patient record</p>
                    </div>}
                    {prepareMatchingPatientsList()}
                    <div className="create-confirm-btns">
                        <button onClick={() => GoBack(true)}>Go back</button>
                        <button onClick={updateRecord}> Create New Record </button>
                    </div>
                </div>}
                {!back && checkIfNotNull(selectedPatient) && <ConfirmPopup selectedPatient={selectedPatient} close={() => setSelectedPatient({})} onConfirm={confirmSelection}/>}
            {back && <PatientQueue />}
            </div>
    );
};
export default PatientDetails;
