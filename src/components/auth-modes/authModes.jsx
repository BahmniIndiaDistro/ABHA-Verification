import React, {useState} from "react";
import {authInit} from '../../api/hipServiceApi';

const AuthModes = (props) => {
    const [selectedAuthMode, setSelectedAuthMode] = useState('');

    const healthId = props.healthId;
    const authModes = props.authModes;
    let authModesList = authModes.length > 0 && authModes.map((item, i) => {
                            return (
                                <option key={i} value={item}>{item}</option>
                            )
                        });

    function onAuthModeSelected (e) {
        setSelectedAuthMode(e.target.value);
    }

    function authenticate () {
        const response = authInit(healthId, selectedAuthMode);
        window.parent.postMessage(healthId, "*");
    }

    return (
        <div className="auth-modes">
            <label htmlFor="auth-modes">Preferred mode of Authentication</label>
            <div className="auth-modes-select-btn">
                <div className="auth-modes-select">        
                    <select id="auth-modes" onChange={onAuthModeSelected}>
                        {authModesList}
                    </select>
                </div>
                <button onClick={authenticate}>Authenticate</button>    
            </div>
        </div>
    );
}
export default AuthModes;
