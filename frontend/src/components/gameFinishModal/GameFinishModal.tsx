import { useEffect, useState } from "react";
import knightro from "../../assets/gif/knightro.gif";
import "./GameFinishModal.css";

export type GameFinishModalProps = {
  score: number;
  isVisible: boolean;
  onClose: () => void;
  onPlayAgain: () => void;
};

export function GameFinishModal(props: GameFinishModalProps) {
  const { score, isVisible, onClose, onPlayAgain } = props;

  const [displayedScore, setDisplayedScore] = useState(0);

  useEffect(() => {
    if (isVisible) {
      let currentScore = 0;
      const interval = setInterval(() => {
        if (currentScore < score) {
          currentScore += Math.max(
            Math.min(10, score - currentScore),
            Math.floor((score - currentScore) / 50)
          );
          setDisplayedScore(currentScore);
        } else {
          clearInterval(interval);
        }
      }, 10);
      return () => clearInterval(interval);
    }
  }, [isVisible, score]);

  return (
    <div className={`game-finish-modal`} style={{ display: isVisible ? undefined : "none" }}>
      <div className="modal-content">
        <h2>Charge On!</h2>
        <p>Your Score: {displayedScore}</p>
        <img src={knightro} draggable={false} className="knightro-gif" />
        <button className="game-modal-button" onClick={onPlayAgain}>
          Play Again
        </button>
        <button className="game-modal-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
