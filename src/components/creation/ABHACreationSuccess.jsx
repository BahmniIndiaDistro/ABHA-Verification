import React, {useEffect, useState} from "react";
import './creation.scss';
import Footer from "./Footer";
import {getDate} from "../Common/DateUtil";
import PatientDetails from "../patient-details/patientDetails";
import {GoVerified} from "react-icons/all";
import ABHACardDownload from "./ABHACardDownload";

const ABHACreationSuccess = (props) => {
    const patient = props.patient
    const [proceed, setProceed] = useState(false);
    const [isPatientMapped,setIsPatientMapped] = useState(false);
    const [mappedPatient,setMappedPatient] = useState({});

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
            mapPatient();
        }
    },[proceed])


    return (
        <div>
            {!isPatientMapped && <div>
                 <p className="note success"> <GoVerified /> <strong>ABHA Created Successfully</strong></p>
                 <p className="note"><strong>ABHA Number: </strong> {patient.healthIdNumber}</p>
                 {patient.healthId !== undefined &&  <p className="note"><strong>ABHA Address: </strong> {patient.healthId}</p>}
                 <ABHACardDownload patient={patient} />
                 <Footer setProceed={setProceed}/>
            </div>}
            {isPatientMapped &&  <PatientDetails ndhmDetails={mappedPatient}/>}
        </div>
    );
}

export default ABHACreationSuccess;