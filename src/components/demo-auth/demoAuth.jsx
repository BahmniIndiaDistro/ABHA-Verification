import React, {useEffect, useState} from "react";
import moment from 'moment';
import {authConfirm, aadhaarDemographicsAuth} from '../../api/hipServiceApi';
import Spinner from '../spinner/spinner';
import {getDate} from "../Common/DateUtil";
import Footer from "../creation/Footer";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Typography from "@mui/material/Typography";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './demoAuth.scss';
import { checkIfNotNull } from "../verifyHealthId/verifyHealthId";
import PatientDetails from "../patient-details/patientDetails";

const DemoAuth = (props) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [loader, setLoader] = useState(false);
    const [ndhmDetails, setNdhmDetails] = [props.ndhmDetails,props.setNdhmDetails];
    const [aadhaarDemographicsResponse, setAadhaarDemographicsResponse] = useState({});
    const isAadhaarDemoAuth = props.isAadhaarDemoAuth;
    const [demographics, setDemographics] = useState({
        name: '',
        gender: '',
        dateOfBirth: '',
        mobileNumber: '',
        identifier: null,
        state: '',
        district: '',
        aadhaarNumber: props.aadhaar
    });
    const [isDisabled, setIsDisabled] = useState(true);
    const [checked, setChecked] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const year = moment(selectedDate).format('yyyy');

    const handleChange = () => {
        setChecked(!checked);
        setDemographics(prevState => ({
            ...prevState,
            dateOfBirth: year.toString()
        }));
    };

    const handleDateOfBirthChange = (date) => {
        const dateObject = new Date(date);
        let formattedDate = checked ? `${dateObject.getFullYear()}` : `${dateObject.getDate().toString().padStart(2, '0')}-${(dateObject.getMonth() + 1).toString().padStart(2, '0')}-${dateObject.getFullYear()}`;
        setSelectedDate(date);
        setDemographics(prevState => ({
            ...prevState,
            dateOfBirth: formattedDate
        }));
    };

    async function confirmAuth() {
			setLoader(true);
			setShowError(false);
			let response;
			if (isAadhaarDemoAuth) {
				response = await aadhaarDemographicsAuth(demographics);
			} else {
				demographics.identifier = { type: "MOBILE", value: demographics.mobileNumber };
				response = await authConfirm(props.id, null, demographics);
			}
			if(response) {
			    setLoader(false);
                if (response.name !== undefined) {
                    isAadhaarDemoAuth ? setAadhaarDemographicsResponse(parseDemographicsNdhmDetails(response)) : setNdhmDetails(parseNdhmDetails(response));
                }
                else {
                    setShowError(true);
                    if (response.error !== undefined || response.Error !== undefined) {
                        console.log("inside if error", response);
                        if (response.error.code === 1441) {
                            setErrorMessage("The authentication was unsuccessful. Please check the details you entered.");
                        } else {
                            setErrorMessage((response.Error && response.Error.Message) || response.error.message);
                        }
                    }
                    else {
                        setErrorMessage(response.message || "An error occurred while processing your request");
                    }
                }
            }
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

    function parseDemographicsNdhmDetails(patient) {
        const ndhm = {
            id: patient.healthId,
            gender: patient.gender,
            name: patient.firstName + " " +  patient.middleName + " " + patient.lastName,
            dateOfBirth: getDate(patient),
            phoneNumber: patient.mobile,
            address: {line:patient.address, district: patient.districtName, state: patient.stateName, pincode: patient.pincode},
            healthIdNumber: patient.healthIdNumber
        };
        return ndhm;
    }

    useEffect(() => {
        if(demographics.name !== '' && demographics.gender !== '' && demographics.dateOfBirth !== '' && demographics.district !== '' && demographics.state !== ''){
            setIsDisabled(false);
        }
    }, [demographics])

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if(name === "mobileNumber"){
            const regEx = /^[0-9\b]+$/;
            if (!regEx.test(value)) {
               return;
            }
        }
        setDemographics((prevProps) => ({
            ...prevProps,
            [name]: value
        }));
    };

    return (
        <div>
            {checkIfNotNull(aadhaarDemographicsResponse) ? <PatientDetails ndhmDetails={aadhaarDemographicsResponse} /> :
            <>
            <p className="note">Please provide your demographic details</p>
            <div className="demo-auth-form-field">
                <label htmlFor="name" className="required-label">Enter Name: </label>
                <input type="text" name="name" value={demographics.name} onChange={handleInputChange} placeholder="Name" required/>
            </div>
            <div className="demo-auth-form-field">
                <label htmlFor="gender" className="required-label">Choose Gender: </label>
                <select name="gender" onChange={handleInputChange} required>
                    <option value=''>Select gender..</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                    <option value="U">Undisclosed</option>
                </select>
            </div>
            <FormGroup>
                 <FormControlLabel
                     style={{marginLeft: "2.7%", width: "100%"}}
                     control={<Switch checked={checked} onChange={handleChange} />}
                     label={
                         <Typography style={{ fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif', fontSize: '12px' }}>
                             Do you have only year of birth as per Aadhaar?
                         </Typography>
                     }
                 />
             </FormGroup>
             <div className="demo-auth-form-field">
                <label htmlFor="dateOfBirth" className="dob-label required-label">{checked ? "Enter Year of Birth:" : "Enter Date of Birth:" } </label>
                <DatePicker
                     className="date-picker"
                     selected={selectedDate}
                     onChange={handleDateOfBirthChange}
                     showYearPicker={checked}
                     dateFormat={checked ? 'yyyy' : 'dd-MM-yyyy'}
                     placeholderText={checked ? 'yyyy' : 'dd-mm-yyyy'}
                 />
             </div>
            <div className="demo-auth-form-field">
                <label htmlFor="mobile" className={isAadhaarDemoAuth ? "label": "required-label"}>Enter Mobile Number: </label>
                <input type="text" name="mobileNumber" value={demographics.mobileNumber} onChange={handleInputChange} placeholder="Mobile" required={!isAadhaarDemoAuth}/>
            </div>
             {isAadhaarDemoAuth && <div>
                 <div className="demo-auth-form-field">
                     <label htmlFor="district" className="required-label">Enter District: </label>
                     <input type="text" name="district" value={demographics.district} onChange={handleInputChange} placeholder="District" required/>
                 </div>
                 <div className="demo-auth-form-field">
                     <label htmlFor="state" className="required-label">Enter State: </label>
                     <input type="text" name="state" value={demographics.state} onChange={handleInputChange} placeholder="State" required/>
                 </div>
             </div>}
             <div className="fetch-abdm-record">
                 <Footer setBack={props.setBack} />
                 <button className="demo-fetch-button" type="button" disabled={isDisabled} onClick={confirmAuth}>
                     {isAadhaarDemoAuth ? 'Create ABHA' : 'Fetch ABDM Data'}</button>
             </div>
             {showError && <h6 className="error-msg">{errorMessage}</h6>}
            </>
            } 
            {loader && <Spinner />}
        </div>
    );
}
export default DemoAuth;
