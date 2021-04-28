import './App.css';
import React, {useState} from "react";
import HealthIdVerification from './components/health-id-verification/healthIdVerification';

function App() {
  const [healthId, setHealthId] = useState('');

  return (
    <HealthIdVerification />
  );
}

export default App;
