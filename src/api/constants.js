export const hipServiceUrl = localStorage.getItem("hipServiceUrl");
export const bahmniUrl = localStorage.getItem("bahmniUrl");
export const headers = {
    'Content-Type': 'application/json'
};
export const purpose = "KYC_AND_LINK";

export const authModesUrl = "/v0.5/hip/fetch-modes";
export const authInitUrl = "/v0.5/hip/auth/init";
export const authConfirmUrl = "/v0.5/hip/auth/confirm";
export const existingPatientUrl = "/existingPatients";
export const ndhmDemographics = "/v0.5/hip/ndhm-demographics";
export const serviceUnavailableError = {
    "error": {
        "message": "Service Unavailable. Please try again later"
    }
}
export const invalidHealthId = {
    "error": {
        "message": "Health Id is invalid. Must contain at least 4 letters. " +
            " We only allow alphabets and numbers and" +
            " do not allow special character except dot (.)"
    }
}
export const invalidAuthMode = {
    "error": {
        "message": "Please choose a valid auth mode."
    }
}
export const emptyOTP = {
    "error": {
        "message": "OTP cannot be empty."
    }
}
export const openMrsDown = {
    "Error": {
        "message": "OpenMRS-REST is Unhealthy,OpenMRS-FHIR is Unhealthy"
    }
}
