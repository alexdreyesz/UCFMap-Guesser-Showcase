import { Link } from "react-router-dom";
import Header from "../../components/header/Header";
import backB from "../../assets/icons/Back-Button.png";
import "./Signup.css";
import React, { useState } from "react";
/*
To-do
add link to login after user is created
get password check to be instant. (as the user types)
*/
let locks = [2, 2, 2, 2]; // [0]username error..
function Signup() {
  const [message, setMessage] = React.useState(""); // msg
  const [userName, setLoginName] = React.useState(""); //Login name
  const [userPassword, setPassword] = React.useState(""); //password
  const [userEmail, setEmail] = React.useState(""); // email
  const [userCheck, setCheck] = React.useState(""); //pasword check

  //Do sign in Function
  async function startSignIn(event: any): Promise<void> {
    event.preventDefault();
    setMessage("");
    const result = checkKey();
    if (result.check) {
      // if field check fails return and display an errm
      setMessage(result.fault);
      return;
    }
    //alert(`You got past me: ${locks[0]}`);
    //package json
    const jsPack = JSON.stringify({ email: userEmail, password: userPassword, username: userName });

    //try to send off the package
    try {
      //set response
      const response = await fetch("/api/register", {
        // Need to replace with api code
        method: "POST",
        body: jsPack,
        headers: { "Content-Type": "application/json" },
      });
      const reply = JSON.parse(await response.text()); // this should have the text
      if (reply.success) {
        setMessage(reply.message);
      } else {
        setMessage(reply.message);
      }
    } catch (error: any) {
      alert(error.toString());
      return;
    }
  }
  function handleSetLoginName(e: any): void {
    const val = e.target.value;
    console.log("enter handle:" + locks[0]);

    if (val != "") {
      locks[0] = 1;
      setLoginName(val);
    } else {
      locks[0] = 0;
    }
    console.log("Leaving handle:" + locks[0]);
  }
  function handleSetPassword(e: any): void {
    const val = e.target.value;
    const regex = /^(?=.*\d).{9,}$/;

    if (regex.test(val)) {
      setPassword(val);
      locks[1] = 1;
    } else locks[1] = 0;
  }
  function handleSetPasswordCheck(e: any): void {
    const val = e.target.value;
    if (userPassword == "") return;
    if (userPassword === val) {
      setCheck(e.target.value);
      locks[2] = 1;
    } else locks[2] = 0;
  }
  function handleSetEmail(e: any): void {
    const val = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(val)) {
      locks[3] = 1;
      setEmail(e.target.value);
    } else locks[3] = 0;
  }

  function checkKey(): { check: boolean; fault?: string } {
    let key = 0;
    for (const num of locks) {
      key += num;
    }
    if (key == 4) return { check: false };
    else {
      return {
        check: true,
        fault: "Make sure all fields are satisfied.",
      };
    }
  }
  return (
    <>
      <title>Join Us</title>
      <Header />
      <div className="signin-container">
        <div className="signin-box">
          <div className="signin-title">Join UCFMap Guessr</div>

          <label className="signin-text-label">
            <input
              type="text"
              className="signin-input"
              placeholder="Username"
              onChange={handleSetLoginName}
            />
            <div className="sigin-text-input">
              {locks[0] == 0 && <p className="fault-message">Username is empty</p>}
            </div>
          </label>

          <label className="signin-text-label">
            <input
              type="password"
              className="signin-input"
              placeholder="Password"
              onChange={handleSetPassword}
            />
            <div className="sigin-text-input">
              {locks[1] == 0 && (
                <p className="fault-message">Password does not meet the requirments</p>
              )}
            </div>
          </label>
          <label className="signin-text-label">
            <input
              type="password"
              className="signin-input"
              placeholder="Re-enter Password"
              onChange={handleSetPasswordCheck}
            />
            <div className="sigin-text-input">
              {locks[2] == 0 && <p className="fault-message">Passwords do not match</p>}
            </div>
          </label>
          <label className="signin-text-label">
            <input
              type="email"
              className="signin-input"
              placeholder="NewUser@example.com"
              onChange={handleSetEmail}
            />
            <div className="sigin-text-input">
              {locks[3] == 0 && <p className="fault-message">This is not a valid email</p>}
            </div>
          </label>

          <Link to="/create">
            <button className="signup-button" onClick={startSignIn}>
              Sign Up
            </button>
          </Link>

          <div className="error-message">{message}</div>
        </div>
      </div>
    </>
  );
}

export default Signup;
