import "./Home.css";
import Header from "../../components/header/Header"
import UCFMap from "../../assets/images/ucf-map.jpeg"
import knightro from "../../assets/gif/knightro.gif"

function Home() {
  return (
    <>
      <Header />
      <div className="home-background-container">
        <p className="text-title">UCFMAP Guessr</p>
        <img src={knightro} className="knightro-gif"/>
      </div>
    </>
  );
}

export default Home;