import React, { useState, useEffect } from 'react';
import { fetchPatientDetailsFromBahmni, saveDemographics } from '../../api/hipServiceApi';
import './patientDetails.scss';

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
        console.log(response);
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
        save();
        saveDemographics(id,ndhmDetails);
    }

    function save() {
        let patient = {
            "id": id,
            "healthId": getHealthNumber(),
            "healthNumber": ndhmDetails.id
        }
        const name = ndhmDetails.name.split(" ", 3);
        patient["changedDetails"] = {
            "address": {
                'countyDistrict': ndhmDetails.addressObj.district,
                'address1': ndhmDetails.addressObj.line,
                'stateProvince': ndhmDetails.addressObj.state
             },
            "name": {
                'givenName': name[0],
                'middleName': name.length === 3 ? name[1] : '',    
                'familyName': name.length === 3 ? name[2] : name[1]
            },
            "gender": ndhmDetails.gender,
            "age": calculateAge("01/01/" + ndhmDetails.yearOfBirth),
            "phoneNumber": ndhmDetails.identifiers[0].value
        };
        if(selectedPatient.uuid != undefined){
            patient["uuid"] = selectedPatient.uuid;
        }
        window.parent.postMessage({ "patient": patient }, "*");
    }

    function getPatientGender(gender) {
        switch(gender) {
            case "M":
                return "Male";
            case "F":
                return "Female";
            case "U":
                return "Undisclosed";
            default:
                return "Other";
        }
    }
    function getPatientDetailsAsString(patient) {
        let patientString = "";
        patientString = patientString + patient.name.replace(null,"") + ", ";
        patientString = patientString + calculateAge(january_1 + patient.yearOfBirth).years + ", ";
        patientString = patientString + getPatientGender(patient.gender) + ", ";
        patientString = patientString + (patient.phoneNumber || patient.identifiers[0].value) + ", ";
        patientString = patientString + patient.address;
        return patientString;
    }
    function onSelectMatchingPatient(e) {
        const index = e.target.value;
        setSelectedPatient(patients[index]);
    }
    function getHealthNumber() {
        let healthNumber;
        ndhmDetails.identifiers.forEach(id => {
            if (id.type.localeCompare("HEALTH_NUMBER") === 0) {
                healthNumber = id.value;
            }
        })
        return healthNumber;
    }
    function prepareMatchingPatientsList() {
        return patients.map((patient, i) => {
            return (
                <div className="matching-patient">
                    <span className="details"><b>Bahmni Record: </b>{getPatientDetailsAsString(patient)}</span>
                    <span className="radio-btn"><input type="radio" value={i} name="patient" onChange={onSelectMatchingPatient}/></span>
                </div>
            );
        });
    }
    function isSelectedPatientEmpty() {
        return JSON.stringify(selectedPatient) === JSON.stringify({})
    }

    return (
                <div className="matching-patients">
                    <b>NDHM Record: </b> {getPatientDetailsAsString(ndhmDetails)}<br/>
                    {!noRecords && <div className="note">
                        <p>* Select the appropriate Bahmni record to update the Name, Age, Gender as per NDHM records and click on Confirm.</p>
                        <p>* Following Name, Gender, Age will be updated in Bahmni. This action cannot be undone</p>
                    </div>}
                    {noRecords && <b>No Bahmni Record Found</b>}
                    {!noRecords && <b>Following Found</b>}
                    {prepareMatchingPatientsList()}
                    <div className="create-confirm-btns">
                        <button onClick={updateRecord}> Create New Record </button>
                        <button disabled={isSelectedPatientEmpty()}  onClick={updateRecord}> Confirm Selection </button>
                    </div>
                </div>
    );
};
export default PatientDetails;
