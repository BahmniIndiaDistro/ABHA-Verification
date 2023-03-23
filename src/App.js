import './App.css';
import React from "react";
import VerifyHealthId from './components/verifyHealthId/verifyHealthId';
import './ndhm.scss';
import PatientQueue from './components/patient-queue/patientQueue';
import VerifyAadhaar from "./components/creation/verifyAadhaar";


function App() {
  console.log('first', process.env.REACT_APP_CM_SUFFIX)
  const params = Object.fromEntries(
    new URLSearchParams(window.location.search)
  );

  switch (params['action']) {
    case "patientQueue":
      return (
          <PatientQueue />
      );
    case "createABHA":
      return (
          <VerifyAadhaar />
      );
    default:
      return (
          <VerifyHealthId />
      );
  }

}

export default App;
