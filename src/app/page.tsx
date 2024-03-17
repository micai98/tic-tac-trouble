"use client"
import { useState } from "react";

const Main = () => {
    const [width, setWidth] = useState<number>(3);
    const [height, setHeight] = useState<number>(3);
    const [wincond, setWincond] = useState<number>(3);

    return <>
        <main>
            <br /><br />
            <div className="ttt-panel">
                <b>Tic Tac Trouble</b>
                <br /><hr /><br />
                <p>Width</p>
                <input type="number" value={width} onChange={(e) => setWidth(parseInt(e.target.value))}/>
                <br /><br />
                <p>Height</p>
                <input type="number" value={height} onChange={(e) => setHeight(parseInt(e.target.value))}/>
                <br /><br />
                <p>Win condition</p>
                <input type="number" value={wincond} onChange={(e) => setWincond(parseInt(e.target.value))} />
                <br /><br />
                <a href={`/playlocal?w=${width}&h=${height}&s=${wincond}`}><button>Start</button></a>
            </div>
        </main>
    </>
}

export default Main
