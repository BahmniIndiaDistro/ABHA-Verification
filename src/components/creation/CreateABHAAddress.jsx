import React, {useState} from "react";
import './creation.scss';
import Spinner from "../spinner/spinner";
import {checkIfABHAAddressExists, createABHAAddress} from "../../api/hipServiceApi";
import Footer from "./Footer";
import { cmSuffixProperty } from "../../api/constants";

const CreateABHAAddress = (props) => {
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState('');
    const [newAbhaAddress, setNewAbhaAddress] = [props.newAbhaAddress,props.setNewAbhaAddress];
    const [isPreferred, setIsPreferred]= useState(false);
    const cmSuffix = localStorage.getItem(cmSuffixProperty)

    function OnChangeHandler(e) {
        setNewAbhaAddress(e.target.value);
        setError('');
    }

    async function onCreate() {
        setError('');
        if (newAbhaAddress === '') {
            setError("ABHA Address cannot be empty")
        } else if(newAbhaAddress.length > 3) {
            setLoader(true);
            var ifABHAExists = await checkIfABHAAddressExists(newAbhaAddress);
            if (ifABHAExists) {
                setLoader(false);
                if (ifABHAExists.data !== undefined) {
                    if (!ifABHAExists.data) {
                        setLoader(true);
                        var response = await createABHAAddress(newAbhaAddress, isPreferred);
                        if (response) {
                            setLoader(false);
                            if (response.data === undefined) {
                                processingError(response);
                            } else {
                                props.setABHAAddressCreated(true);
                            }
                        }
                    } else {
                        setError("ABHA Address already Exists");
                    }
                } else {
                    processingError(ifABHAExists);
                }
            }
        }
        else {
            setError("ABHA Address should have minimum of 4 characters");
        }
    }

    function processingError(response){
        if (response.details !== undefined && response.details.length > 0)
            setError(response.details[0].message)
        else
            setError("An error occurred while processing your request")
    }

    function OnClick(){
        setIsPreferred(!isPreferred);
    }

    return (
        <div>
            <div>
                <div className="abha-address" >
                    <label htmlFor="abhaAdddress">Enter new ABHA ADDRESS </label>
                    <div className="abha-adddress-input" >
                        <div className="new-abha-address-input">
                            <input type="text" id="abhaAdddress" name="abhaAdddress" value={newAbhaAddress} onChange={OnChangeHandler} />
                            <span className="abha-address-suffix">{cmSuffix}</span>
                        </div>
                    </div>
                </div>
                <div className="center" >
                    <input type="checkbox" id="preferred" checked={isPreferred} className="checkbox" onChange={OnClick}/>
                    <span className="preferred"> Preferred </span>
                </div>
                <p className="message">Click on the check box to make the above abha-address as a default</p>
                {error !== '' && <h6 className="error">{error}</h6>}
                {loader && <Spinner />}
                <div className="center">
                    <button type="button" className="proceed" onClick={onCreate}>Create</button>
                </div>
                <Footer setBack={props.setBack} />
            </div>
        </div>
    );
}

export default CreateABHAAddress;
