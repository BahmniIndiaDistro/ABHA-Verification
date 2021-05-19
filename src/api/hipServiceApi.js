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
    const data = {
        "healthId": healthId,
        "purpose": "KYC_AND_LINK"
    };
   const response = await axios.post(hipServiceUrl + authModesUrl, data, headers);
   return response.data.authModes;
};

export const authInit = async (healthId, authMode) => {
    const data = {
        "healthId": healthId,
        "authMode": authMode,
        "purpose": purpose
    };

    const response = await axios.post(hipServiceUrl + authInitUrl, data, headers);
    return response;
};

export const authConfirm = async (healthId, otp) => {
    const data = {
        "authCode": btoa(otp),
        "healthId": healthId
    };
    const response = await axios.post(hipServiceUrl + authConfirmUrl ,data, headers);
    return response.data.patient;
}

export const fetchPatientDetailsFromBahmni = async (patient) => {
    const params = {
        "patientName": patient.name,
        "patientYearOfBirth": patient.yearOfBirth,
        "patientGender": patient.gender
    }
    const response = await axios.get(bahmniUrl + existingPatientUrl, {params}, headers);
    return response.data;
}
