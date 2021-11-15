import "../../css/App.css";
import { useState } from "react";

import SignIn from "./SignIn";
import SignUp from "./SignUp";

function Auth() {
  let [authStep, setAuthStep] = useState(2);
  
  return (
    <>
      {authStep === 1 && (
        <SignIn setAuthStep={setAuthStep}/>
      )}
      {authStep === 2 && (
        <SignUp setAuthStep={setAuthStep}/>
      )}
    </>
  );
}

export default Auth;
