import React, {useEffect, useState} from "react";
import './creation.scss';
import {getUserName} from "../../api/openmrServiceApi";

const AadhaarConsent = (props) => {

    const [userName, setUserName] = useState(undefined);
    const [aadhaarConsent, setAadhaarConsent] = useState(
        [true ,true ,true ,true ,false ,false]
    );
    const [error, setError] = useState(false);

    const AadhaarConsents = [
        "I am voluntarily sharing my Aadhaar Number / Virtual ID issued by the Unique Identification Authority of India (“UIDAI”), and my demographic information for the purpose of \n" +
        "creating an Ayushman Bharat Health Account number (“ABHA number”) and Ayushman Bharat Health Account address (“ABHA Address”). I authorize NHA to use my Aadhaar \n" +
        "number / Virtual ID for performing Aadhaar based authentication with UIDAI as per the provisions of the Aadhaar (Targeted Delivery of Financial and other Subsidies, Benefits \n" +
        "and Services) Act, 2016 for the aforesaid purpose. I understand that UIDAI will share my e-KYC details, or response of “Yes” with NHA upon successful authentication",

        "I consent to usage of my ABHA address and ABHA number for linking of my legacy (past) government health records and those which will be generated during this encounter.",

        "I authorize the sharing of all my health records with healthcare provider(s) for the purpose of providing healthcare services to me during this encounter",

        "I consent to the anonymization and subsequent use of my government health records for public health purposes.",

        `I (${userName}), confirm that I have duly informed and explained the beneficiary of the\n` +
        `contents of consent for aforementioned purposes.`,

        `I ${`<input type="text" placeholder="Beneficiary name">`}, have been explained about the consent as stated above and hereby provide my consent for the aforementioned purposes.`
    ]

    function onClick(e) {
        const updatedCheckedState = aadhaarConsent.map((item, index) =>
               index.toString() === e.target.id ? !item : item
        );
        setAadhaarConsent(updatedCheckedState);
    }

    useEffect(async () => {
        if (userName === undefined) {
            var response = await getUserName();
            if (response.user?.display !== undefined) {
                setUserName(response.user.display);
            }

        }
    },[]);

    useEffect(() => {
        setError(true);
        props.setConsentGrated(false);
        if(aadhaarConsent.filter(e => e === true).length === aadhaarConsent.length){
            setError(false)
            props.setConsentGrated(true);
        }
    },[aadhaarConsent])

    return (
        <div>
        <div className="consent-screen">
            <p>I hereby confirm my consent,</p>
            {AadhaarConsents.map((consent ,index) => {
                return (
                    <div>
                    {index <= 3 && <div className="consent-input">
                        <input type="checkbox" id={index} checked={aadhaarConsent[index]} className="consent-checkbox" onChange={onClick}/>
                        <span className="consent">{consent}</span>
                    </div>}
                    {index > 3 && <div className="consent-input sub-consent-input">
                        <input type="checkbox" id={index} checked={aadhaarConsent[index]} className="consent-checkbox" onChange={onClick}/>
                        <span className="consent" dangerouslySetInnerHTML={{ __html: consent }} />
                    </div>}
                    </div>
                )}
            )}
        </div>
        {error && <p className="error-msg">*Please select all the above checkboxes to proceed</p>}
        </div>
    );
}

export default AadhaarConsent;
