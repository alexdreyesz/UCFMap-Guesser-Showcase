import "./Home.css";
import UCFLogo from "../../assets/icons/ucf-logo.png"

function App() {
  return (
    <>
      <div className="container-ucf-logo">
        <img className="ucf-logo" src={UCFLogo} alt="UCF Logo"/>
        <p>UCF LOGO</p>
      </div>
    </>
  );
}

export default App;