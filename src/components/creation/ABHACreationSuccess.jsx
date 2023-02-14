import React, {useState} from "react";
import './creation.scss';
import Footer from "./Footer";
import {GoVerified} from "react-icons/all";
import ABHACardDownload from "./ABHACardDownload";
import LinkABHAAddress from "./LinkABHAAddress";

const ABHACreationSuccess = (props) => {
    const patient = props.patient
    const [proceed, setProceed] = useState(false);

    return (
        <div>
            {!proceed &&
            <div>
                 <p className="note success"> <GoVerified /> <strong>ABHA Created Successfully</strong></p>
                 <p className="note"><strong>ABHA Number: </strong> {patient.healthIdNumber}</p>
                 <ABHACardDownload patient={patient} />
                 <Footer setProceed={setProceed}/>
            </div>}
            {proceed && <LinkABHAAddress patient={patient} />}
        </div>
    );
}
export default ABHACreationSuccess;