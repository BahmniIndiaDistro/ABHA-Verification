import React, {useEffect, useState} from "react";
import './creation.scss';
import PatientDetails from "../patient-details/patientDetails";
import VerifyMobileEmail from "./VerifyMobileEmail";
import {cmSuffix} from "../../api/constants";
import CreateABHAAddress from "./CreateABHAAddress";

const LinkABHAAddress = (props) => {
    const patient = props.patient;
    const [abhaAddress, setAbhaAddress] = useState('');
    const [proceed, setProceed] = useState(false);
    const [mappedPatient, setMappedPatient] = useState({});
    const [link, setLink] = useState(false);
    const [newAbhaAddress, setNewAbhaAddress] = useState('');
    const [abhaAddressCreated, setABHAAddressCreated]= useState(false);

    function onABHAAddressChange(e) {
        setAbhaAddress(e.target.value);
    }

    function onProceed() {
        mapPatient();
        setProceed(true);
    }

    let phrAddressList = patient.phrAddress !== undefined && patient.phrAddress.length > 0 && patient.phrAddress.map((item, i) => {
        return (
            <option key={i} value={item}>{item}</option>
        )
    });

    function getAddressLine(){
        return [patient?.districtName,patient?.stateName,patient?.pincode].filter(e => e !== undefined);
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
            id: abhaAddressCreated ? (newAbhaAddress + "@" + cmSuffix) : abhaAddress,
            gender: patient.gender,
            name: patient.name,
            isBirthDateEstimated: false,
            dateOfBirth: patient?.birthdate.split('-').reverse().join('-'),
            address: address,
            identifiers: identifier
        };
        console.log(ndhm);
        setMappedPatient(ndhm);
    }

    function gotoLink(){
        setLink(true);
    }

    useEffect(() => {
        if(abhaAddressCreated){
            onProceed();
        }
    },[abhaAddressCreated])



    return (
        <div>
            {!link && !proceed &&
            <div>
                {patient.phrAddress === undefined &&
                 <p className="note">No Mapped ABHA Address found</p>}
                {patient.phrAddress !== undefined &&
                <div>
                    <div className="select-option">
                        <label htmlFor="abha-address">Choose ABHA-Address</label>
                        <div className="select-btn">
                            <div className="select">
                                <select id="auth-modes" onChange={onABHAAddressChange}>
                                    <option>ABHA-Address</option>
                                    {phrAddressList}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="message">The above lists all the ABHA address mapped to the ABHA Number.
                        Chosen ABHA Address will be linked in Bahmni.</div>
                    <div className="center">
                        <button type="button" className="proceed" onClick={onProceed}>Proceed</button>
                    </div>
                </div>}
                <p className="note">OR</p>
                <div className="linkButton">
                    <button type="button" className="proceed" onClick={gotoLink}>Link ABHA Address</button>
                </div>
                <p className="note">OR</p>
                <CreateABHAAddress newAbhaAddress={newAbhaAddress} setNewAbhaAddress={setNewAbhaAddress} setABHAAddressCreated={setABHAAddressCreated} />
            </div>}
            {link && <VerifyMobileEmail healthIdNumber={patient.healthIdNumber} />}
            {proceed && <PatientDetails ndhmDetails={mappedPatient}/>}
        </div>
    );
}

export default LinkABHAAddress;
