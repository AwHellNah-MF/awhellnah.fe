'use client'

import { useEffect, useRef, useCallback } from 'react';
import { createNoise3D } from 'simplex-noise';
import { rand, round, fadeInOut } from './math';

const rayCount = 500;
const rayPropCount = 8;
const rayPropsLength = rayCount * rayPropCount;
const baseLength = 200;
const rangeLength = 200;
const baseSpeed = 0.05;
const rangeSpeed = 0.1;
const baseWidth = 10;
const rangeWidth = 20;
const baseHue = 120;
const rangeHue = 60;
const baseTTL = 50;
const rangeTTL = 100;
const noiseStrength = 100;
const xOff = 0.0015;
const yOff = 0.0015;
const zOff = 0.0015;
const backgroundColor = 'hsla(220,60%,3%,1)';

export default function Aurora() {
    const canvasRef = useRef(null);
    const canvasObjRef = useRef({ a: null, b: null });
    const ctxRef = useRef({ a: null, b: null });
    const centerRef = useRef([0, 0]);
    const tickRef = useRef(0);
    const noise3DRef = useRef(null);
    const rayPropsRef = useRef(null);
    const animationFrameRef = useRef(null);

    const initRay = useCallback((i) => {
        const canvas = canvasObjRef.current.a;
        const center = centerRef.current;
        const tick = tickRef.current;
        const noise3D = noise3DRef.current;
        const rayProps = rayPropsRef.current;

        const length = baseLength + rand(rangeLength);
        const x = rand(canvas.width);
        let y1 = center[1] + noiseStrength;
        let y2 = center[1] + noiseStrength - length;
        const n = noise3D(x * xOff, y1 * yOff, tick * zOff) * noiseStrength;
        y1 += n;
        y2 += n;
        const life = 0;
        const ttl = baseTTL + rand(rangeTTL);
        const width = baseWidth + rand(rangeWidth);
        const speed = baseSpeed + rand(rangeSpeed) * (round(rand(1)) ? 1 : -1);
        const hue = baseHue + rand(rangeHue);

        rayProps.set([x, y1, y2, life, ttl, width, speed, hue], i);
    }, []);

    const drawRay = useCallback((x, y1, y2, life, ttl, width, hue) => {
        const ctx = ctxRef.current.a;
        const gradient = ctx.createLinearGradient(x, y1, x, y2);
        gradient.addColorStop(0, `hsla(${hue},100%,45%,0)`);
        gradient.addColorStop(0.5, `hsla(${hue},100%,35%,${fadeInOut(life, ttl)})`);
        gradient.addColorStop(1, `hsla(${hue},100%,25%,0)`);

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = width;
        ctx.moveTo(x, y1);
        ctx.lineTo(x, y2);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }, []);

    const checkBounds = useCallback((x) => {
        const canvas = canvasObjRef.current.a;
        return x < 0 || x > canvas.width;
    }, []);

    const updateRay = useCallback((i) => {
        const rayProps = rayPropsRef.current;
        const i2 = 1 + i, i3 = 2 + i, i4 = 3 + i, i5 = 4 + i, i6 = 5 + i, i7 = 6 + i, i8 = 7 + i;

        let x = rayProps[i];
        const y1 = rayProps[i2];
        const y2 = rayProps[i3];
        let life = rayProps[i4];
        const ttl = rayProps[i5];
        const width = rayProps[i6];
        const speed = rayProps[i7];
        const hue = rayProps[i8];

        drawRay(x, y1, y2, life, ttl, width, hue);

        x += speed;
        life++;

        rayProps[i] = x;
        rayProps[i4] = life;

        if (checkBounds(x) || life > ttl) {
            initRay(i);
        }
    }, [drawRay, checkBounds, initRay]);

    const drawRays = useCallback(() => {
        for (let i = 0; i < rayPropsLength; i += rayPropCount) {
            updateRay(i);
        }
    }, [updateRay]);

    const render = useCallback(() => {
        const canvas = canvasObjRef.current;
        const ctx = ctxRef.current;

        ctx.b.save();
        ctx.b.filter = 'blur(12px)';
        ctx.a.globalCompositeOperation = 'lighter';
        ctx.b.drawImage(canvas.a, 0, 0);
        ctx.b.restore();
    }, []);

    const draw = useCallback(() => {
        const canvas = canvasObjRef.current;
        const ctx = ctxRef.current;

        tickRef.current++;
        ctx.a.clearRect(0, 0, canvas.a.width, canvas.a.height);
        ctx.b.fillStyle = backgroundColor;
        ctx.b.fillRect(0, 0, canvas.b.width, canvas.a.height);
        drawRays();
        render();

        // eslint-disable-next-line react-hooks/immutability
        animationFrameRef.current = requestAnimationFrame(draw);
    }, [drawRays, render]);

    const resize = useCallback(() => {
        const { innerWidth, innerHeight } = window;
        const canvas = canvasObjRef.current;
        const ctx = ctxRef.current;

        canvas.a.width = innerWidth;
        canvas.a.height = innerHeight;
        ctx.a.drawImage(canvas.b, 0, 0);

        canvas.b.width = innerWidth;
        canvas.b.height = innerHeight;
        ctx.b.drawImage(canvas.a, 0, 0);

        centerRef.current = [0.5 * innerWidth, 0.5 * innerHeight];
    }, []);

    const initRays = useCallback(() => {
        tickRef.current = 0;
        noise3DRef.current = createNoise3D();
        rayPropsRef.current = new Float32Array(rayPropsLength);

        for (let i = 0; i < rayPropsLength; i += rayPropCount) {
            initRay(i);
        }
    }, [initRay]);

    useEffect(() => {
        const canvasB = canvasRef.current;
        const canvasA = document.createElement('canvas');

        canvasObjRef.current = { a: canvasA, b: canvasB };
        ctxRef.current = {
            a: canvasA.getContext('2d'),
            b: canvasB.getContext('2d')
        };

        resize();
        initRays();
        draw();

        const handleResize = () => resize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [resize, initRays, draw]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
            }}
        />
    );
}

