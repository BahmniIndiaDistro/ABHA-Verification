
export const headers = {
    'Content-Type': 'application/json'
};
export const purpose = "KYC_AND_LINK";
export const bahmniUrl = "/openmrs/ws/rest/v1/hip";
export const hipServiceUrl ="/hiprovider";

export const authModesUrl = "/v0.5/hip/fetch-modes";
export const authInitUrl = "/v0.5/hip/auth/init";
export const authConfirmUrl = "/v0.5/hip/auth/confirm";
export const existingPatientUrl = "/existingPatients";
export const ndhmDemographics = "/v0.5/hip/ndhm-demographics";
export const patientProfileFetch ="/v0.5/patients/profile/fetch";
export const serviceUnavailableError = {
    "error": {
        "message": "Service Unavailable. Please try again later"
    }
}
export const invalidHealthId = {
    "error": {
        "message": "Health Id/PHR Address is invalid. " +
            "Health Id must contain 14 digits. Eg. 57-0517-6745-1839, 57051767451839. " +
            "PHR Address must contain at least 4 letters. " +
            "Only alphabets and numbers are allowed and " +
            "special character are not allowed except dot(.). Eg. kamla.rani@sbx"
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
