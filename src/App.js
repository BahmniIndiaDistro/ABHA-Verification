import './App.css';
import React from "react";
import VerifyHealthId from './components/verifyHealthId/verifyHealthId';
import './ndhm.scss';
import PatientQueue from './components/patient-queue/patientQueue';
import { useSearchParams } from 'react-router-dom'


function App() {
  const [searchParams] = useSearchParams();

  switch (searchParams.get('action')) {
    case "patientQueue":
      return (
          <PatientQueue />
      );
    default:
      return (
          <VerifyHealthId />
      );
  }

}

export default App;
