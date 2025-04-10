import UCFLogo from "../../assets/icons/ucf-logo.png"
import lock from "../../assets/icons/padlock.png"
import "./Header.css"

function Header() { 
  return (
    <div className="container-header">
      <div className="container-header-left">
        <img className="ucf-logo" src={UCFLogo} alt="UCF Logo" />
        <p className="ucf-title">
          &nbsp;&nbsp;&nbsp;UCFMAP&nbsp;<p className="guessr-title"> Guessr</p>
        </p>
      </div>

      <div className="container-header-right">
        <p className="sign-in">
          <img className="lock-icon" src={lock} alt="lock" /> Guessr&nbsp;&nbsp;
          <a className="sign-hover" href="#">
            <strong>SIGN IN +</strong>
          </a>
        </p>

        <div className="header-divisor"></div>

        <p className="log-in">
          <a href="#">
            <strong>LOG IN -</strong>
          </a>
        </p>
        <button className="play-now-button">PLAY NOW</button>
      </div>
    </div>
  );
}

export default Header;