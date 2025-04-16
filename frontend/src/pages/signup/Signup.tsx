import "./Signup.css";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import React from "react";

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
  const [isEmailValid, setIsEmailValid] = React.useState(true); // New state to track email validity
  const navigate = useNavigate();

  //Do Sign In Function
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

        // clear fields
        setLoginName("");
        setPassword("");
        setCheck("");
        setEmail("");
        locks = [2, 2, 2, 2];

        setMessage("Account created successfully");
        setTimeout(() => {
          setMessage("");
        }, 3000);
      } else {
        setMessage(reply.message);
        navigate("/");
      }
    } catch (error: any) {
      alert(error.toString());
      return;
    }
  }

  // Function To Handle Set Login Name
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

  // Function To Handle Set Password
  function handleSetPassword(e: any): void {
    const val = e.target.value;
    const regex = /^(?=.*\d).{9,}$/;

    if (regex.test(val)) {
      setPassword(val);
      locks[1] = 1;
    } else locks[1] = 0;
  }

  // Function to Handle Set Password Check
  function handleSetPasswordCheck(e: any): void {
    const val = e.target.value;
    if (userPassword == "") return;
    if (userPassword === val) {
      setCheck(e.target.value);
      locks[2] = 1;
    } else locks[2] = 0;
  }

  // Fucntion To Handle Set Email
  function handleSetEmail(e: any): void {
    const val = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmail(val);
    if (emailRegex.test(val)) {
      setIsEmailValid(true);
      locks[3] = 1;
    } else {
      setIsEmailValid(false);
      locks[3] = 0;
    }
  }

  // Function To Check Key
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
              value={userName}
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
              value={userPassword}
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
              value={userCheck}
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
              value={userEmail}
              onChange={handleSetEmail}
            />
            <div className="sigin-text-input">
              {!isEmailValid && <p className="fault-message">This is not a valid email</p>}
            </div>
          </label>

          <button className="signup-button" onClick={startSignIn}>
            Sign Up
          </button>

          <div className="error-message">{message}</div>
        </div>
      </div>
    </>
  );
}

export default Signup;
