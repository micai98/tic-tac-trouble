"use client"
import Image from "next/image";
import styles from "./page.module.css";

import Board from "@/components/Board"
import { useSearchParams } from "next/navigation";

const Main = () => {
  const searchParams = useSearchParams();
  let w: number = 3; 
  let h: number = 3;
  let s: number = 3;

  if(searchParams.has("w")) {
    const w_ = searchParams.get("w");
    if(w_) w = parseInt(w_);
    if(w < 2) w = 3;
  }

  if(searchParams.has("h")) {
    const h_ = searchParams.get("h");
    if(h_) h = parseInt(h_);
    if(h < 2) h = 3;
  }

  if(searchParams.has("s")) {
    const s_ = searchParams.get("s");
    if(s_) s = parseInt(s_);
    if(s < 2) s = 3;
  }


  return <>
    <main>
      <br /> <br />
      <Board key={9999} width={w} height={h} wincond={s} />
    </main>
  </>
}

export default Main
