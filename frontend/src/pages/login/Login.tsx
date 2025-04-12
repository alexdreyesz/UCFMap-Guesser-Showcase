import Header from "../../components/header/Header";
import "./Login.css";
import React, { useState } from "react";

function Login() {
  const [message, setMessage] = React.useState("");
  const [loginName, setLoginName] = React.useState("");
  const [loginPassword, setPassword] = React.useState("");

  /*
    To-do,
     add banner button functionality
     edit api calls
     add link to sign up
     possible edit top text

  */
  async function startLogin(event: any): Promise<void> {
    event.preventDefault();
    setMessage(" ");
    //check for any blank fields
    if (loginName == "" || loginPassword == "") {
      setMessage("Please make sure all fields are filled out");
      return;
    }
    //create the obj
    //to-do hash password
    let jsPack = JSON.stringify({ login: loginName, password: loginPassword }); //json package

    try {
      //set response
      const response = await fetch("http://localhost:80/api/login", {
        // Need to replace with api code
        method: "POST",
        body: jsPack,
        headers: { "Content-Type": "application/json" },
      });
      let reply = JSON.parse(await response.text()); // this should have the text
      if (reply.id <= 0) {
        // we may not have a user id, so maybe this needs to be a status check
        setMessage("Looks like your Username/Password is incorrect!");
      } //
      else {
        //create user cache/cookie
        //stores username as UserName and UserEmail
        let usr = { UserName: reply.username, UserEmail: reply.email };
        localStorage.setItem("user_data", JSON.stringify(usr));
        //returns home
        window.location.href = "/home";
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
      </div>
    </>
  );
}

export default Login;
