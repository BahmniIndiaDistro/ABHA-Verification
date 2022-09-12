import React, {useEffect, useState} from 'react';
import {fetchPatientDetailsFromBahmni, saveDemographics} from '../../api/hipServiceApi';
import './patientDetails.scss';
import {Address, FhirPatient, GENDER, Identifier, Name, Telecom, Type} from "../../FhirPatient";
import ConfirmPopup from "./confirmPopup";
import {checkIfNotNull} from "../verifyHealthId/verifyHealthId";

const PatientDetails = (props) => {
    const [selectedPatient, setSelectedPatient] = useState({});
    const [patients, setPatients] = useState([]);
    const [noRecords, setNoRecords] = useState(false);

    const ndhmDetails = props.ndhmDetails;
    const id = props.id;
    const january_1 = "01/01/";

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

    function calculateAge(birthDate) {
        const dob = new Date(birthDate);
        var dobYear = dob.getYear();
        var dobMonth = dob.getMonth();
        var dobDate = dob.getDate();
        var now = new Date();
        var currentYear = now.getYear();
        var currentMonth = now.getMonth();
        var currentDate = now.getDate();
        var monthAge;
        var yearAge = currentYear - dobYear;
        if (currentMonth >= dobMonth) monthAge = currentMonth - dobMonth;
        else {
            yearAge--;
            monthAge = 12 + currentMonth - dobMonth;
        }
        var dateAge;
        if (currentDate >= dobDate) dateAge = currentDate - dobDate;
        else {
            monthAge--;
            dateAge = 31 + currentDate - dobDate;
            if (monthAge < 0) {
                monthAge = 11;
                yearAge--;
            }
        }

        return {
            'years': yearAge,
            'months': monthAge,
            'days': dateAge
        };
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

        var healthNumber = new Identifier(new Type("ABHA"),getHealthNumber())
        var healthId = new Identifier(new Type("ABHA Address"),ndhmDetails?.id || '-')

        const name = ndhmDetails?.name?.split(" ", 3);
        var familyName = name?.length === 3 ? name[2] : (name?.length > 1 ? name[1] : '')
        var middleName = name?.length === 3 ? name[1] : ''
        var firstName= name?.length > 0 ? name[0]: '';
        var names = new Name(familyName,[firstName,middleName])

        var gender = ndhmDetails?.gender
        var dob = ndhmDetails?.dateOfBirth

        var telecom = new Telecom("phone",getPhoneNumber())

        var address = new Address([ndhmDetails.addressObj?.line],"",ndhmDetails.addressObj?.district,ndhmDetails.addressObj?.state,ndhmDetails.addressObj?.pincode,"IN")
        var id;
        if(isConfirmSelected && selectedPatient.uuid !== undefined){
           id = selectedPatient.uuid;
        }

        let patient = new FhirPatient(id,[healthId,healthNumber],names,gender,dob,ndhmDetails?.isBirthDateEstimated, address,telecom,"")

        window.parent.postMessage({ "patient": patient }, "*");
        saveDemographics(ndhmDetails?.id,ndhmDetails)
    }

    function getPatientGender(gender) {
        switch(gender) {
            case "M":
                return GENDER.MALE;
            case "F":
                return GENDER.FEMALE;
            case "U":
                return GENDER.UNKNOWN;
            default:
                return GENDER.OTHER;
        }
    }

    function getPatientDetailsAsString(patient) {
        const address = getCustomAddress(patient?.addressObj);
        return (
                <p>
                <strong>{patient?.name?.replace(null,"")} </strong>
                (Age:<strong> {calculateAge(patient.dateOfBirth).years || '-'} </strong>,
                Gender:<strong> {getPatientGender(patient?.gender) || '-'}</strong>)<br/>
                {(address || patient?.address) && <span>{address || patient?.address} <br/></span>}
                Mobile: {patient?.phoneNumber || (patient?.identifiers != null ? patient?.identifiers[0]?.value : '-')}
                </p>
        )
    }

    function getCustomAddress(addressObj) {
        var customAddress = [];
        for (var key in addressObj) {
            if (addressObj[key] !== '-' && addressObj[key] !== '') {
                customAddress.push(addressObj[key]);
            }
        }
        return customAddress.toString().split(',').join(', ');
    }

    function getHealthNumber() {
        let healthNumber;
        ndhmDetails?.identifiers.forEach(id => {
            if (id.type.localeCompare("HEALTH_NUMBER") === 0) {
                healthNumber = id.value;
            }
        })
        return healthNumber;
    }
    function prepareMatchingPatientsList() {
        return patients.map((patient, i) => {
            return (
                <button onClick={() => setSelectedPatient(patients[i])} disabled={checkIfNotNull(selectedPatient)} className='matching-patient'>{getPatientDetailsAsString(patient)}</button>
            );
        });
    }

    return (
            <div className="matching-patients">
                <div className={checkIfNotNull(selectedPatient) ? 'greyed-out' : ''}>
                    <b>ABDM Record: </b>
                    {getPatientDetailsAsString(ndhmDetails)}<br/>
                    {noRecords && <b>No Bahmni Record Found</b>}
                    {!noRecords && <b>Following Matched Bahmni Record Found:</b>}
                    {!noRecords && <div className="note">
                        <p>Select the appropriate <b>matched</b> Bahmni record to update the data for that patient in the system, or click on <b>Create New Record</b>, if you want to create a fresh patient record</p>
                    </div>}
                    {prepareMatchingPatientsList()}
                    <div className="create-confirm-btns">
                        <button onClick={updateRecord}> Create New Record </button>
                    </div>
                </div>
                {checkIfNotNull(selectedPatient) && <ConfirmPopup getPatientDetailsAsString={getPatientDetailsAsString} selectedPatient={selectedPatient} close={() => setSelectedPatient({})} onConfirm={confirmSelection}/>}
            </div>
    );
};
export default PatientDetails;
