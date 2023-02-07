import React, {useEffect, useState} from "react";
import './creation.scss';
import Spinner from "../spinner/spinner";
import {getCard} from "../../api/hipServiceApi";
import fileDownload from 'js-file-download';
import {GoVerified} from "react-icons/all";


const ABHACardDownload = (props) => {
    const patient = props.patient
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState('');
    const [isCardDownloaded, setIsCardDownloaded] = useState(false);

    async function download() {
        setIsCardDownloaded(false);
        setLoader(true);
        var response = await getCard();
        if (response) {
            setLoader(false);
            if (response.data === undefined) {
                if (response.details !== undefined && response.details.length > 0)
                    setError(response.details[0].message)
                else
                    setError("An error occurred while processing your request")
            } else {
                fileDownload(response.data, patient.healthIdNumber + ".png");
                setIsCardDownloaded(true);
            }
        }
    }



    return (
        <div>
            {!loader &&
             <div className="downloadButton">
                 <button type="button" className="proceed" onClick={download}>Download ABHA Card</button>
             </div>}
            {error !== '' && <h6 className="error">{error}</h6>}
            {loader && <Spinner />}
            {isCardDownloaded && <p className="note success"><GoVerified /> Downloaded Successfully </p>}
        </div>
    );
}
export default ABHACardDownload;