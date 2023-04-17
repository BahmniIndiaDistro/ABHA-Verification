import React, {useEffect, useState} from "react";
import {authConfirm, checkAndGetPatientDetails} from '../../api/hipServiceApi';
import Spinner from '../spinner/spinner';
import {getDate} from "../Common/DateUtil";
import Footer from "../creation/Footer";

const DemoAuth = (props) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [loader, setLoader] = useState(false);
    const [ndhmDetails, setNdhmDetails] = [props.ndhmDetails,props.setNdhmDetails];
    const [demograhics, setDemograhics] = useState({
        name: '',
        gender: '',
        dateOfBirth: '',
        mobile: '',
        identifier: null
    });
    const [isValid, setIsValid] = useState(false);

    function ToIdentifier(type,value) {
        let identifier = {
            type : type,
            value: value
        }
        demograhics.identifier = identifier;
    }

    async function confirmAuth() {
        setLoader(true);
        setShowError(false);
        ToIdentifier("MOBILE", demograhics.mobile);
        const response = await authConfirm(props.id, null, demograhics);
        if (response.error !== undefined || response.Error !== undefined) {
            setShowError(true)
            setErrorMessage((response.Error && response.Error.Message) || response.error.message);
        }
        else {
            setNdhmDetails(parseNdhmDetails(response));
        }
        setLoader(false);
    }

    function parseNdhmDetails(patient) {
        const ndhm = {
            id: props.id,
            gender: patient.gender,
            name: patient.name,
            isBirthDateEstimated: patient?.monthOfBirth == null || patient?.dayOfBirth == null,
            dateOfBirth: getDate(patient),
            address: patient.address,
            identifiers: patient.identifiers
        };
        return ndhm;
    }


    useEffect(() => {
        if(demograhics.name === '' || demograhics.gender === '' || demograhics.dateOfBirth === '' || demograhics.mobile === ''){
            setIsValid(false);
        }
        else
            setIsValid(true)
    }, [demograhics])

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if(name === "mobile"){
            const regEx = /^[0-9\b]+$/
            if (!regEx.test(value)) {
               return;
            }
        }
        setDemograhics((prevProps) => ({
            ...prevProps,
            [name]: value
        }));
    };

    return (
        <div>
            <p className="note">Please provide your demographic details</p>
           <div className="demo-auth-form-field">
               <label htmlFor="name" className="label">Enter Name: </label>
               <input type="text" name="name" value={demograhics.name} onChange={handleInputChange} placeholder="Name" required/>
           </div>
           <div className="demo-auth-form-field">
               <label htmlFor="gender" className="label">Choose Gender: </label>
               <select name="gender" onChange={handleInputChange} required>
                   <option value=''>Select gender..</option>
                   <option value="M">Male</option>
                   <option value="F">Female</option>
                   <option value="O">Other</option>
                   <option value="U">Undisclosed</option>
               </select>
           </div>
           <div className="demo-auth-form-field">
               <label htmlFor="dateOfBirth" className="label">Enter Date of Birth: </label>
               <input type="date"  name="dateOfBirth" value={demograhics.dateOfBirth} onChange={handleInputChange}
                      max={new Date().toISOString().split('T')[0]} placeholder="Date of Birth" required/>
           </div>
           <div className="demo-auth-form-field">
               <label htmlFor="mobile" className="label">Enter Mobile Number: </label>
               <input type="text" name="mobile" value={demograhics.mobile} onChange={handleInputChange} placeholder="Mobile" required/>
           </div>
            <div className="fetch-abdm-record">
                <Footer setBack={props.setBack} />
                <button type="button" disabled={!isValid} onClick={confirmAuth}>Fetch ABDM Data</button>
            </div>
            {loader && <Spinner />}
            {showError && <h6 className="error">{errorMessage}</h6>}
        </div>
    );
}
export default DemoAuth;
