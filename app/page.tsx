"use client";
import { useEffect, useRef } from "react";


// liquid cursor 

function LiquidCursor() {
    const canvasRef = useRef<HTMLCanvasElement>(null);


    // Create an array of points to act as the "spine" of our liquid trail

    const points = useRef(Array.from({ length: 35 }, () => { x: 0, y: 0 }));

    const mouse = useRef({ x: 0, y: 0 });
    const hasMoved = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;



        // Handle high-res displays and resizing
        const updateSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

        };

        window.addEventListener('resize', updateSize);
        updateSize();


        //center starting point 
        






};