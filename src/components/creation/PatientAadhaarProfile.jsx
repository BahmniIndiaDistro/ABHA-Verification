import React, {useEffect, useState} from "react";
import './creation.scss';
import Footer from "./Footer";
import ABHACardDownload from "./ABHACardDownload";
import LinkABHAAddress from "./LinkABHAAddress";
import VerifyMobile from "./VerifyMobile";
import CheckIdentifierExists from "../Common/CheckIdentifierExists";
import PatientDetails from "../patient-details/patientDetails";
import {getDate} from "../Common/DateUtil";
import {checkABHAAddressForPatient} from "../../api/hipServiceApi";

const PatientAadhaarProfile = (props) => {
    const [proceedToLinking, setProceedToLinking] = useState(false);
    const [linkABHAAddress, setLinkAbhaAdress] = useState(false);
    const patient = props.patient;
    const patientUuid = props.patientUuid;
    const imgSrc = "data:image/jpg;base64," + patient.photo;
    const [back, setBack] = useState(false);
    const [isNewABHA, setIsNewABHA]= useState(false);
    const [ABHAAlreadyExists, setABHAAlreadyExists] = useState(false);
    const [proceed, setProceed] = useState(false);
    const [mappedPatient,setMappedPatient] = useState({});
    const [isPatientMapped,setIsPatientMapped] = useState(false);
    const [healthIdExists, setHealthIdExists] = useState(false);

    function getAddressLine(){
        return [patient?.house.concat(" ", patient?.street), patient?.locality];
    }

    useEffect(() => {
        if(proceedToLinking) {
            mapPatient()
            setLinkAbhaAdress(true);
        }
        if(back) {
            setLinkAbhaAdress(false);
            setIsNewABHA(false);
            setProceedToLinking(false);
            setBack(false);
            setIsPatientMapped(false);
            setProceed(false);
        }
    },[proceedToLinking, back])

    useEffect(async () => {
        if(patientUuid) {
            setHealthIdExists(await checkABHAAddressForPatient(patientUuid));
        }
    },[patientUuid])

    function getAddress() {
        var address = [...getAddressLine(),patient?.district,patient?.state,patient?.pincode]
            .filter(e => e !== null && e !== undefined && e !== "");
        return address.join(', ');
    }

    function mapPatient(){
        var identifier = patient?.phone !== undefined ? [{
            value: patient.phone
        }] : undefined;
        var address =  {
            line: getAddressLine(),
            city: patient?.villageTownCity,
            district: patient?.district,
            state: patient?.state,
            pincode: patient?.pincode
        };
        let ndhm = {};
        if (healthIdExists) {
            ndhm = {
                healthIdNumber: patient?.healthIdNumber,
                patientUuid: patientUuid
            }
        } else {
            ndhm = {
                healthIdNumber: patient?.healthIdNumber,
                id: patient?.healthId,
                gender: patient.gender,
                name: patient.name,
                isBirthDateEstimated: patient?.birthdate !== undefined ? false : (patient?.monthOfBirth == null || patient?.dayOfBirth == null),
                dateOfBirth:  patient?.birthdate === undefined  ? getDate(patient) : patient?.birthdate.split('-').reverse().join('-'),
                address: address,
                identifiers: identifier
            };
        }
        setMappedPatient(ndhm);
    }

    useEffect(() => {
        if(proceed){
            mapPatient();
            if(patient.healthIdNumber === undefined && !healthIdExists)
                setIsNewABHA(true);
            else if(patient.healthId === undefined && !healthIdExists)
                setLinkAbhaAdress(true);
            else
                setIsPatientMapped(true);
        }
    },[proceed])

    function gotoLink(){
       setProceedToLinking(true)
    }

    return (
        <div>
            {!linkABHAAddress && !isNewABHA && !isPatientMapped &&
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
                    {patient.healthId !== undefined && healthIdExists &&
                    <div>
                        <strong>ABHA Address:</strong>    {patient.healthId}
                        <p className="note">This is a default ABHA Address</p>
                        <CheckIdentifierExists id={patient.healthId} setABHAAlreadyExists={setABHAAlreadyExists}/>
                    </div>}
                    {patient.healthIdNumber !== undefined &&
                    <div>
                        <CheckIdentifierExists id={patient.healthIdNumber} setABHAAlreadyExists={setABHAAlreadyExists}/>
                        <ABHACardDownload patient={patient}/>
                    </div>}
                    <div className="ButtonGroup">
                        <Footer setBack={props.setBack} />
                        <div className="linkButton">
                            {!healthIdExists && patient.healthId !== undefined && !ABHAAlreadyExists && <button type="button" className="proceed" onClick={gotoLink}>Link different ABHA Address</button>}
                        </div>
                        {!ABHAAlreadyExists && <Footer setProceed={setProceed} />}
                    </div>
                </div>
            </div>}
            {linkABHAAddress && <LinkABHAAddress patient={patient} mappedPatient={mappedPatient}/>}
            {isNewABHA && <VerifyMobile patient={patient} setBack={setBack} mappedPatient={mappedPatient}/>}
            {healthIdExists && isPatientMapped && <PatientDetails ndhmDetails={mappedPatient} setBack={setBack} />}
        </div>
    );
}
export default PatientAadhaarProfile;