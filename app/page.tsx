"use client";
import { useEffect, useRef } from "react";


// liquid cursor 

function LiquidCursor() {
    const canvasRef = useRef<HTMLCanvasElement>(null);


    // Create an array of points to act as the "spine" of our liquid trail

    const points = useRef(Array.from({ length: 35 }, () => { x: 0, y: 0 }));

    const 



}