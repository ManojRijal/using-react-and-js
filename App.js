import React, { useState } from 'react';
import './App.css';
import pp from './pp.jpeg';

function Square({ value, onSquareClick, isWinner }) {
  return (
    <button className={`square ${isWinner ? 'winner' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const { winner, line } = calculateWinner(squares);

  function handleClick(i) {
    if (winner || squares[i]) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }

    onPlay(nextSquares);
  }

  function renderSquare(i, isWinner) {
    return (
      <Square
        key={i}
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        isWinner={isWinner}
      />
    );
  }

  function renderBoardRow(row) {
    return (
      <div key={row} className="board-row">
        {Array(3)
          .fill(null)
          .map((_, col) => {
            const index = row * 3 + col;
            const isWinner = winner && line.includes(index);
            return renderSquare(index, isWinner);
          })}
      </div>
    );
  }

  return (
    <>
      {Array(3)
        .fill(null)
        .map((_, row) => renderBoardRow(row))}
    </>
  );
}

function StudentInfo({ name, studentId, imageUrl }) {
  return (
    <div className="student-info">
      <div className="info-container">
      <img class = "photo" src={pp}></img>
        <div>
          <h2>{name}</h2>
          <p>Student ID: {studentId}</p>
        </div>
      </div>
    </div>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  const { winner } = calculateWinner(currentSquares);
  const currentPlayer = xIsNext ? 'Player 1' : 'Player 2';

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-info">
        <StudentInfo name="Manoj Rijal" studentId="22054845" imageUrl="url-to-student-image.jpg" />
        <div className="status">
          {winner ? 'Congratulations the Winner: ' + winner : `Current player: ${currentPlayer}`}
        </div>
      </div>
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <ol>{moves}</ol>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}
