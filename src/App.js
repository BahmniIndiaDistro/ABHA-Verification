import './App.css';
import React from "react";
import VerifyHealthId from './components/verifyHealthId/verifyHealthId';
import './ndhm.scss';
import PatientQueue from './components/patient-queue/patientQueue';

function App() {

  return (
    <div className="app">
      { window.frameElement.id === "identifier-popup" && <VerifyHealthId /> }
      { window.frameElement.id === "patient-queue-popup" && <PatientQueue /> }
    </div>
  );
}

export default App;
