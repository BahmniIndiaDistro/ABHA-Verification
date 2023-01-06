import React, {useState} from "react";
import './creation.scss';
import {checkIfNotNull} from "../verifyHealthId/verifyHealthId";
import Spinner from "../spinner/spinner";
import Footer from "./Footer";

const CreateABHA = () => {
    const [abhaAddress, setAbhaAddress] = useState('');

    function OnChangeHandler(e) {
        setAbhaAddress(e.target.value);
    }

    return (
        <div>
            <div className="abha-address" >
                <label htmlFor="abhaAdddress">Enter ABHA ADDRESS </label>
                <div className="abha-adddress-input" >
                        <input type="text" id="abhaAdddress" name="abhaAdddress" value={abhaAddress} onChange={OnChangeHandler} />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default CreateABHA;