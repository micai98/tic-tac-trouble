"use client"

import { MouseEventHandler } from "react"

const ownerclasses: Array<string> = [
    "",
    "win-blue",
    "win-red",
]

interface BoardSquareProps {
    index: number
    owner?: number
    status: number
    clickHandler: MouseEventHandler
}

const BoardSquare = (props: BoardSquareProps): JSX.Element => {
    let ownertext;
    //if(props.owner === 1) ownertext = "❌"
    //else if (props.owner === 2) ownertext = "⭕"
    // else ownertext = "\u00A0"
    //else ownertext = ""

    return <button className={"ttt-board-square " + (props.status > 0 ? ownerclasses[props.status] : "")} onClick={props.clickHandler}>
        <>
            {props.owner === 0 ? null : null}
            {props.owner === 1 ? 
                <svg viewBox="0 0 24 24"fill="none">
                    <path d="M19 5L5 19M5.00001 5L19 19" stroke="#aad" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            : (null) } 
            {props.owner === 2 ? 
                <svg  viewBox="0 0 24 24" fill="none">
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#daa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            : (null) } 
            {/* {ownertext} */}
        </>
        <small>
            {props.index}
        </small>
    </button>
}

export default BoardSquare