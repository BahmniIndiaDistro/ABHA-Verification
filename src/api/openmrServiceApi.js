import axios from 'axios';
import * as Constants from './constants';
export const getUserName = async () => {
    try {
        const response = await axios.get(Constants.openmrsSession);
        if(response.data.authenticated){
            return response.data;
        }
        return null;
    }
    catch (error) {
        if (error.response !== undefined)
            return error.response.data;
        else
            return Constants.serviceUnavailableError;
    }
};