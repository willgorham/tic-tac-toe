import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const winner = props.winningSquare ? ' winning-square' : '';

  return (
    <button className={`square${winner}`} onClick={props.onClick} >
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
        winningSquare={this.props.winningSquares.includes(i)}
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
      currentMove: 0,
      displayDescending: true,
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
    if (calculateWinner(squares).winner || squares[i]) {
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
      currentMove: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(moveNumber) {
    this.setState({
      history: this.state.history.slice(0, moveNumber + 1),
      currentMove: moveNumber,
      xIsNext: moveNumber % 2 === 0,
    });
  }

  toggleMoveOrder() {
    this.setState({
      displayDescending: !this.state.displayDescending,
    });
  }

  render() {
    const board = {
      rows: 3,
      columns: 3,
    }
    const history = this.state.history;
    const currentBoard = history[this.state.currentMove];
    const result = calculateWinner(currentBoard.squares);
    const status = result.winner ?
                   `Winner: ${result.winner}` :
                     !currentBoard.squares.includes(null) ?
                     'DRAW - No winner' :
                     `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;

    const moves = history.map((item, moveNumber) => {
      const description = moveNumber ? `Go to move #${moveNumber} (${item.move.column}, ${item.move.row})` : 'Go to game start';
      const activeClass = moveNumber === this.state.currentMove ? ' current-move' : '';

      return (
        <li key={moveNumber}>
          <button className={`button${activeClass}`} onClick={() => this.jumpTo(moveNumber)}>{description}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            rows={board.rows}
            columns={board.columns}
            squares={currentBoard.squares}
            winningSquares={result.line}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="game-status">{status}</div>
          <button className="button" onClick={() => this.toggleMoveOrder()}>Sort moves</button>
          <ol>{this.state.displayDescending ? moves : moves.reverse()}</ol>
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

  const result = {
    winner: null,
    line: [],
  }

  for (const [a, b, c] of lines) {
    if ( squares[a] && squares[a] === squares[b] && squares[a] === squares[c] ) {
      result.winner = squares[a];
      result.line = [a, b, c];
      return result;
    }
  }

  return result;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
