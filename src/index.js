import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick} >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        move: {
          col: null,
          row: null,
        },
      }],
      moveNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history;
    const currentBoard = history[history.length - 1];
    const squares = currentBoard.squares.slice();
    const move = {
      col: (i % 3) + 1,
      row: i <= 2 ? 1 : (i <= 5 ? 2 : 3),
    }
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: [
        ...history,
        {
          squares,
          move,
        }
      ],
      moveNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(moveNumber) {
    this.setState({
      history: this.state.history.slice(0, moveNumber + 1),
      moveNumber: moveNumber,
      xIsNext: moveNumber % 2 === 0,
    })
  }

  render() {
    const history = this.state.history;
    const currentBoard = history[this.state.moveNumber];
    const winner = calculateWinner(currentBoard.squares);
    const status = winner ? `Winner: ${winner}` : `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;

    const moves = history.map((item, number) => {
      const description = number ? `Go to move #${number} (${item.move.col}, ${item.move.row})` : 'Go to game start';

      return (
        <li key={number}>
          <button onClick={() => this.jumpTo(number)}>{description}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={currentBoard.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
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

  for (const [a, b, c] of lines) {
    if ( squares[a] && squares[a] === squares[b] && squares[a] === squares[c] ) {
      return squares[a];
    }
  }

  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
