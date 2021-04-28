import './App.css';
import React, {useState} from "react";
import HealthIdVerification from './components/health-id-verification/healthIdVerification';

function App() {
  const [healthId, setHealthId] = useState('');

  function handleChange (e) {
    setHealthId(e.target.value);
  }

  function handleClick (e) {
    const patientInfo = {};
    patientInfo.healthId = healthId;
    window.parent.postMessage({message: "patient Information", value: patientInfo}, "*");
  }

  return (
    <HealthIdVerification />
  );
}

export default App;
