import React from "react";
import "../styles/App.css";
import { useEffect, useState } from "react";

const generateBoards = (boardCount) => {
  const boards = [];
  for (let i = 0; i < boardCount; i++) {
    let board = [];
    let tempNums = [
      Array.from({ length: 15 }, (_, k) => k + 1).sort(
        () => Math.random() - 0.5
      ),
      Array.from({ length: 15 }, (_, k) => 15 + k + 1).sort(
        () => Math.random() - 0.5
      ),
      Array.from({ length: 15 }, (_, k) => 30 + k + 1).sort(
        () => Math.random() - 0.5
      ),
      Array.from({ length: 15 }, (_, k) => 45 + k + 1).sort(
        () => Math.random() - 0.5
      ),
      Array.from({ length: 15 }, (_, k) => 60 + k + 1).sort(
        () => Math.random() - 0.5
      ),
    ];
    for (let j = 0; j < 5; j++) {
      board.push([
        tempNums[0][j],
        tempNums[1][j],
        tempNums[2][j],
        tempNums[3][j],
        tempNums[4][j],
      ]);
    }
    boards.push(board);
  }
  return boards;
};

const initTicks = (boards, nums) => {
  let ticks = new Array(boards.length).fill(0);
  for (let i = 0; i < boards.length; i++) {
    let flag = false;
    for (let j = 0; j < 5; j++) {
      if (boards[i][j].includes(nums[0])) {
        flag = true;
      }
    }
    if (!flag) {
      ticks[i] = 1;
    }
  }
  return ticks;
};

const BingoBoard = ({ board, index, currNum, tick, gameWon, setGameWon }) => {
  const [tickBox, setTickBox] = useState([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
  const checkWin = () => {
    for (let i = 0; i < 5; i++) {
      let flag = true;
      for (let j = 0; j < 5; j++) {
        if (tickBox[i][j] !== 1) {
          flag = false;
        }
      }
      if (flag) {
        return true;
      }
    }
    for (let i = 0; i < 5; i++) {
      let flag = true;
      for (let j = 0; j < 5; j++) {
        if (tickBox[j][i] !== 1) {
          flag = false;
        }
      }
      if (flag) {
        return true;
      }
    }
    let flag = true;
    for (let j = 0; j < 5; j++) {
      if (tickBox[j][j] !== 1) {
        flag = false;
      }
    }
    if (flag) return true;
    flag = true;
    for (let j = 0; j < 5; j++) {
      if (tickBox[j][4 - j] !== 1) {
        flag = false;
      } else {
        if (index == 0) {
          console.log(board[j][4 - j], index, flag);
        }
      }
    }
    if (flag) {
      return true;
    }
    return false;
  };
  const handleClick = (i, j) => {
    if (board[i][j] === currNum && !(!(board[i][j] === currNum) || gameWon !== null)) {
      setTickBox(
        tickBox.map((valX, x) => {
          return valX.map((valY, y) => {
            if (x === i) {
              if (y === j) {
                valY = 1;
                tick(index);
              }
            }
            return valY;
          });
        })
      );
    }
  };

  useEffect(() => {
    setTickBox([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
  }, [board]);

  useEffect(() => {
    let didWin = checkWin();
    if (didWin) {
      setGameWon(index);
    }
  });

  return (
    <div className="board-container">
      <h2 className="title">Player {index + 1}</h2>
      <table className="board-grid" id={`board-` + (index + 1)}>
        <thead>
          <tr className="board-row header">
            <th className="board-cell cell-disabled">B</th>
            <th className="board-cell cell-disabled">I</th>
            <th className="board-cell cell-disabled">N</th>
            <th className="board-cell cell-disabled">G</th>
            <th className="board-cell cell-disabled">O</th>
          </tr>
        </thead>
        <tbody className="board-grid">
          {board.map((row, i) => {
            return (
              <tr className="board-row " key={`row ${i}`}>
                {row.map((cell, j) => {
                  return (
                    <td
                      className={`board-cell ${
                        tickBox[i][j] ? "cell-marked" : ""
                      } ${board[i][j] === currNum ? "cell-active" : ""} ${
                        !(board[i][j] === currNum) || gameWon !== null
                          ? "cell-disabled"
                          : ""
                      }`}
                      key={j + i * row.length}
                      onClick={() => handleClick(i, j)}
                    >
                      {tickBox[i][j] ? <del>{cell}</del> : cell}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const BingoGame = ({ boards, nums, playerCount }) => {
  const [currNum, setCurrNum] = useState(0);
  const [ticked, setTicked] = useState([]);
  const [gameWon, setGameWon] = useState(null);

  useEffect(() => {
    setCurrNum(0);
    setGameWon(null);
    setTicked(() => initTicks(boards, nums));
  }, [boards]);

  const fixTicks = () => {
    let ticks = new Array(boards.length).fill(0);
    for (let i = 0; i < boards.length; i++) {
      let flag = false;
      for (let j = 0; j < 5; j++) {
        if (boards[i][j].includes(nums[currNum + 1])) {
          flag = true;
        }
      }
      if (!flag) {
        ticks[i] = 1;
      }
    }
    setTicked(ticks);
  };

  const tick = (boardIndex) => {
    setTicked(
      ticked.map((el, index) => {
        if (index === boardIndex) {
          el = 1;
        }
        return el;
      })
    );
  };
  useEffect(() => {
    let flag = true;
    for (let i = 0; i < ticked.length; i++) {
      if (ticked[i] !== 1) {
        flag = false;
      }
    }
    if (flag) {
      setCurrNum(currNum + 1);
      fixTicks();
    }
  }, [ticked]);

  console.log(
    "Ticks: " + JSON.stringify(ticked) + "| Current Number: " + nums[currNum]
  );
  return (
    <>
      <div className="game-stats">
        <div className="current-number">Current Number:</div>
        <div className="current-number" id="current-num">
          {nums[currNum]}
        </div>
        <div className="game-winner">
          {gameWon == null ? "" : `Player ${gameWon + 1} won the game.`}
        </div>
      </div>
      <div className="game-container">
        {boards.map((board, index) => (
          <BingoBoard
            board={board}
            index={index}
            key={index}
            tick={tick}
            currNum={nums[currNum]}
            gameWon={gameWon}
            setGameWon={setGameWon}
          />
        ))}
      </div>
    </>
  );
};

const App = () => {
  const [playerCount, setPlayerCount] = useState(2);
  const [boards, setBoards] = useState([]);
  const [nums, setNums] = useState(Array.from({ length: 75 }, (_, k) => k + 1));
  const startGame = (e) => {
    e.preventDefault();
    let players = e.target.elements.players.value;
    setPlayerCount(players);
    setNums([...nums].sort(() => 0.5 - Math.random()));
    setBoards(generateBoards(players));
  };

  useEffect(() => {}, [playerCount]);

  return (
    <div id="main">
      <h1 className="head">BINGO GAME</h1>
      <form className="game-options" onSubmit={startGame}>
        <label htmlFor="players">Select Number of Players: </label>
        <div className="input-group">
          <input
            id="playersInput"
            name="players"
            type="number"
            defaultValue={2}
          />
          <button id="playersSubmit" type="submit">
            Play
          </button>
        </div>
      </form>
      {boards.length !== 0 ? (
        <BingoGame boards={boards} nums={nums} playerCount={playerCount} />
      ) : null}
    </div>
  );
};

export default App;
