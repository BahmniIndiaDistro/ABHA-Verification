import React, {useEffect, useState} from "react";
import './creation.scss';
import {getUserName} from "../../api/openmrServiceApi";
import reactStringReplace from "react-string-replace";

const AadhaarConsent = (props) => {

    const [userName, setUserName] = useState(undefined);
    const [aadhaarConsent, setAadhaarConsent] = useState(
        [true ,true ,true ,true ,false ,false]
    );
    const [beneficiary, setBeneficiary] = useState('');
    const [error, setError] = useState(false);

    const AadhaarConsents = [
        " I am voluntarily sharing my Aadhaar Number and demographic information issued by UIDAI, with National Health Authority (NHA) for the sole purpose of creation of ABHA number.\n" +
        " I understand that my ABHA number can be used and shared for purposes as may be notified by ABDM from time to time including provision of healthcare services. Further, I am aware that my personal identifiable information (Name, Address, Age, Date of Birth, Gender and Photograph) may be made available to the entities working in the National Digital Health Ecosystem (NDHE) which inter alia includes stakeholders and entities such as healthcare professionals (e.g. doctors), facilities (e.g. hospitals, laboratories) and data fiduciaries (e.g. health programmes), which are registered with or linked to the Ayushman Bharat Digital Mission (ABDM), and various processes there under.\n" +
        " I authorize NHA to use my Aadhaar number for performing Aadhaar based authentication with UIDAI as per the provisions of the Aadhaar (Targeted Delivery of Financial and other Subsidies, Benefits and Services) Act, 2016 for the aforesaid purpose. I understand that UIDAI will share my e-KYC details, or response of \"Yes\" with NHA upon successful authentication. I have been duly informed about the option of using other IDs apart from Aadhaar; however, I consciously choose to use Aadhaar number for the purpose of availing benefits across the NDHE. I am aware that my personal identifiable information excluding Aadhaar number / VID number can be used and shared for purposes as mentioned above. I reserve the right to revoke the given consent at any point of time as per provisions of Aadhaar Act and Regulations.\n",

        "I consent to usage of my ABHA address and ABHA number for linking of my legacy (past) government health records and those which will be generated during this encounter.",

        "I authorize the sharing of all my health records with healthcare provider(s) for the purpose of providing healthcare services to me during this encounter",

        "I consent to the anonymization and subsequent use of my government health records for public health purposes.",

        `I (${userName}), confirm that I have duly informed and explained the beneficiary of the\n` +
        `contents of consent for aforementioned purposes.`,

        "I {beneficiaryInputBox} , have been explained about the consent as stated above and hereby provide my consent for the aforementioned purposes."
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
        if(beneficiary !== '' && beneficiary.length > 2 && aadhaarConsent.filter(e => e === true).length === aadhaarConsent.length){
            setError(false)
            props.setConsentGrated(true);
        }
    },[aadhaarConsent, beneficiary])

    function updateBeneficiary(e){
        const re= /^[a-zA-Z \s]+$/
        if(e.target.value === '' || re.test(e.target.value))
            setBeneficiary(e.target.value);
    }

    return (
        <div>
        <div className="consent-screen">
            <p>I hereby confirm my consent,</p>
            {AadhaarConsents.map((consent ,index) => {
                return (
                    <div>
                    {index <= 3 &&
                    <div className="consent-input">
                        <input type="checkbox" id={index} checked={aadhaarConsent[index]} className="consent-checkbox" onChange={onClick}/>
                        <span className="consent">{consent}</span>
                    </div>}
                    {index > 3 && <div className="consent-input sub-consent-input">
                        <input type="checkbox" id={index} checked={aadhaarConsent[index]} className="consent-checkbox" onChange={onClick}/>
                        <span className="consent">
                        {reactStringReplace(consent, '{beneficiaryInputBox}', (match, i) => (
                            <input type="text" minLength="3" required
                                   placeholder="Beneficiary name" value={beneficiary} onChange={updateBeneficiary}/>
                        ))}
                        </span>
                    </div>}
                    </div>
                )}
            )}
        </div>
        {error && <p className="error-msg">*Please select all the above checkboxes and enter beneficiary name to proceed</p>}
        </div>
    );
}

export default AadhaarConsent;
