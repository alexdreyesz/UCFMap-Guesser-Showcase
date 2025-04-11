import "./GameWindow.css"

function GameWindow() { 
  return (
    <>
      <div className="game-window-container">
        
        <div>
          <div className="text-rounds-container">
            <p>Round 1</p>
            <p>&nbsp;&nbsp;|&nbsp;&nbsp;</p>
            <p>Round 2</p>
            <p>&nbsp;&nbsp;|&nbsp;&nbsp;</p>
            <p>Round 3</p>
          </div>

          <div className="game-window-box"></div>
        </div>

        <div>
          <div className="text-ucfmap-container">
            <p className="">UCF MAP</p>
          </div>

          <div className="game-window-box"></div>
        </div>
      </div>

      <button className="submit-button">SUBMIT</button>
    </>
  );  
}

export default GameWindow;