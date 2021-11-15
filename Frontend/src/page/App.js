import "../css/App.css";
import logo from "../assets/icon.svg";
import NavBar from "../components/NavBar";

import { useNavigate } from "react-router-dom";

function App() {

  let navigate = useNavigate();

  return (
    <>
      <NavBar />
      <div className="App">
        <div className="logoDiv">
          <img className="logoAccount" src={logo} alt="Logo" />
        </div>
        <div>
          <h1>Groupomania</h1>
          <div className="startButton" onClick={() => navigate('/auth')}>
            <h2 className="buttonText">Get Started</h2>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
