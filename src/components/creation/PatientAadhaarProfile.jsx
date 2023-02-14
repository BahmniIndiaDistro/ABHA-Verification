import React, {useEffect, useState} from "react";
import './creation.scss';
import Footer from "./Footer";
import ABHACardDownload from "./ABHACardDownload";
import LinkABHAAddress from "./LinkABHAAddress";
import VerifyMobile from "./VerifyMobile";
import {getDate} from "../Common/DateUtil";
import PatientDetails from "../patient-details/patientDetails";
import {checkIfNotNull} from "../verifyHealthId/verifyHealthId";
import VerifyAadhaar from "./verifyAadhaar";

const PatientAadhaarProfile = (props) => {
    const [proceed, setProceed] = useState(false);
    const [linkABHAAddress, setLinkAbhaAdress] = useState(false);
    const patient = props.patient;
    const [mappedPatient, setMappedPatient] = useState({});
    const addOnlyAbhaNumber = props.addOnlyAbhaNumber;
    const imgSrc = "data:image/jpg;base64," + patient.photo;
    const [back, setBack] = useState(false);
    const [isNewABHA, setIsNewABHA]= useState(false);

    function mapPatient(){
        var identifier = patient?.phone !== undefined ? [{
            value: patient.phone
        }] : (patient?.mobile !== undefined ? [{
            value: patient.mobile
        }] : undefined);
        var address =  {
            line: getAddressLine().join(', '),
            district: patient?.district,
            state: patient?.state,
            pincode: patient?.pincode
        };
        const ndhm = {
            healthNumber: patient.healthIdNumber,
            id: patient.phrAddress[0],
            gender: patient.gender,
            name: patient.name,
            isBirthDateEstimated: false,
            dateOfBirth:  patient?.birthdate === undefined  ? getDate(patient) : patient?.birthdate.split('-').reverse().join('-'),
            address: address,
            identifiers: identifier
        };
        setMappedPatient(ndhm);
    }

    function getAddressLine(){
        return [patient?.house,patient?.street, patient?.landmark, patient?.locality, patient?.villageTownCity, patient?.subDist].filter(e => e !== undefined);
    }

    useEffect(() => {
        if(proceed) {
            if(addOnlyAbhaNumber) {
                mapPatient();
            } else {
                if(patient.healthIdNumber === undefined)
                setIsNewABHA(true);
            else
                setLinkAbhaAdress(true);
            }
        }
        if(back) {
            setLinkAbhaAdress(false);
            setIsNewABHA(false);
            setProceed(false);
            setBack(false);
        }
    },[proceed, back])

    function getAddress() {
        var address = getAddressLine();
        address.push(patient?.district,patient?.state,patient?.pincode);
        address.filter(e => e !== undefined && e !== "");
        return address.join(', ');
    }

    return (
        <div>
            {!linkABHAAddress && !isNewABHA && !checkIfNotNull(mappedPatient) &&
            <div>
                <div className="patient-profile">
                    <h3>Profile Details As Per Aadhaar</h3>
                    <img src={imgSrc} width="150" height="150" />
                    <p><strong>Full Name:</strong> {patient.name}</p>
                    <p><strong>Gender:</strong>    {patient.gender}</p>
                    <p><strong>DOB:</strong>       {patient.birthdate}</p>
                    <p><strong>Address:</strong>       {getAddress()}</p>
                    {patient.healthIdNumber !== undefined && <p>
                        <strong>ABHA Number:</strong>    {patient.healthIdNumber}
                    </p>}
                    {patient.healthIdNumber !== undefined && <ABHACardDownload patient={patient}/>}
                    <Footer setProceed={setProceed} setBack={props.setBack} />
                </div>
            </div>}
            {addOnlyAbhaNumber && checkIfNotNull(mappedPatient) && <PatientDetails ndhmDetails={mappedPatient} setBack={setBack}/>}
            {linkABHAAddress && <LinkABHAAddress patient={patient}/>}
            {isNewABHA && <VerifyMobile patient={patient} setBack={setBack}/>}
        </div>
    );
}
export default PatientAadhaarProfile;