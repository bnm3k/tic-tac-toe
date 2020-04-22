import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

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
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return squares[a];
        }
    }
    return null;
}

function moveFromIndex(i) {
    return {
        col: (i % 3) + 1,
        row: Math.floor(i / 3) + 1,
    };
}

function indexFromMove({ row, col }) {
    return (row - 1) * 3 + (col - 1);
}

function Square(props) {
    return (
        <button className="square" onClick={() => props.onClick()}>
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
            history: [{ squares: Array(9).fill(null), move: {} }],
            xIsNext: true,
            stepNumber: 0,
            winner: null,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const squares = history[history.length - 1].squares.slice();
        const { winner, xIsNext } = this.state;
        if (squares[i] || winner) return;
        squares[i] = xIsNext ? "X" : "O";
        const move = { ...moveFromIndex(i), mark: squares[i] };
        this.setState({
            history: [...history, { squares, move }],
            xIsNext: !xIsNext,
            winner: calculateWinner(squares),
            stepNumber: history.length,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0,
        });
    }

    render() {
        const { winner, xIsNext, history, stepNumber } = this.state;
        const current = history[stepNumber];
        const status = winner
            ? `Winner: ${winner}`
            : `Next player: ${xIsNext ? "X" : "O"}`;

        const moves = history.map((step, moveNumber) => {
            const { col, row } = step.move;
            const mark = step.squares[indexFromMove(step.move)];
            const description = moveNumber
                ? `Go to move #${moveNumber}: (col ${col}, row ${row}):: ${mark}`
                : "Go to game start";
            const isSelected =
                moveNumber === stepNumber ? "button-selected" : "";
            return (
                <li key={moveNumber}>
                    <button
                        className={isSelected}
                        onClick={() => this.jumpTo(moveNumber)}
                    >
                        {description}
                    </button>
                </li>
            );
        });
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winner={this.state.winner}
                        xIsNext={this.state.xIsNext}
                    />
                </div>
                <div className="game-info">
                    <div className="status">{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
