import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import "./Login.css";

function Login() {
  const [message, setMessage] = React.useState("");
  const [loginName, setLoginName] = React.useState("");
  const [loginPassword, setPassword] = React.useState("");
  const navigate = useNavigate();

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
      const data = await response.json(); // this should have the text
      if (data.loggedIn) {
        //create user cache/cookie
        //stores username as UserName and UserEmail
        localStorage.setItem("user_data", JSON.stringify(data));
        //returns home
        navigate("/");
      } //
      else {
        // we may not have a user id, so maybe this needs to be a status check
        setMessage("Looks like your username/password is incorrect!");
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
      </div>
    </>
  );
}

export default Login;
