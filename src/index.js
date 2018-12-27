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
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  createBoard(rows, cols) {
    const board = [...Array(rows)].map((row, rowIndex) => {
      return (
        <div className="board-row" key={`row-${rowIndex}`}>
          {[...Array(cols)].map((col, colIndex) => this.renderSquare(3 * rowIndex + colIndex))}
        </div>
      )
    });

    return board;
  }

  render() {
    return (
      <div>{this.createBoard(this.props.rows, this.props.columns)}</div>
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
      moveOrder: 'down',
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history;
    const currentBoard = history[history.length - 1];
    const squares = currentBoard.squares.slice();
    const move = {
      column: (i % 3) + 1,
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
    });
  }

  toggleMoveOrder() {
    this.setState({
      moveOrder: this.state.moveOrder === 'up' ? 'down' : 'up',
    });
  }

  render() {
    const boardRows = 3;
    const boardColumns = 3;
    const history = this.state.history;
    const currentBoard = history[this.state.moveNumber];
    const winner = calculateWinner(currentBoard.squares);
    const status = winner ?
                   `Winner: ${winner}` :
                     !currentBoard.squares.includes(null) ?
                     'DRAW - No winner' :
                     `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;

    const moves = history.map((item, number) => {
      const description = number ? `Go to move #${number} (${item.move.column}, ${item.move.row})` : 'Go to game start';
      const activeClass = number === this.state.moveNumber ? ' current-move' : '';

      return (
        <li key={number}>
          <button className={`button${activeClass}`} onClick={() => this.jumpTo(number)}>{description}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            rows={boardRows}
            columns={boardColumns}
            squares={currentBoard.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="game-status">{status}</div>
          <button className="button" onClick={() => this.toggleMoveOrder()}>Sort moves</button>
          <ol>{this.state.moveOrder === 'up' ? moves.reverse() : moves}</ol>
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
