import Header from "../../components/header/Header";
import "./Login.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [message, setMessage] = React.useState("");
  const [loginName, setLoginName] = React.useState("");
  const [loginPassword, setPassword] = React.useState("");
  const navigate = useNavigate();
  /*
    To-do,
     add banner button functionality
     edit api calls
     add link to sign up
     possible edit top text

  */
  async function startLogin(event: any): Promise<void> {
    event.preventDefault();
    setMessage("");
    //check for any blank fields
    if (loginName == "" || loginPassword == "") {
      setMessage("Please make sure all fields are filled out");
      return;
    }
    //create the obj
    //to-do hash password
    const jsPack = JSON.stringify({ username: loginName, password: loginPassword }); //json package

    try {
      //set response
      const response = await fetch("/api/login", {
        // Need to replace with api code
        method: "POST",
        body: jsPack,
        headers: { "Content-Type": "application/json" },
      });
      const reply = JSON.parse(await response.text()); // this should have the text
      if (reply.success) {
        // we may not have a user id, so maybe this needs to be a status check
        setMessage("Looks like your username/password is incorrect!");
      } //
      else {
        //create user cache/cookie
        //stores username as UserName and UserEmail
        const usr = { loggedin: reply.loggedIn };
        localStorage.setItem("user_data", JSON.stringify(usr));
        //returns home
        navigate("/");
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
  return (
    // page code goes here
    <>
      <Header />
      <title>Log in</title>
      <div className="login-container">
        <div className="login-box">
          <div className="login-title">UCFMAP Guessr Login</div>
          <input
            type="text"
            className="login-input"
            placeholder="Username"
            onChange={handleSetLoginName}
          />
          <input
            type="password"
            className="login-input"
            placeholder="Password"
            onChange={handleSetPassword}
          />
          <button className="login-button" onClick={startLogin}>
            Login
          </button>
          <div className="error-message">{message}</div>
        </div>
        <div className="signup-link-text">
          <Link to="/signin"> Not a member? Join Now!</Link>
        </div>
      </div>
    </>
  );
}

export default Login;
