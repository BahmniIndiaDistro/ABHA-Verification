import {get} from "lodash";
import {HIP_SERVICES_VERIFY_URL, HIP_SERVICES_AUTH_INIT_URL} from "../../api/ApiUtils";
import axios from 'axios';

export const verifyHealthIdSrv = async (healthId) => {
        const HIPURL = "http://localhost:9052";
        try {
            const headers = {
                'Content-Type': 'application/json'
            }
            const data = {
                "healthId": healthId,
                "purpose": "KYC_AND_LINK"
            }
            const response = await axios.post(HIPURL + HIP_SERVICES_VERIFY_URL, data, headers);
            return {
                error: false,
                result: response.data ,
            };
        } catch
            (error) {
            const status = get(error, "response.status");
            console.log("enered--- verifgy failed");
            return {
                error: status !== 404,
                result: status === 404 ? {} : null,
            };
        }
    };

export const initAuthSrv = async (healthId, selAuthMode) => {
    const HIPURL = "http://localhost:9052";
    try {
        const headers = {
            'Content-Type': 'application/json'
        }
        const data = {
            "healthId": healthId,
            "authMode": selAuthMode,
            "purpose": "KYC_AND_LINK"
        }
        const response = await axios.post(HIPURL + HIP_SERVICES_AUTH_INIT_URL, data, headers);
        return {
            error: false,
            result: response.data ? response.data.response : {},
        };
    } catch (error) {
        const status = get(error, "response.status");
        return {
            error: status !== 404,
            result: status === 404 ? {} : null,
        };
    }
};

