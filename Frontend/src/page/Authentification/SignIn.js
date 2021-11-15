import "../../css/App.css";
import { useState } from "react";

import NavBar from "../../components/NavBar";
import InputComp from "../../components/Input";

import { useNavigate } from "react-router-dom";

import Axios from "axios";


function SignIn(props) {
  let setAuthStep = props.setAuthStep;

  let [isActiveEmail, setActiveEmail] = useState(false);
  let [emailValue, setEmailValue] = useState("");
  let [isActivePassword, setActivePassword] = useState(false);
  let [passwordValue, setPasswordValue] = useState("");

  let [resError, setResError] = useState();

  let navigate = useNavigate();

  const handleSignin = () => {
    Axios.post("http://localhost:5000/auth/login", {
      email: emailValue,
      password: passwordValue,
    }).then((res) => {
      setResError(res.data);
      if(res.data !== 2 && res.data !== 5) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate("/feed");
      }
    })
  }

  return (
    <>
      <NavBar />
      <div className="signin">
        <div className="bloc-form">
          <h2>Welcome back</h2>
          {resError === 2 && <p>* Invalid E-mail</p>}
          <InputComp
            value={emailValue}
            type="email"
            setValue={setEmailValue}
            setActiveValue={setActiveEmail}
            activeValue={isActiveEmail}
            placeHolder="E-mail"
          />
          {resError === 5 && <p>* Invalid password</p>}
          <InputComp
            value={passwordValue}
            type="password"
            setValue={setPasswordValue}
            setActiveValue={setActivePassword}
            activeValue={isActivePassword}
            placeHolder="Password"
          />
        </div>
        <div className="startButton" onClick={() => handleSignin()}>
        <p className="buttonText" >Singn In</p>  
        </div>
        <h3>Or</h3>
        <h3>
          Don't have account ?{" "}
          <span className="span-auth" onClick={() => setAuthStep(2)}>
            Sign Up
          </span>
        </h3>
      </div>
    </>
  );
}

export default SignIn;
