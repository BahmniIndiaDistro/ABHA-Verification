import React, {useState, useEffect} from 'react';
import { fetchPatientDetailsFromBahmni } from '../../api/hipServiceApi';
import './patientDetails.scss';

const PatientDetails = (props) => {
    const [bahmniDetails, setBahmniDetails] = useState({});
    const [changedDetails, setChangedDetails] = useState({});

    const ndhmDetails = props.ndhmDetails;
    const healthId = props.healthId;

    useEffect(() => {
        fetchBahmniDetails();
    }, []);

    async function fetchBahmniDetails() {
        console.log(ndhmDetails);
        const patient = await fetchPatientDetailsFromBahmni(ndhmDetails);
        parsePatientAddress(patient);
        setBahmniDetails(patient);
    }

    function parsePatientAddress(patient) {
        patient.address = patient.address.replace(/null,|null/gm, "").trim();
        patient.address = patient.address.replace(",", ", ");
    }

    function checkBoxChangeHandler(key) {
        switch(key) {
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
            default:
                changedDetails.age = calculateAge("01/01/" + ndhmDetails.yearOfBirth);
                break;
        }
        setChangedDetails({...changedDetails});
    }

    function calculateAge (birthDate) {
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
        const patient = {
            "healthId": healthId,
            "changedDetails": changedDetails
        };
        window.parent.postMessage({"patient" : patient}, "*");
    }

    return (
        <div>
            <div className="pateint-details">
                <table>
                    <thead>
                        <th></th>
                        <th>Bahmni</th>
                        <th>NDHM</th>
                        <th>Fetch records from NDHM?</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Name</td>
                            <td>{bahmniDetails.name}</td>
                            <td>{ndhmDetails.name}</td>
                            <td><input type="checkbox" onChange={() => checkBoxChangeHandler('name')}/></td>
                        </tr>
                        <tr>
                            <td>Gender</td>
                            <td>{bahmniDetails.gender}</td>
                            <td>{ndhmDetails.gender}</td>
                            <td><input type="checkbox" onChange={() => checkBoxChangeHandler('gender')}/></td>
                        </tr>
                        <tr>
                            <td>Year Of Birth</td>
                            <td>{bahmniDetails.yearOfBirth}</td>
                            <td>{ndhmDetails.yearOfBirth}</td>
                            <td><input type="checkbox" onChange={() => checkBoxChangeHandler('age')}/></td>
                        </tr>
                        <tr>
                            <td>Address</td>
                            <td>{bahmniDetails.address}</td>
                            <td>{ndhmDetails.address}</td>
                            <td><input type="checkbox" onChange={() => checkBoxChangeHandler('address')}/></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="action-btns">
                <button type="button" onClick={save}>Update</button>
            </div>
        </div>
    );
};
export default PatientDetails;
