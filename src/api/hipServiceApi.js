import axios from 'axios';

const hipServiceUrl = localStorage.getItem("hipServiceUrl");
const bahmniUrl = localStorage.getItem("bahmniUrl");
const headers = {
    'Content-Type': 'application/json'
};
const purpose = "KYC_AND_LINK";

const authModesUrl = "/v0.5/hip/fetch-modes";
const authInitUrl = "/v0.5/hip/auth/init";
const authConfirmUrl = "/v0.5/hip/auth/confirm";
const existingPatientUrl = "/existingPatients";

export const getAuthModes = async (healthId) => {
    let error = isValidHealthId(healthId);
    if (error) {
        return error;
    }
    const data = {
        "healthId": healthId,
        "purpose": "KYC_AND_LINK"
    };

    try{
       const response = await axios.post(hipServiceUrl + authModesUrl, data, headers);
       return response.data;
    }
    catch(error){
        return error.response.data;
    }

};

export const authInit = async (healthId, authMode) => {
    let error = isValidAuthMode(authMode);
    if (error)
        return error;
    const data = {
        "healthId": healthId,
        "authMode": authMode,
        "purpose": purpose
    };
    try{
        const response = await axios.post(hipServiceUrl + authInitUrl, data, headers);
        return response;
    }
    catch(error){
        return error.response.data;
    }
};

export const authConfirm = async (healthId, otp) => {
    let error = isValidOTP(otp);
    if (error) {
        return error;
    }
    const data = {
        "authCode": otp,
        "healthId": healthId
    };
    try{
        const response = await axios.post(hipServiceUrl + authConfirmUrl ,data, headers);
        return response.data.patient;
    }
    catch(error){
         return error.response.data;
    }
}

export const fetchPatientDetailsFromBahmni = async (patient) => {
    const params = {
        "patientName": patient.name,
        "patientYearOfBirth": patient.yearOfBirth,
        "patientGender": patient.gender
    }
    try{
        const response = await axios.get(bahmniUrl + existingPatientUrl, {params}, headers);
        return response.data;
    }
    catch(error){
         return error.response.data;
    }
}

const isValidHealthId = (healthId) => {
    if (!(IsValidHealthId(healthId) || IsValidHealthNumber(healthId)))
        return Constants.invalidHealthId;
}

const isValidAuthMode = (authMode) => {
    if (authMode === '')
        return Constants.invalidAuthMode;
}

const isValidOTP = (otp) => {
    if (otp === '')
        return Constants.emptyOTP;
}

const IsValidHealthId = (healthId) => {
    let pattern = "^[a-zA-Z]+(([a-zA-Z.0-9]+){2})[a-zA-Z0-9]+@[a-zA-Z]+$";
    return healthId.match(pattern);
}

const IsValidHealthNumber = (healthId) => {
    let pattern = "^(\[0-9]{14})$";
    return healthId.match(pattern);
}