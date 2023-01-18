import React, {useEffect, useState} from "react";
import './creation.scss';
import VerifyMobile from "./VerifyMobile";
import PatientDetails from "../patient-details/patientDetails";
import Footer from "./Footer";
import ABHACardDownload from "./ABHACardDownload";
const PatientAadhaarProfile = (props) => {
    const [proceed, setProceed] = useState(false);
    const [createABHAAddress, setCreateAbhaAdress] = useState(false);
    const patient = props.patient;
    const imgSrc = "data:image/jpg;base64," + patient.photo;
    const [mappedPatient,setMappedPatient] = useState({});
    const [isPatientMapped, setIsPatientMapped] = useState(false);
    const [setGoBack] = [props.setGoBack];
    const [back, goBack] = useState(false);

    function onClick(){
        setCreateAbhaAdress(true);
    }

    function onBack(){
        setGoBack(true);
    }

    function onProceed(){
        setProceed(true);
    }

    function getAddressLine(){
        return [patient?.house,patient?.street, patient?.landmark, patient?.locality, patient?.villageTownCity, patient?.subDist].filter(e => e !== undefined);
    }

    function mapPatient(){
        var identifier = patient?.phone !== undefined ? [{
            value: patient.phone
        }] : undefined;
        var address =  {
            line: getAddressLine().join(', '),
            district: patient?.district,
            state: patient?.state,
            pincode: patient?.pincode
        };
        const ndhm = {
            healthNumber: patient.healthIdNumber,
            id: patient.healthId,
            gender: patient.gender,
            name: patient.name,
            isBirthDateEstimated: false,
            dateOfBirth: patient?.birthdate.split('-').reverse().join('-'),
            address: address,
            identifiers: identifier
        };
        setMappedPatient(ndhm);
        setIsPatientMapped(true);
        return ndhm;
    }

    useEffect(() => {
        if(proceed) {
            setCreateAbhaAdress(true);
            setProceed(false);
        }
        if(back){
            setCreateAbhaAdress(false);
            setProceed(false);
            setIsPatientMapped(false);
            goBack(false);
        }
    },[proceed,back])

    function getAddress() {
        var address = getAddressLine();
        address.push(patient?.district,patient?.state,patient?.pincode);
        return address.join(', ');
    }

    return (
        <div>
            {!isPatientMapped && !proceed && !createABHAAddress &&
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
                    {patient.healthId !== undefined && <p>
                        <strong>ABHA Address:</strong> {patient.healthId}
                    </p>}
                    {patient.healthIdNumber !== undefined && <ABHACardDownload patient={patient}/>}
                    {patient.healthIdNumber === undefined && patient.healthId === undefined && <Footer setProceed={setProceed} />}
                </div>
                {patient.healthIdNumber !== undefined && patient.healthId === undefined &&
                    <div>
                        <div className="buttons">
                            <button type="button" className="back button" onClick={onBack}>Back</button>
                            <button type="button" className="proceed button" onClick={mapPatient}>Proceed linking without ABHA Address</button>
                            <button type="button" className="proceed button" onClick={onClick}>Proceed</button>
                        </div>
                    </div>
                }
            </div>}
            {createABHAAddress && <VerifyMobile setGoBack={goBack}/>}
            {isPatientMapped && <PatientDetails ndhmDetails={mappedPatient}/>}
        </div>
    );
}
export default PatientAadhaarProfile;