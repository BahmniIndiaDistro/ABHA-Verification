import React, {useEffect, useState} from "react";
import './creation.scss';

const AadhaarConsent = (props) => {

    const AadhaarConsents = [
        "I am voluntarily sharing my Aadhaar Number / Virtual ID issued by the Unique Identification Authority of India (“UIDAI”), and my demographic information for the purpose of \n" +
        "creating an Ayushman Bharat Health Account number (“ABHA number”) and Ayushman Bharat Health Account address (“ABHA Address”). I authorize NHA to use my Aadhaar \n" +
        "number / Virtual ID for performing Aadhaar based authentication with UIDAI as per the provisions of the Aadhaar (Targeted Delivery of Financial and other Subsidies, Benefits \n" +
        "and Services) Act, 2016 for the aforesaid purpose. I understand that UIDAI will share my e-KYC details, or response of “Yes” with NHA upon successful authentication",

        "I consent to usage of my ABHA address and ABHA number for linking of my legacy (past) government health records and those which will be generated during this encounter.",

        "I authorize the sharing of all my health records with healthcare provider(s) for the purpose of providing healthcare services to me during this encounter",

        "I consent to the anonymization and subsequent use of my government health records for public health purposes.",

        "I, (name of healthcare worker- depending on the username used for logging in into the system), confirm that I have duly informed and explained the beneficiary of the\n" +
        "contents of consent for aforementioned purposes.",

        "I, (beneficiary name), have been explained about the consent as stated above and hereby provide my consent for the aforementioned purposes."
    ]

    const [aadhaarConsent, setAadhaarConsent] = useState(
        [true ,true ,true ,true ,false ,false]
    );
    const [consentError, setConsentError]= useState(
        new Array(AadhaarConsents.length).fill(false)
    )
    const [error, setError] = useState('');

    function onClick(e) {
        setError('');
        const updatedCheckedState = aadhaarConsent.map((item, index) => {
                const updatedError = consentError.map((item, index) =>
                    index.toString() === e.target.id ? !item : item );
                setConsentError(updatedError);
                return index.toString() === e.target.id ? !item : item;
            }
        );
        setAadhaarConsent(updatedCheckedState);
    }


    useEffect(() => {
        if(!aadhaarConsent[4] && !aadhaarConsent[5] && !aadhaarConsent[3]){
            setError('Consent is required or choose either of the below')
        }
        else
        {
            if(consentError.slice(0,3).filter(e => e === true).length > 0){
                setError('Consent is required');
            }
        }

    },[consentError])

    useEffect(() => {
        if(error === ''){
            props.setConsentGrated(true);
        }
        else
        {
            props.setConsentGrated(false);
        }
    },[error])

    return (
        <div>
            <p>I hereby confirm my consent,</p>
            {AadhaarConsents.map((consent ,index) => {
                return (
                    <div>
                    {index <= 3 && <div className="consent-input">
                        <input type="checkbox" id={index} checked={aadhaarConsent[index]} className="consent-checkbox" onChange={onClick}/>
                        <span className="consent">{consent}</span>
                    </div>}
                     {consentError[index] && error !== '' && <h6 className="error">{error}</h6>}
                    {index > 3 && <div className="consent-input sub-consent-input">
                        <input type="checkbox" id={index} checked={aadhaarConsent[index]} className="consent-checkbox" onChange={onClick}/>
                        <span className="consent">{consent}</span>
                    </div>}
                    </div>
                )}
            )}
        </div>
    );
}

export default AadhaarConsent;
