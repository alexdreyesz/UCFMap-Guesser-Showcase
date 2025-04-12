import "./GameWindow.css"
import Map from "../map/map"

function GameWindow() { 
  return (
    <>
      <div className="game-window-container">
        <div>
          <div className="text-rounds-container">
            <p>Round 1</p>
            <p>&nbsp;&nbsp;|&nbsp;&nbsp;</p>
            <p>
              <strong>Round 2</strong>
            </p>
            <p>&nbsp;&nbsp;|&nbsp;&nbsp;</p>
            <p>Round 3</p>
          </div>

          <div className="game-window-box-images">
            <div className="box-button-square">
              <button className="box-button-button">+</button>
              <button className="box-button-button">-</button>
            </div>
          </div>
        </div>

        <div>
          <div className="text-ucfmap-container">
            <p className="text-map-container">UCF MAP</p>
          </div>

          <div className="game-window-box-map">
            <Map />
          </div>
        </div>
      </div>

      <button className="submit-button">SUBMIT</button>
    </>
  );  
}

export default GameWindow;