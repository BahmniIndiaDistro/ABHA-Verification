import React, {useEffect, useState} from "react";
import './creation.scss';
import Spinner from "../spinner/spinner";
import {getCard} from "../../api/hipServiceApi";
import {GoVerified} from "react-icons/all";


const ABHACard = (props) => {
    const patient = props.patient
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState('');
    const [isCardDownloaded, setIsCardDownloaded] = useState(false);
    const [imgSrc, setImgSrc] = useState(null);
    const [cardView, setView] = useState(false);
    const [downloadLoader, setDownloadLoader] = useState(false);
    let imgUrl = null;

    async function getPngCard() {
        if(imgUrl == null) {
            var response = await getCard();
            if (response) {
                setLoader(false);
                setDownloadLoader(false);
                if (response.data === undefined) {
                    if (response.details !== undefined && response.details.length > 0)
                        setError(response.details[0].message)
                    else
                        setError("An error occurred while processing your request")
                } else {
                    const blob = new Blob([response.data]);
                    const url = URL.createObjectURL(blob);
                    imgUrl = url;
                }
            }
        }
    }

    async function download() {
        setDownloadLoader(true);
        setIsCardDownloaded(false);
        await getPngCard();
        if (imgUrl !== null) {
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = imgUrl;
            a.download = patient.healthIdNumber + ".png";
            a.click();
            window.URL.revokeObjectURL(imgUrl);
            setIsCardDownloaded(true);
        }
    }

    async function view() {
        setLoader(true);
        await getPngCard();
        if (imgUrl !== null) {
           setLoader(false);
           setView(true);
           setImgSrc(imgUrl);
        }
    }



    return (
        <div>
            {!loader && !cardView && <div className="downloadButton">
                <button type="button" className="proceed" onClick={view}>View ABHA Card</button>
            </div>}
            {loader && <Spinner />}
            {cardView && <img src={imgSrc} width="500" height="300" />}
            {!downloadLoader &&
             <div className="downloadButton">
                  <button type="button" className="proceed" onClick={download}>
                      Download ABHA Card
                  </button>
             </div>}
            {downloadLoader && <Spinner />}
            {error !== '' && <h6 className="error">{error}</h6>}
            {isCardDownloaded && <p className="note success"><GoVerified /> Downloaded Successfully </p>}
        </div>
    );
}
export default ABHACard;