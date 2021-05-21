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
export const serviceUnavailableError = {
    "error": {
        "message": "Service Unavailable. Please try again later"
    }
}
