import React, {useState} from "react";
import './creation.scss';

const Creation = () => {
    const [id, setId] = useState('');

    function idOnChangeHandler(e) {
        setId(e.target.value);
    }

    return (
        <div>
            <div className="aadhaar-otp">
                <label htmlFor="aadhaar" className="label">Enter AADHAAR Number</label>
                <div className="verify-aadhaar-input-btn">
                    <div className="verify-aadhaar-input">
                        <input type="text" id="aadhaar" name="aadhaar" value={id} onChange={idOnChangeHandler} />
                    </div>
                    <button name="verify-btn" type="submit">Verify</button>
                </div>
            </div>
        </div>
    );
}


export default Creation;
