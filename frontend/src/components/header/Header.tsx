import { Link } from "react-router-dom";
import UCFLogo from "../../assets/icons/ucf-logo.png";
import lock from "../../assets/icons/padlock.png";
import "./Header.css";

function Header() {
  return (
    <div className="container-header">
      <div className="container-header-left">
        <img className="ucf-logo" draggable={false} src={UCFLogo} alt="UCF Logo" />
        <Link to="/create">
          <div className="ucf-title">
            &nbsp;&nbsp;&nbsp;UCFMAP&nbsp;<p className="guessr-title"> Guessr</p>
          </div>
        </Link>
      </div>

      <div className="container-header-right">
        <p className="sign-in">
          <img className="lock-icon" src={lock} alt="lock" /> Guessr&nbsp;&nbsp;
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
}

export default Header;
