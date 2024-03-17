"use client"

import { useId, useState } from "react"
import BoardSquare from "./BoardSquare"

interface BoardProps {
    width: number
    height: number
    wincond: number
}

const Board = (props: BoardProps): JSX.Element => {
    const width: number = props.width;
    const height: number = props.height;
    const dimmax: number = Math.max(width, height);
    const dimmin: number = Math.min(width, height);
    const dimdif: number = Math.abs(width - height);
    const tall: boolean = (height > width);
    const wincond: number = props.wincond;
    const cx_max: number = width - wincond;
    const cy_max: number = height - wincond;
    const squarecount: number = props.width * props.height;

    // console.log("Board initiated - - - -");
    // console.log("width: %d | height: %d | wincond: %d | squarecount: %d", width, height, wincond, squarecount);
    // console.log("cur_max: %d | cy_max: %d", cur_max, cy_max);

    console.log(" - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ");

    const [turn, setTurn] = useState<number>(1); // which player's turn is it right now
    const [winner, setWinner] = useState<number>(0); // winner of the game | -1 = stalemate | 0 = game in progress | 1 = X | 2 = O
    const [squares, setSquares] = useState<Array<number>>(Array<number>(squarecount).fill(0)); // stores the owner of each square
    const [squares2, setSquares2] = useState<Array<number>>(Array<number>(squarecount).fill(0)); // stores the special state of each square, used for coloring after winning or marking locked squares

    const getSquareAtPos = (x: number, y: number): number => {
        if (x > width || y > height || x < 0 || y < 0) {
            console.log("getSquareAtPos: out of bounds! x: %d y: %d", x, y);
            return -1;
        } else {
            return width * y + x;
        }
    }

    const checkWins = (squares: Array<number>): number => {

        // these are control variables that are going to be reset to default before each stage of the check
        let streak: number = 0; // this is where current streak status will be stored
        let cur: number = 0; // 'cursor' variable used to indicate position in a row during horizontal check and current square index in vertical and both diagonal checks
        let last: number = 0; // the owner of the previous square, used to check for streaks
        let dstart: number = 0; // used by diagonal checks only - first valid index for current line
        let dend: number = 0; // used by diagonal checks only - last valid index for current line
        let streaksquares: Array<number> = [];

        // helper function to reset all control variables
        const resetTempVars = (): void => {
            streak = 0; cur = 0; last = 0; dstart = 0; dend = 0;
        }

        // helper function to end the game and mark the winning streak
        const endGame = (winner: number): void => {
            setWinner(winner);
            if (winner == -1) { // stalemate, don't paint any squares
                return;
            } else {
                let temparr: Array<number> = Array<number>(squarecount).fill(0);
                streaksquares.forEach((e, i) => {
                    temparr[e] = winner;
                });
                console.log(streaksquares);
                console.log(temparr);
                setSquares2(temparr);
            }
        }

        // helper function to count streaks inside loops | now = owner of currently checked square | returns the winner's ID or 0 if the game isn't over yet
        const checkStreak = (now: number, now_id: number): number => {
            if (now == 0) {
                streak = 0;
                streaksquares = [];
            }
            else {
                if (last == now) {
                    streak++;
                    streaksquares.push(now_id);
                    if (streak >= wincond) {
                        endGame(now);
                        return now;
                    }
                } else {
                    streak = 1;
                    streaksquares = [now_id];
                }
            }
            last = now;
            return 0;
        }

        console.log(" - - - WIN CHECK - - - ")
        // horizontal checking
        let lasth = 0; let curh = 0; let streakh = 0;
        for (let h = 0; h < squarecount; h++) {
            if (checkStreak(squares[h], h) !== 0) {
                console.log("H-Win: %d @ %d", squares[h], h);
                return squares[h];
            }
            // reset streak status and counter at the end of a row
            cur++;
            if (cur >= width) resetTempVars();
        }

        // vertical checking
        for (let h = 0; h < width; h++) {
            resetTempVars();
            for (let v = 0; v < height; v++) {
                cur = h + width * v;
                if (checkStreak(squares[cur], cur) !== 0) {
                    setWinner(squares[cur]);
                    console.log("V-Win: %d @ %d", squares[cur], cur);
                    return squares[cur];
                }
            }
        }

        // diagonal checking
        for (let c = -height; c < width; c++) {
            resetTempVars();
            // console.log("--column: %d--", c);

            if (c < 0) dstart = c * -1;
            else dstart = 0;

            dend = height;
            if (tall) {
                if (c >= -dimdif) dend = width - c;
            } else {
                if (c > dimdif) dend = width - c;
            }

            if (dend - dstart < wincond) continue;

            for (let r = dstart; r < dend; r++) {
                cur = (r * width) + c + r;
                if (checkStreak(squares[cur], cur) !== 0) {
                    setWinner(squares[cur]);
                    console.log("D-Win: %d @ %d", squares[cur], cur);
                    return squares[cur];
                }
                // console.log("c: %d | r: %d | cur: %d | streak: %d", c, r, cur, streak);
            }

        }

        // mirrored diagonal checking
        for (let r = (dimmax - 1) * 2; r >= 0; r--) {
            resetTempVars();

            dend = r; // dstart should already be at 0 after resetTempVars();
            if (dimdif == 0) { // square boards
                if (r >= width) {
                    dstart = r - width + 1;
                    dend = r - dstart;
                }
            } else if (tall) { // tall boards
                if (r >= width) {
                    dend = width - 1;
                    if (r >= height) dstart = r - height + 1;
                }
            } else { // wide boards
                if (r >= height) {
                    dstart = r - height + 1;
                    if (r >= width) dend = r + (width - r) - 1;
                }
            }

            if (dend - dstart < wincond - 1) continue;

            // console.log("--row: %d-- (dstart: %d | dend: %d | diff: %d)", r, dstart, dend, dend-dstart);
            for (let c = dstart; c <= dend; c++) {
                cur = (r * width) - c * width + c;
                if (checkStreak(squares[cur], cur) !== 0) {
                    setWinner(squares[cur]);
                    console.log("B-Win: %d @ %d", squares[cur], cur);
                    return squares[cur];
                }
                // console.log("c: %d | r: %d | cur: %d | streak: %d", c, r, cur, streak);
            }
        }


        return 0;
    }

    const updateBoard = (nextSquares: Array<number>): void => {
        setSquares(nextSquares);
        checkWins(nextSquares);
        const w = props.width;
        const h = props.height;
        const x_max = props.width - props.wincond;
        const y_max = props.height - props.wincond;
    }

    const drawStatus = (): JSX.Element => {
        let text = "";
        if (winner === 0) {
            text = turn === 1 ? "X's turn" : "O's turn";
        } else if (winner == 1) {
            text = "X wins";
        } else if (winner == 2) {
            text = "O wins";
        } else {
            text = "Tie";
        }
        return <div>{text}</div>
    }

    const onSquareClick = (index: number): void => {
        if (squares[index] !== 0) return;
        if (winner !== 0) return;

        let nextSquares = squares.slice()
        nextSquares[index] = turn;
        setTurn(turn === 1 ? 2 : 1);

        updateBoard(nextSquares);
    }


    return <div className="ttt-panel">
        <p className="ttt-info">{width}x{height}({wincond})</p>
        {drawStatus()}

        <br />
        <div className="ttt-board">
            {
                squares.map((square, index) => {
                    return <span key={index}>
                        <BoardSquare
                            key={index+1000}
                            index={index}
                            owner={square}
                            status={squares2[index]}
                            clickHandler={() => onSquareClick(index)}
                        />

                        {/* new line when needed */}
                        {((index + 1) % props.width === 0) ? (<br />) : (null)}
                    </span>
                })
            }
        </div>
    </div>
}

export default Board