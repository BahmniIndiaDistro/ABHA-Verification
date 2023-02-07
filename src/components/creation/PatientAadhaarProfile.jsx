import React, {useEffect, useState} from "react";
import './creation.scss';
import Footer from "./Footer";
import ABHACardDownload from "./ABHACardDownload";
import LinkABHAAddress from "./LinkABHAAddress";
import VerifyMobile from "./VerifyMobile";
import VerifyAadhaar from "./verifyAadhaar";

const PatientAadhaarProfile = (props) => {
    const [proceed, setProceed] = useState(false);
    const [linkABHAAddress, setLinkAbhaAdress] = useState(false);
    const patient = props.patient;
    const imgSrc = "data:image/jpg;base64," + patient.photo;
    const [back, setBack] = useState(false);
    const [isNewABHA, setIsNewABHA]= useState(false);

    function getAddressLine(){
        return [patient?.house,patient?.street, patient?.landmark, patient?.locality, patient?.villageTownCity, patient?.subDist].filter(e => e !== undefined);
    }

    useEffect(() => {
        if(proceed) {
            if(patient.healthIdNumber === undefined)
                setIsNewABHA(true);
            else
                setLinkAbhaAdress(true);
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
                    {patient.healthIdNumber !== undefined && <ABHACardDownload patient={patient}/>}
                    <Footer setProceed={setProceed} setBack={props.setBack} />
                </div>
            </div>}
            {linkABHAAddress && <LinkABHAAddress patient={patient}/>}
            {isNewABHA && <VerifyMobile patient={patient} setBack={setBack}/>}
        </div>
    );
}
export default PatientAadhaarProfile;