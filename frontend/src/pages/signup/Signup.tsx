import "./Signup.css";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import { useEffect, useState } from "react";

/*
To-do
add link to login after user is created
get password check to be instant. (as the user types)
*/
function Signup() {
  const [message, setMessage] = useState(""); // msg
  const [signinData, setData] = useState({
    email: "",
    password: "",
    checkpass: "",
    username: "",
  });

  const [faults, setErrors] = useState({
    email: "",
    password: "",
    checkpass: "",
    username: "",
  });

  const [interacted, setTouched] = useState({
    email: false,
    password: false,
    checkpass: false,
    username: false,
  });
  const navigate = useNavigate();

  //Do Sign In Function
  async function startSignIn(event: any): Promise<void> {
    event.preventDefault();
    setMessage("");

    //Extract data

    //package json
    const jsPack = JSON.stringify({
      email: signinData.email,
      password: signinData.password,
      username: signinData.username,
    });

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
        setMessage("Account created successfully,\n You will be taken to the Log-in page shortly");
        setTimeout(() => {
          setMessage("");
          navigate("/login");
        }, 1000);
      } else {
        setMessage(reply.message);
      }
    } catch (error: any) {
      alert(error.toString());
      return;
    }
  }

  // Function To handle validity
  const validate = () => {
    const cleanErr = { email: "", password: "", username: "", checkpass: "" };
    // Email validation
    if (interacted.email) {
      const email_regex = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
      if (!email_regex.test(signinData.email)) {
        if (signinData.email == "") cleanErr.email = "";
        else cleanErr.email = "Invalid email address";
      }
    }

    // Password validation
    if (interacted.password) {
      const pass_regex = /^(?=.*\d).{8,}$/;
      if (!pass_regex.test(signinData.password)) {
        if (signinData.password == "") cleanErr.password = "";
        else
          cleanErr.password =
            "Password must be at least 8 characters and include 1 numerial character!";
      }
    }

    // Confirm password validation
    if (interacted.checkpass) {
      if (signinData.checkpass !== signinData.password) {
        if (signinData.checkpass == "") cleanErr.checkpass = "";
        else cleanErr.checkpass = "Passwords do not match";
      }
    }

    // Username validation
    if (interacted.username) {
      if (signinData.username.length < 3) {
        if (signinData.username == "") cleanErr.username = "";
        else cleanErr.username = "Username must be at least 3 characters";
      }
    }
    setErrors(cleanErr);
  };
  //use effect for validation
  useEffect(() => {
    validate();
  }, [signinData, interacted]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true })); // mark as touched on change
  };

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
              name="username"
              value={signinData.username}
              onChange={handleChange}
            />
            <div className="sigin-text-input">
              {faults.username && <p className="fault-message">{faults.username}</p>}
            </div>
          </label>

          <label className="signin-text-label">
            <input
              type="password"
              className="signin-input"
              name="password"
              placeholder="Password"
              value={signinData.password}
              onChange={handleChange}
            />

            <div className="sigin-text-input">
              {faults.password && <p className="fault-message">{faults.password}</p>}
            </div>
          </label>
          <label className="signin-text-label">
            <input
              type="password"
              className="signin-input"
              placeholder="Confirm Password"
              name="checkpass"
              value={signinData.checkpass}
              onChange={handleChange}
            />
            <div className="sigin-text-input">
              {faults.checkpass && <p className="fault-message">{faults.checkpass}</p>}
            </div>
          </label>
          <label className="signin-text-label">
            <input
              type="email"
              className="signin-input"
              placeholder="NewUser@example.com"
              name="email"
              value={signinData.email}
              onChange={handleChange}
            />
            <div className="sigin-text-input">
              {faults.email && <p className="fault-message">{faults.email}</p>}
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
