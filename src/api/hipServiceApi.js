import axios from 'axios';

const hipServiceUrl = localStorage.getItem("hipServiceUrl"); // "http://localhost:9052/v0.5/hip/fetch-modes"

const headers = {
    'Content-Type': 'application/json'
};

export const getAuthModes =  (healthId) => {
    console.log(hipServiceUrl);
    const data = {
        "healthId": healthId,
        "purpose": "KYC_AND_LINK"
    };
    // axios.post(hipServiceUrl + "/fetch-modes", data, headers).then(res => {
    //     console.log(res);
    // });
    return {
        "authModes": ["MOBILE_OTP", "AADHAR_OTP"]
    };
};

export const authInit = (healthId, authMode) => {
    const data = {
        "healthId": healthId,
        "authMode": authMode,
        "purpose": "KYC_AND_LINK"
    };
    // axios.post(hipServiceUrl + "/auth/init", data, headers).then(res => {
    //     console.log(res);
    // });
    return {
        "OTP": 123456
    };
};
