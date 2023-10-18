import { useEffect, useState } from "react";
import "./styles.css";

const getRandomNumber = () => {
  return Math.floor(Math.random() * 6 + 1);
};

const SNAKE_MAP = {
  99: 36
};
const LADDER_MAP = {
  12: 74
};
export default function App() {
  const [appState, setAppState] = useState(
    Array.from(Array(10), (row, index) =>
      Array.from(Array(10), (col, index2) => index * 10 + index2 + 1)
    )
  );
  const [gameState, setGameState] = useState({ A: 0, B: 0 });
  const [activePlayer, setActivePlayer] = useState("A");
  const [diceDetails, setDiceDetails] = useState({
    value: 0,
    totalValue: 0
  });
  const [isSwitch, switchPlayer] = useState(false);

  const startMove = (position) => {
    let count = 0;
    const currPosition = gameState[activePlayer];
    var intervalId = setInterval(() => {
      setGameState((currState) => ({
        ...currState,
        [activePlayer]: currState[activePlayer] + 1
      }));
      count++;
      if (position <= currPosition + count) {
        switchPlayer(true);
        clearInterval(intervalId);
      }
    }, 800);
  };

  const moveGame = (diceV) => {
    var currPosition = gameState[activePlayer];
    if (currPosition + diceV <= 100) {
      currPosition += diceV;
    }
    if (SNAKE_MAP[currPosition]) {
      currPosition = SNAKE_MAP[currPosition];
    }
    if (LADDER_MAP[currPosition]) {
      currPosition = LADDER_MAP[currPosition];
    }
    startMove(currPosition);

    if (currPosition === 100) {
      alert(`Game Over! ${activePlayer} won!!`);
    }
  };

  const onRollDice = () => {
    const diceV = getRandomNumber();
    console.log("diceV", diceV);
    if (diceV === 6 && diceDetails.totalValue === 12) {
      setActivePlayer(activePlayer === "A" ? "B" : "A");
      setDiceDetails({ totalValue: 0, value: 0 });
    } else {
      setDiceDetails((diceD) => ({
        value: diceV,
        totalValue: diceD.totalValue + diceV
      }));
      if (diceV !== 6) {
        moveGame(diceDetails.totalValue + diceV);
      }
    }
  };

  useEffect(() => {
    if (isSwitch) {
      setActivePlayer(activePlayer === "A" ? "B" : "A");
      switchPlayer(false);
      setDiceDetails(() => ({ totalValue: 0, value: 0 }));
    }
  }, [isSwitch]);

  return (
    <div className="App">
      <div className="board">
        <div className="images" />
        <div className="images-2" />
        {appState.map((rowData, index) => {
          const rowClass = index % 2 === 0 ? "row-1" : "row-2";
          return (
            <div key={`row-${index}`} className={rowClass}>
              {rowData.map((col, index2) => {
                const isActivePlayer =
                  col === gameState["A"]
                    ? "A"
                    : col === gameState["B"]
                    ? "B"
                    : "";
                return (
                  <div
                    key={`col-${index}-${index2}`}
                    className={`col ${
                      isActivePlayer ? `${isActivePlayer} isActive` : ""
                    }`}
                  >
                    {isActivePlayer || col}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="dice-box">
        <div className="active-player">{`${activePlayer}'s Turn`}</div>
        <button
          disabled={isSwitch}
          className={`btn-roll-dice ${isSwitch ? "disabled" : ""}`}
          onClick={(evt) => onRollDice(evt)}
        >
          {diceDetails.value || "Roll Dice"}
        </button>
      </div>
    </div>
  );
}
