import './App.css';
import React, {useEffect} from "react";
import VerifyHealthId from './components/verifyHealthId/verifyHealthId';
import './ndhm.scss';
import OtpVerification from './components/otp-verification/otpVerification';

function App() {

  useEffect(() =>{
    window.addEventListener("message", function (hipData) {
        let hipUrl = hipData.data.value;
        localStorage.setItem("hipServiceUrl", hipUrl);
    }, false)}
  );

  return (
    <div className="app">
      <VerifyHealthId />
    </div>
  );
}

export default App;
