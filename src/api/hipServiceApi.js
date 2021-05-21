import axios from 'axios';
import * as Constants from './constants';
export const getAuthModes = async (healthId) => {
    const data = {
        "healthId": healthId,
        "purpose": Constants.purpose
    };

    try {
        const response = await axios.post(Constants.hipServiceUrl + Constants.authModesUrl, data, Constants.headers);
        return response.data;
    }
    catch (error) {
        if (error.response !== undefined)
            return error.response.data;
        else
            return Constants.serviceUnavailableError;
    }
};

export const authInit = async (healthId, authMode) => {
    const data = {
        "healthId": healthId,
        "authMode": authMode,
        "purpose": Constants.purpose
    };
    try {
        const response = await axios.post(Constants.hipServiceUrl + Constants.authInitUrl, data, Constants.headers);
        return response;
    }
    catch (error) {
        if (error.response !== undefined)
            return error.response.data;
        else
            return Constants.serviceUnavailableError;
    }
};

export const authConfirm = async (healthId, otp) => {
    const data = {
        "authCode": otp,
        "healthId": healthId
    };
    try {
        const response = await axios.post(Constants.hipServiceUrl + Constants.authConfirmUrl, data, Constants.headers);
        return response.data.patient;
    }
    catch (error) {
        if (error.response !== undefined)
            return error.response.data;
        else
            return Constants.serviceUnavailableError;
    }
}

export const fetchPatientDetailsFromBahmni = async (patient) => {
    const params = {
        "patientName": patient.name,
        "patientYearOfBirth": patient.yearOfBirth,
        "patientGender": patient.gender
    }
    try {
        const response = await axios.get(Constants.bahmniUrl + Constants.existingPatientUrl, { params }, Constants.headers);
        return response.data;
    }
    catch (error) {
        if (error.response !== undefined)
            return error.response.data;
        else
            return Constants.serviceUnavailableError;
    }
}
