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

        mouse.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        points.current.forEach(p => { p.x = mouse.current.x; p.y = mouse.current.y; });

        const onMouseMove = (e: MouseEvent) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
            hasMoved.current = true;

        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('touchmove', ontouchmove);


        let animationFrameId: number;

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const pts = points.current;

        }


         // Spring physics for the "head" of the liquid (Viscosity)

        pts[0].x += (mouse.current.x - pts[0].x) * 0.6;
        pts[0].y += (mouse.current.y - pts[0].y) * 0.6;


        for (let i = 1; i < pts.length; i++ ) {
            pts[i]x += (pts[i - 1].x - pts[i].x) * 0.4;
            pts[i].y += (pts[i - 1].y - pts[i].y) * 0.4;
      }


      id (hasMoved.current) {
        for (let i = 0; i < pts.length; i++) {
          ctx.beginPath();
          // The radius tapers off smoothly toward the end of the tail (reduced to 50%)

          const radius = Math.max(0.1, 20 - i * 0.6);
          ctx.arc(pts[i].x, pts[i].y, radius, 0, Math.PI * 2);
          ctx.fillStyle = '#E5E5E5';
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  








};