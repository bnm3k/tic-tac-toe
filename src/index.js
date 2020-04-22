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

function rowColFromIndex(i) {
    return {
        col: (i % 3) + 1,
        row: Math.floor(i / 3) + 1,
    };
}

function indexFromRowCol({ row, col }) {
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
                key={i}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        let rows = [];
        for (let row = 1; row <= 3; row++) {
            let squares = [];
            for (let col = 1; col <= 3; col++) {
                squares.push(this.renderSquare(indexFromRowCol({ row, col })));
            }
            rows.push(
                <div children={squares} key={row} className="board-row"></div>
            );
        }
        return <div children={rows} />;
    }
}

class MoveList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            desc: true,
        };
        this.handleClickReverseOrder = this.handleClickReverseOrder.bind(this);
    }

    handleClickReverseOrder() {
        this.setState({
            desc: !this.state.desc,
        });
    }

    render() {
        const { history, stepNumber, onClick } = this.props;
        const moves = history.map((step, moveNumber) => {
            const { col, row } = step.move;
            const mark = step.squares[indexFromRowCol(step.move)];
            const isSelected = moveNumber === stepNumber;
            const selectionDescription = isSelected ? "On" : "Go to";
            const description = moveNumber
                ? `${selectionDescription} move #${moveNumber}: (col ${col}, row ${row}):: ${mark}`
                : `${selectionDescription} game start`;

            return (
                <li key={moveNumber}>
                    <button
                        className={isSelected ? "button-selected" : ""}
                        onClick={() => onClick(moveNumber)}
                    >
                        {description}
                    </button>
                </li>
            );
        });

        return (
            <>
                <ol children={this.state.desc ? moves : moves.reverse()} />
                <button onClick={this.handleClickReverseOrder}>
                    reverse order {this.state.desc ? "desc" : "asc"}
                </button>
            </>
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
        const move = { ...rowColFromIndex(i), mark: squares[i] };
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
                    <MoveList
                        history={history}
                        stepNumber={stepNumber}
                        onClick={(stepNumber) => this.jumpTo(stepNumber)}
                    />
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
