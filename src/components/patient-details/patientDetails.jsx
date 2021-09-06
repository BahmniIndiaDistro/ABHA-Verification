import React, { useState, useEffect } from 'react';
import { fetchPatientDetailsFromBahmni } from '../../api/hipServiceApi';
import './patientDetails.scss';

const PatientDetails = (props) => {
    const [showBahmni, setShowBahmni] = useState(false);
    const [bahmniDetails, setBahmniDetails] = useState({});
    const [changedDetails, setChangedDetails] = useState({});
    const [selectedPatient, setSelectedPatient] = useState({});
    const [patients, setPatients] = useState([]);
    const [showTabularFormat, setShowTabularFormat] = useState(false);

    const ndhmDetails = props.ndhmDetails;
    const healthId = props.healthId;
    const january_1 = "01/01/";

    useEffect(() => {
        fetchBahmniDetails();
    }, []);

    async function fetchBahmniDetails() {
        const response = await fetchPatientDetailsFromBahmni(ndhmDetails);
        if (response.error === undefined) {
            if (response.length == 1) {
                setShowBahmni(true);
                setShowTabularFormat(true);
                parsePatientAddress(response[0]);
                setBahmniDetails(response[0]);
            } else {
                const parsedPatients = response.map(patient => {parsePatientAddress(patient); return patient});
                setPatients(parsedPatients);
            }
        }
    }

    function parsePatientAddress(patient) {
        patient.address = patient.address.replace(/null,|null/gm, "").trim();
        patient.address = patient.address.replace(",", ", ");
    }

    function checkBoxChangeHandler(key) {
        switch (key) {
            case 'address':
                changedDetails.address = {
                    'countyDistrict': ndhmDetails.addressObj.district,
                    'address1': ndhmDetails.addressObj.line,
                    'stateProvince': ndhmDetails.addressObj.state
                };
                break;
            case 'name':
                const name = ndhmDetails.name.split(" ", 2);
                changedDetails.name = {
                    'givenName': name[0],
                    'familyName': name[1]
                };
                break;
            case 'gender':
                changedDetails.gender = ndhmDetails.gender;
                break;
            case 'phoneNumber':
                 changedDetails.phoneNumber = ndhmDetails.identifiers[0].value.replace("+91", "+91-");
                 changedDetails.phoneNumber = changedDetails.phoneNumber.replace("--", "-");
                 break;
            default:
                changedDetails.age = calculateAge(january_1 + ndhmDetails.yearOfBirth);
                break;
        }
        setChangedDetails({ ...changedDetails });
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

    function save() {
        let patient;
        if (showBahmni) {
            patient = {
                "healthId": healthId,
                "changedDetails": changedDetails,
                "uuid" : bahmniDetails.uuid
            };
        } else {
            const name = ndhmDetails.name.split(" ", 2);
            patient = {
                "healthId": healthId,
                "changedDetails": {
                    "address": {
                        'countyDistrict': ndhmDetails.addressObj.district,
                        'address1': ndhmDetails.addressObj.line,
                        'stateProvince': ndhmDetails.addressObj.state
                    },
                    "name": {
                        'givenName': name[0],
                        'familyName': name[1]
                    },
                    "gender": ndhmDetails.gender,
                    "age": calculateAge("01/01/" + ndhmDetails.yearOfBirth),
                    "phoneNumber": ndhmDetails.identifiers[0].value
                }
            }
        }
        window.parent.postMessage({ "patient": patient }, "*");
    }
    function getPatientDetailsAsString(patient) {
        let patientString = "";
        patientString = patientString + patient.name + ", ";
        patientString = patientString + calculateAge(january_1 + patient.yearOfBirth).years + ", ";
        patientString = patientString + (patient.gender === "M" ? "Male" : "Female") + ", ";
        patientString = patientString + patient.address;
        return patientString;
    }
    function onSelectMatchingPatient(e) {
        const index = e.target.value;
        setSelectedPatient(patients[index]);
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
    function confirmSelection() {
        setShowBahmni(true);
        setShowTabularFormat(true);
        setBahmniDetails(selectedPatient);
    }
    function createNewRecord() {
        setShowBahmni(false);
        setShowTabularFormat(true);
    }

    return (
        <div>
            {!showTabularFormat && <div>
                <div className="matching-patients">
                    <b>NDHM Record: </b> {getPatientDetailsAsString(ndhmDetails)}<br/>
                    <p>Please select your matching bahmni record, incase of no match procedd with new card creation</p>
                    {prepareMatchingPatientsList()}
                </div>
                <div className="create-confirm-btns">
                    <button onClick={createNewRecord}> Create New Record </button>
                    <button disabled={isSelectedPatientEmpty()} onClick={confirmSelection}> Confirm Selection </button>
                </div>
            </div>}
            {showTabularFormat && <div className="patient-details">
                <table>
                    <thead>
                        <th></th>
                        {showBahmni && <th>Bahmni</th>}
                        <th>NDHM</th>
                        {showBahmni && <th>Fetch records from NDHM?</th>}
                    </thead>
                    <tbody>
                        <tr>
                            <td>Name</td>
                            {showBahmni && <td>{bahmniDetails.name}</td>}
                            <td>{ndhmDetails.name}</td>
                            {showBahmni && <td><input type="checkbox" onChange={() => checkBoxChangeHandler('name')} /></td>}
                        </tr>
                        <tr>
                            <td>Gender</td>
                            {showBahmni && <td>{bahmniDetails.gender}</td>}
                            <td>{ndhmDetails.gender}</td>
                            {showBahmni && <td><input type="checkbox" onChange={() => checkBoxChangeHandler('gender')} /></td>}
                        </tr>
                        <tr>
                            <td>Year Of Birth</td>
                            {showBahmni && <td>{bahmniDetails.yearOfBirth}</td>}
                            <td>{ndhmDetails.yearOfBirth}</td>
                            {showBahmni && <td><input type="checkbox" onChange={() => checkBoxChangeHandler('age')} /></td>}
                        </tr>
                        <tr>
                            <td>Phone </td>
                            {showBahmni && <td>{bahmniDetails.phoneNumber}</td>}
                            <td>{ndhmDetails.identifiers[0].value}</td>
                            {showBahmni && <td><input type="checkbox" onChange={() => checkBoxChangeHandler('phoneNumber')} /></td>}
                        </tr>
                        <tr>
                            <td>Address</td>
                            {showBahmni && <td>{bahmniDetails.address}</td>}
                            <td>{ndhmDetails.address}</td>
                            {showBahmni && <td><input type="checkbox" onChange={() => checkBoxChangeHandler('address')} /></td>}
                        </tr>
                    </tbody>
                </table>
            </div>}
            {showTabularFormat && <div className="action-btns">
                <button type="button" onClick={save}>Update</button>
            </div>}
        </div>
    );
};
export default PatientDetails;
