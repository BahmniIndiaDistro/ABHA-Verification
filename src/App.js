import './App.css';
import React, {useEffect} from "react";
import VerifyHealthId from './components/verifyHealthId/verifyHealthId';
import './ndhm.scss';

function App() {

  useEffect(() => {
    window.addEventListener("message", function (parentWindow) {
		if (parentWindow.data.call === "parentData") {
			const hipUrl = parentWindow.data.value.hipUrl;
			const bahmniUrl = parentWindow.data.value.bahmniUrl;
			localStorage.setItem("hipServiceUrl", hipUrl);
			localStorage.setItem("bahmniUrl", bahmniUrl);
		}
    }, false);
  }, []);

  return (
    <div className="app">
      <VerifyHealthId />
    </div>
  );
}

export default App;
