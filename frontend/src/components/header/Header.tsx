import { Link, useLocation, useNavigate } from "react-router-dom";
import UCFLogo from "../../assets/icons/ucf-logo.png";
import lock from "../../assets/icons/padlock.png";
import { useEffect, useState } from "react";
import "./Header.css";

function Header() {
  interface usr {
    loggedIn: boolean;
    user: {
      userID: string;
      email: string;
      username: string;
    };
  }
  const navi = useNavigate();
  const location = useLocation();
  const [userStatus, setUserStatus] = useState(false);
  const [userData, setUser] = useState(Object);

  useEffect(() => {
    // grab from api, see if the user is logged in, If they are switch the bar
    UserStatusCheck();
  }, [location]);

  //call api function
  async function UserStatusCheck() {
    try {
      const reply = await fetch("/api/check-login");
      if (!reply.ok) {
        throw new Error("Failed to check login");
      }
      const pack: usr = await reply.json();
      if (pack.loggedIn == false) {
        setUserStatus(false);
        console.log("The user is logged out");
        return;
      }

      setUserStatus(pack.loggedIn);
      setUser(pack.user);
      console.log("The user is logged in");
    } catch (error: any) {
      console.log(error.message || "Something happned");
    }
  }

  async function doLogout() {
    //log the user out
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      const result = await response.json();
      if (result.success) {
        console.log("Logged out successfully");
        // Optionally update local state here
        setUserStatus(false);
        setUser(null);
        navi("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error: any) {
      console.log(error.message || "Could not log out");
    }
  }
  if (!userStatus) {
    return (
      <div className="container-header">
        <div className="container-header-left">
          <img className="ucf-logo" draggable={false} src={UCFLogo} alt="UCF Logo" />
          <Link to="/">
            <div className="ucf-title">
              &nbsp;&nbsp;&nbsp;UCFMAP&nbsp;<p className="guessr-title"> Guessr</p>
            </div>
          </Link>
        </div>

        <div className="container-header-right">
          <p className="sign-in">
            <img className="lock-icon" src={lock} alt="lock" /> Guest &nbsp;&nbsp;
            <Link to="/signup" className="sign-hover">
              <strong>SIGN UP +</strong>
            </Link>
          </p>

          <div className="header-divisor"></div>

          <p className="log-in">
            <Link to="/login">
              <strong>LOG IN -</strong>
            </Link>
          </p>
          <Link to="/game">
            <button className="play-now-button">PLAY NOW</button>
          </Link>
        </div>
      </div>
    );
  } else {
    // logged in user
    return (
      <div className="container-header">
        <div className="container-header-left">
          <img className="ucf-logo" draggable={false} src={UCFLogo} alt="UCF Logo" />
          <Link to="/">
            <div className="ucf-title">
              &nbsp;&nbsp;&nbsp;UCFMAP&nbsp;<p className="guessr-title"> Guessr</p>
            </div>
          </Link>
        </div>

        <div className="container-header-right">
          <p className="sign-in">{userData.username}&nbsp;&nbsp;</p>
          <div className="header-divisor"></div>
          <p className="log-in" onClick={doLogout}>
            <strong>Log Out</strong>
          </p>
          <div className="header-divisor"></div>
          <Link to="/create">
            <button className="play-now-button">Create a Guess</button>
          </Link>
          <Link to="/game">
            <button className="play-now-button">PLAY NOW</button>
          </Link>
        </div>
      </div>
    );
  }
}

export default Header;
