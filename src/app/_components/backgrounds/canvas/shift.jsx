'use client'

import { useEffect, useRef, useCallback } from 'react';
import { createNoise3D } from 'simplex-noise';
import { rand, fadeInOut, cos, sin, TAU } from './math';

const circleCount = 150;
const circlePropCount = 8;
const circlePropsLength = circleCount * circlePropCount;
const baseSpeed = 0.1;
const rangeSpeed = 1;
const baseTTL = 150;
const rangeTTL = 200;
const baseRadius = 100;
const rangeRadius = 200;
const rangeHue = 60;
const xOff = 0.0015;
const yOff = 0.0015;
const zOff = 0.0015;
const backgroundColor = 'hsla(0,0%,5%,1)';

export default function Shift() {
    const canvasRef = useRef(null);
    const canvasObjRef = useRef({ a: null, b: null });
    const ctxRef = useRef({ a: null, b: null });
    const noise3DRef = useRef(null);
    const circlePropsRef = useRef(null);
    const baseHueRef = useRef(220);
    const animationFrameRef = useRef(null);

    const initCircle = useCallback((i) => {
        const canvas = canvasObjRef.current.a;
        const noise3D = noise3DRef.current;
        const circleProps = circlePropsRef.current;
        const baseHue = baseHueRef.current;

        const x = rand(canvas.width);
        const y = rand(canvas.height);
        const n = noise3D(x * xOff, y * yOff, baseHue * zOff);
        const t = rand(TAU);
        const speed = baseSpeed + rand(rangeSpeed);
        const vx = speed * cos(t);
        const vy = speed * sin(t);
        const life = 0;
        const ttl = baseTTL + rand(rangeTTL);
        const radius = baseRadius + rand(rangeRadius);
        const hue = baseHue + n * rangeHue;

        circleProps.set([x, y, vx, vy, life, ttl, radius, hue], i);
    }, []);

    const drawCircle = useCallback((x, y, life, ttl, radius, hue) => {
        const ctx = ctxRef.current.a;

        ctx.save();
        ctx.fillStyle = `hsla(${hue},60%,30%,${fadeInOut(life, ttl)})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, TAU);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }, []);

    const checkBounds = useCallback((x, y, radius) => {
        const canvas = canvasObjRef.current.a;
        return (
            x < -radius ||
            x > canvas.width + radius ||
            y < -radius ||
            y > canvas.height + radius
        );
    }, []);

    const updateCircle = useCallback((i) => {
        const circleProps = circlePropsRef.current;
        const i2 = 1 + i, i3 = 2 + i, i4 = 3 + i, i5 = 4 + i, i6 = 5 + i, i7 = 6 + i, i8 = 7 + i;

        const x = circleProps[i];
        const y = circleProps[i2];
        const vx = circleProps[i3];
        const vy = circleProps[i4];
        let life = circleProps[i5];
        const ttl = circleProps[i6];
        const radius = circleProps[i7];
        const hue = circleProps[i8];

        drawCircle(x, y, life, ttl, radius, hue);

        life++;

        circleProps[i] = x + vx;
        circleProps[i2] = y + vy;
        circleProps[i5] = life;

        if (checkBounds(x, y, radius) || life > ttl) {
            initCircle(i);
        }
    }, [drawCircle, checkBounds, initCircle]);

    const updateCircles = useCallback(() => {
        baseHueRef.current++;

        for (let i = 0; i < circlePropsLength; i += circlePropCount) {
            updateCircle(i);
        }
    }, [updateCircle]);

    const render = useCallback(() => {
        const canvas = canvasObjRef.current;
        const ctx = ctxRef.current;

        ctx.b.save();
        ctx.b.filter = 'blur(50px)';
        ctx.b.drawImage(canvas.a, 0, 0);
        ctx.b.restore();
    }, []);

    const draw = useCallback(() => {
        const canvas = canvasObjRef.current;
        const ctx = ctxRef.current;

        ctx.a.clearRect(0, 0, canvas.a.width, canvas.a.height);
        ctx.b.fillStyle = backgroundColor;
        ctx.b.fillRect(0, 0, canvas.b.width, canvas.b.height);
        updateCircles();
        render();

        // eslint-disable-next-line react-hooks/immutability
        animationFrameRef.current = requestAnimationFrame(draw);
    }, [updateCircles, render]);

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
    }, []);

    const initCircles = useCallback(() => {
        circlePropsRef.current = new Float32Array(circlePropsLength);
        noise3DRef.current = createNoise3D();
        baseHueRef.current = 220;

        for (let i = 0; i < circlePropsLength; i += circlePropCount) {
            initCircle(i);
        }
    }, [initCircle]);

    useEffect(() => {
        const canvasB = canvasRef.current;
        const canvasA = document.createElement('canvas');

        canvasObjRef.current = { a: canvasA, b: canvasB };
        ctxRef.current = {
            a: canvasA.getContext('2d'),
            b: canvasB.getContext('2d')
        };

        resize();
        initCircles();
        draw();

        const handleResize = () => resize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [resize, initCircles, draw]);

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

