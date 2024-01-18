import React, {useEffect, useState} from "react";
import './creation.scss';
import Footer from "./Footer";
import ABHACard from "./ABHACard";
import LinkABHAAddress from "./LinkABHAAddress";
import VerifyMobile from "./VerifyMobile";
import {getDate} from "../Common/DateUtil";

const PatientAadhaarProfile = (props) => {
    const [proceedToLinking, setProceedToLinking] = useState(false);
    const [linkABHAAddress, setLinkAbhaAdress] = useState(false);
    const patient = props.patient;
    const imgSrc = "data:image/jpg;base64," + patient.photo;
    const [back, setBack] = useState(false);
    const [isNewABHA, setIsNewABHA]= useState(false);
    const [proceed, setProceed] = useState(false);
    const [mappedPatient,setMappedPatient] = useState({});

    function getAddressLine(){
        return [[patient?.house, patient?.street, patient?.landmark].join(' ').trim(), patient?.locality];
    }

    useEffect(() => {
        if(proceed) {
            mapPatient()
            if(patient.healthIdNumber === undefined)
                setIsNewABHA(true);
            else
                setLinkAbhaAdress(true);
        }
        if(back) {
            setLinkAbhaAdress(false);
            setIsNewABHA(false);
            setProceedToLinking(false);
            setBack(false);
            setProceed(false);
        }
    },[proceed, back])

    function getAddress() {
        var address = [...getAddressLine(),patient?.district,patient?.state,patient?.pincode]
            .filter(e => e !== null && e !== undefined && e !== "");
        return address.join(', ');
    }

    function mapPatient(){
        var identifier = patient?.phone !== undefined ? [{
            type: "MOBILE",
            value: patient.phone
        }] : undefined;
        var address =  {
            line: getAddressLine(),
            city: patient?.villageTownCity,
            district: patient?.district,
            state: patient?.state,
            pincode: patient?.pincode
        };
        const ndhm = {
                healthIdNumber: patient?.healthIdNumber,
                id: patient?.healthId,
                gender: patient.gender,
                name: patient.name,
                isBirthDateEstimated: patient?.birthdate !== undefined ? false : (patient?.monthOfBirth == null || patient?.dayOfBirth == null),
                dateOfBirth:  patient?.birthdate === undefined  ? getDate(patient) : patient?.birthdate.split('-').reverse().join('-'),
                address: address,
                identifiers: identifier,
                uuid: patient?.uuid
            };
        setMappedPatient(ndhm);
    }

    return (
        <div>
            {!linkABHAAddress && !isNewABHA &&
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
                    {patient.healthId !== undefined &&
                    <div>
                        <strong>ABHA Address:</strong>    {patient.healthId}
                        <p className="note">This is a default ABHA Address</p>
                    </div>}
                    {patient.healthIdNumber !== undefined && patient.healthId !== undefined &&
                    <div>
                        <ABHACard  healthIdNumber={patient?.healthIdNumber}/>
                    </div>}
                    <div className="ButtonGroup">
                        <Footer setBack={props.setBack} />
                        <Footer setProceed={setProceed} />
                    </div>
                </div>
            </div>}
            {linkABHAAddress && <LinkABHAAddress patient={patient} mappedPatient={mappedPatient}/>}
            {isNewABHA && <VerifyMobile patient={patient} setBack={setBack} mappedPatient={mappedPatient} />}
        </div>
    );
}
export default PatientAadhaarProfile;