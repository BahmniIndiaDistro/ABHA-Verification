import React, {useEffect, useState} from "react";
import './creation.scss';
import Footer from "./Footer";
import {getDate} from "../Common/DateUtil";
import {GoVerified} from "react-icons/all";
import ABHACardDownload from "./ABHACardDownload";
import LinkABHAAddress from "./LinkABHAAddress";

const ABHACreationSuccess = (props) => {
    const patient = props.patient
    const [proceed, setProceed] = useState(false);
    const [isPatientMapped,setIsPatientMapped] = useState(false);
    const [mappedPatient,setMappedPatient] = useState({});
    const [link, setLink] = useState(false);

    function mapPatient() {
        var identifier = patient?.mobile !== undefined ? [{
            value: patient.mobile
        }] : undefined;
        var address =  {
            line: undefined,
            district: patient?.districtName,
            state: patient?.stateName,
            pincode: patient?.pincode
        };
        const ndhm = {
            healthNumber: patient.healthIdNumber,
            id: patient.healthId,
            gender: patient.gender,
            name: patient.name,
            isBirthDateEstimated: patient?.monthOfBirth == null || patient?.dayOfBirth == null,
            dateOfBirth: getDate(patient),
            address: address,
            identifiers: identifier
        };
        setMappedPatient(ndhm);
        setIsPatientMapped(true);
    }

    useEffect(async () => {
        if (proceed) {
            if(patient.healthId === undefined)
                gotoLink();
            mapPatient();
        }
    },[proceed])

    function gotoLink(){
        setLink(true);
    }


    return (
        <div>
            {!link && !isPatientMapped && <div>
                 <p className="note success"> <GoVerified /> <strong>ABHA Created Successfully</strong></p>
                 <p className="note"><strong>ABHA Number: </strong> {patient.healthIdNumber}</p>
                 {patient.healthId !== undefined &&
                 <div>
                    <p className="note"><strong>ABHA Address: </strong> {patient.healthId}</p>
                     <p className="note">This is a default ABHA Address</p>
                    <div className="linkButton">
                        <button type="button" className="proceed" onClick={gotoLink}>Link different ABHA Address</button>
                        <p className="note">Click on the button to use different abha address for linking</p>
                    </div>
                 </div>}
                 <ABHACardDownload patient={patient} />
                 <Footer setProceed={setProceed}/>
            </div>}
            {link && <LinkABHAAddress patient={patient} />}
        </div>
    );
}
export default ABHACreationSuccess;