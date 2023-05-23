import React, {useEffect, useState} from "react";
import './creation.scss';
import Footer from "./Footer";
import {GoVerified} from "react-icons/all";
import ABHACard from "./ABHACard";
import LinkABHAAddress from "./LinkABHAAddress";

const ABHACreationSuccess = (props) => {
    const patient = props.patient
    const [proceed, setProceed] = useState(false);
    const [link, setLink] = useState(false);

    function mapHealthIdNumber(){
        props.mappedPatient.healthIdNumber = patient.healthIdNumber;
        if(props.mappedPatient.identifiers === undefined){
            props.mappedPatient.identifiers = patient?.mobile !== undefined ? [{
                value: patient.mobile
            }] : undefined
        }
    }

    useEffect(() => {
        if(proceed){
            mapHealthIdNumber();
            setLink(true);
            setProceed(false);
        }
    },[proceed])

    return (
        <div>
            {!link &&
            <div>
                 <p className="note success"> <GoVerified /> <strong>ABHA Created Successfully</strong></p>
                 <p className="note"><strong>ABHA Number: </strong> {patient.healthIdNumber}</p>
                 <ABHACard healthIdNumber={patient?.healthIdNumber} />
                 <Footer setProceed={setProceed}/>
            </div>}
            {link && <LinkABHAAddress patient={patient} mappedPatient={props.mappedPatient}/>}
        </div>
    );
}
export default ABHACreationSuccess;