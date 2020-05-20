import React, { useEffect, useState, useCallback } from "react";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <Wheel />
    </div>
  );
}

const colors = [
  "#b0d0d3ff",
  "#c08497ff",
  "#f7af9dff",
  "#f7e3afff",
  "#f3eec3ff",
  "#75b9beff",
  "#ecce8eff",
  "#dbcf96ff",
  "#c2c6a7ff"
];

const easeInOutQuad = t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

const ONE_LAP = 2 * Math.PI;

function getAngleRad(p1, p2) {
  // returns the angle between 2 points in radians
  // p1 = {x: 1, y: 2};
  // p2 = {x: 3, y: 4};
  const theta = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  const rad = theta < 0 ? Math.PI + (Math.PI + theta) : theta;
  return rad;
}

const Wheel = ({ size = 800, startRad = 0, minLap = 3, maxLap = 7 }) => {
  const [currentRad, setCurrentRad] = useState(0);
  const [start, setStart] = useState(false);

  const toggle = () => setStart(prev => !prev);

  useEffect(() => {
    if (!start) return;

    const startTime = performance.now();

    const totalTime = 4000;
    const spinRad = ONE_LAP * randomRange(minLap, maxLap);

    let lastAnimId = null;
    const update = now => {
      const eslaped = now - startTime;
      const factor = easeInOutQuad(eslaped / totalTime);
      const cr = spinRad * factor;
      // console.log(cr);

      setCurrentRad(currentRad + cr);

      if (eslaped < totalTime) {
        lastAnimId = requestAnimationFrame(update);
      } else {
        setStart(false);
      }
    };

    update(startTime);

    return () => {
      lastAnimId && cancelAnimationFrame(lastAnimId);
    };
  }, [start]);

  useEffect(() => {
    if (start) return;
    const indicatorRad = getAngleRad({ x: center, y: center }, indicator);
    const normalizedRad =
      currentRad > ONE_LAP ? currentRad % ONE_LAP : currentRad;
    const currentParts = parts.map(({ a1, a2, ...rest }) => ({
      a1: (a1 + normalizedRad) % ONE_LAP,
      a2: (a2 + normalizedRad) % ONE_LAP,
      ...rest
    }));

    const pickedPart = currentParts.find(({ a1, a2 }) => {
      if (a1 < a2) {
        return indicatorRad > a1 && indicatorRad < a2;
      } else {
        return indicatorRad > a1 || indicatorRad < a2;
      }
    });

    console.log({ indicatorRad });

    console.log({ normalizedRad });
    console.log({ parts });
    console.log({ pickedPart });
  }, [start]);

  const partCount = 9;
  const center = size / 2;
  const radius = center * 0.7;

  let parts = [];

  for (let i = 0; i < partCount; i++) {
    const a1 = (ONE_LAP / partCount) * i;
    const a2 = (ONE_LAP / partCount) * (i + 1);
    const part = {
      a1,
      a2,
      color: colors[i]
    };

    parts.push(part);
  }

  const indicator = {
    x: size * 0.8,
    y: size * 0.2
    // x: size * 0,
    // y: size * 0
  };

  // console.log(normalizedRad);

  return (
    <>
      <svg
        style={{ backgroundColor: "#edeaea", position: "relative" }}
        width={size}
        height={size}
      >
        {/* <style>
          {`.wheel-arrow {
fill: #363533;
}`}
        </style> */}
        {parts.map(({ a1, a2, color }, i) => {
          const p1x = center + Math.cos(startRad + currentRad + a1) * radius;
          const p1y = center + Math.sin(startRad + currentRad + a1) * radius;

          const p2x = center + Math.cos(startRad + currentRad + a2) * radius;
          const p2y = center + Math.sin(startRad + currentRad + a2) * radius;

          return (
            <path
              key={i}
              stroke="#000"
              strokeWidth="0"
              fill={color}
              d={`
              M${center},${center} ${p1x},${p1y}
              A${radius},${radius} 0 0,1 ${p2x},${p2y}Z
            `}
            />
          );
        })}
        {/* <g
          transform={`translate(${size * 0.88},${size *
            0.21}) rotate(63) scale(${size / 600})`}
          className="wheel-arrow"
        >
          <path d="M50 23.8c-5.9 0-10.6 4.8-10.6 10.6S44.1 45 50 45s10.6-4.8 10.6-10.6S55.9 23.8 50 23.8zM50 42c-4.2 0-7.6-3.4-7.6-7.6s3.4-7.6 7.6-7.6 7.6 3.4 7.6 7.6S54.2 42 50 42z" />
          <path d="M50 1C31.6 1 16.6 16.5 16.6 35.5c0 23.9 30.9 60.6 32.2 62.1L50 99l1.2-1.4c1.3-1.6 32.4-38.3 32.3-62.1C83.3 16.5 68.3 1 50 1zm30.4 34.5c.1 20.3-24.7 51.8-30.4 58.8-5.7-7-30.3-38.5-30.3-58.8C19.6 18.2 33.3 4 50 4c16.7 0 30.3 14.2 30.4 31.5z" />
        </g> */}
        <circle cx={indicator.x} cy={indicator.y} r="10" fill="#363533" />
      </svg>
      <button disabled={start} onClick={toggle}>
        start
      </button>
    </>
  );
};
