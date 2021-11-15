import "../../css/App.css";
import { useState } from "react";
import NavBar from "../../components/NavBar";
import InputComp from "../../components/Input";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

function SignIn(props) {
  // All state

  let setAuthStep = props.setAuthStep;

  let [isActiveUser, setActiveUser] = useState(false);
  let [UserValue, setUserValue] = useState("");

  let [isActiveEmail, setActiveEmail] = useState(false);
  let [emailValue, setEmailValue] = useState("");

  let [isActivePassword, setActivePassword] = useState(false);
  let [passwordValue, setPasswordValue] = useState("");

  let [isActiveConfirmPassword, setActiveConfirmPassword] = useState(false);
  let [confirmPasswordValue, setConfirmPasswordValue] = useState("");

  let [userError, setUserError] = useState(false);
  let [emailError, setEmailError] = useState(false);
  let [passwordError, setPasswordError] = useState(false);
  let [confirmPasswordError, setConfirmPasswordError] = useState(false);

  let [resError, setResError] = useState();

  let navigate = useNavigate();

  // all validator

  let regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const validation = (data, len, error) => {
    if (data.length <= len) {
      error(true);
      return false;
    } else {
      error(false);
      return true;
    }
  };

  const validationEmail = () => {
    if (emailValue.length <= 5 || !regex.test(emailValue)) {
      setEmailError(true);
      return false;
    } else {
      setEmailError(false);
      return true;
    }
  };

  const validationPassword = () => {
    if (passwordValue !== confirmPasswordValue) {
      setConfirmPasswordError(true);
      return false;
    } else {
      setConfirmPasswordError(false);
      return true;
    }
  };

  // Post signup

  const sendSignup = () => {
    Axios.post("http://localhost:5000/auth/signUp", {
      username: UserValue,
      email: emailValue,
      password: passwordValue,
      photo: undefined,
    }).then((res) => {
      setResError(res.data);
      if (res.data === 0) {
        Axios.post("http://localhost:5000/auth/login", {
      email: emailValue,
      password: passwordValue,
    }).then((res) => {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate("/feed");
    })
      }
    });
  };

  const handleSignup = () => {
    validation(UserValue, 3, setUserError);
    validation(passwordValue, 5, setPasswordError);
    validationEmail();
    validationPassword();
    if (
      validation(UserValue, 3, setUserError) &&
      validation(passwordValue, 5, setPasswordError) &&
      validationEmail() &&
      validationPassword()
    ) {
      sendSignup();
    }
  };

  return (
    <>
      <NavBar />
      <div className="signin">
        <div className="bloc-form">
          <h2>Welcome to Groupomania</h2>
          {userError && <p>* Invalid username 4 characters minimum</p>}
          {resError === 1 && <p>* Username already use</p>}
          <InputComp
            value={UserValue}
            type="text"
            setValue={setUserValue}
            setActiveValue={setActiveUser}
            activeValue={isActiveUser}
            placeHolder="Username"
          />
          {emailError && <p>* Invalid E-mail</p>}
          {resError === 2 && <p>* Email already use</p>}
          <InputComp
            value={emailValue}
            type="email"
            setValue={setEmailValue}
            setActiveValue={setActiveEmail}
            activeValue={isActiveEmail}
            placeHolder="E-mail"
          />
          {passwordError && <p>* Invalid password 6 characters minimum</p>}
          <InputComp
            value={passwordValue}
            type="password"
            setValue={setPasswordValue}
            setActiveValue={setActivePassword}
            activeValue={isActivePassword}
            placeHolder="Password"
          />
          {confirmPasswordError && <p>* Password did not match</p>}
          <InputComp
            value={confirmPasswordValue}
            type="password"
            setValue={setConfirmPasswordValue}
            setActiveValue={setActiveConfirmPassword}
            activeValue={isActiveConfirmPassword}
            placeHolder="Comfirm Password"
          />
        </div>
        <div className="startButton" onClick={() => handleSignup()}>
          <p className="buttonText">Singn Up</p>
        </div>
        <h3>Or</h3>
        <h3>
          Already have an account ? {""}
          <span className="span-auth" onClick={() => setAuthStep(1)}>
            Sign In
          </span>
        </h3>
      </div>
    </>
  );
}

export default SignIn;
