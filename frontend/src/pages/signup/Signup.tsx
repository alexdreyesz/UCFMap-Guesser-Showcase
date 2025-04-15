import Header from "../../components/header/Header";
import "./Signup.css";
import React, { useState } from "react";
/*
To-do
add link to login after user is created
get password check to be instant. (as the user types)
*/
function Signup() {
  const [message, setMessage] = React.useState("");
  const [userName, setLoginName] = React.useState("");
  const [userPassword, setPassword] = React.useState("");
  const [userEmail, setEmail] = React.useState("");
  const [userCheck, setCheck] = React.useState("");

  //Do sign in Function
  async function startSignIn(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    //get values fields [0] login name, [1] password, [2] email, [3] password check
    setMessage("");
    const fields: string[] = [userName, userPassword, userEmail, userCheck];
    const result = field_Check(fields);
    if (result.check) {
      // if field check fails return and display an errm
      setMessage(result.fault);
      return;
    }
    //package json
     const jsPack = JSON.stringify({
      username: fields[0],
      password: fields[1],
      email: fields[2],
    });

    //try to send off the package
    try {
      //set response
      const response = await fetch("http://ucfmap.evanpartidas.com/api/register", {
        // Need to replace with api code
        method: "POST",
        body: jsPack,
        headers: { "Content-Type": "application/json" },
      });
      const reply = await response.json();
    if (!response.ok) {
      setMessage(reply.message || "It's possible this user already exists.");
    } else  {
      setMessage("User successfully added. Please login.");
    }
    } catch (error: any) {
      alert(error.toString());
      return;
    }
  }
  function handleSetLoginName(e: any): void {
    setLoginName(e.target.value);
  }
  function handleSetPassword(e: any): void {
    setPassword(e.target.value);
  }
  function handleSetPasswordCheck(e: any): void {
    setCheck(e.target.value);
  }
  function handleSetEmail(e: any): void {
    setEmail(e.target.value);
  }
  return (
    <>
      <Header />
      <div className="signin-container">
        <div className="signin-box">
          <div className="signin-title">Join UCFMap Guessr</div>
          <input
            type="text"
            className="signin-input"
            placeholder="Username"
            onChange={handleSetLoginName}
            value={userName}
          />
          <input
            type="password"
            className="signin-input"
            placeholder="Password"
            onChange={handleSetPassword}
            value={userPassword}
          />
          <input
            type="password"
            className="signin-input"
            placeholder="Re-enter Password"
            onChange={handleSetPasswordCheck}
            value={userCheck}
          />
          <input
            type="email"
            className="signin-input"
            placeholder="NewUser@example.com"
            onChange={handleSetEmail}
            value={userEmail}
          />
          <button className="signup-button" onClick={startSignIn}>
            Sign Up
          </button>
          <div className="error-message">{message}</div>
        </div>
      </div>
    </>
  );
}

function field_Check(arry: string[]): { check: boolean; fault?: string } {
  // checks fields to ensure they are filled out properly
  //takes in a array that holds each field for sign up
  //e.g name, password[hashed], email
  //first check for empty fields
  for (let item of arry) {
    if (item === "") {
      return {
        check: true,
        fault: "Please make sure to fill out all fields",
      };
    }
  }

  //password check
  if (arry[1] !== arry[3]) {
    return {
      check: true,
      fault: "Passwords do not match",
    };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //email check
  if (!emailRegex.test(arry[2])) {
    return {
      check: true,
      fault: "This is not a vaild email",
    };
  }
  return { check: false };
}
export default Signup;
