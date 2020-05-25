import React, { useEffect, useState } from "react";

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
  const theta = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  const rad = theta < 0 ? Math.PI + (Math.PI + theta) : theta;
  return rad;
}

const Wheel = ({ size = 700, startRad = 0, minLap = 3, maxLap = 7 }) => {
  const [currentRad, setCurrentRad] = useState(0);
  const [start, setStart] = useState(false);
  const [picked, setPicked] = useState(null);

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

    setPicked(pickedPart);
  }, [start]);

  const partCount = 9;
  const center = size / 2;
  const radius = center * 0.9;

  let parts = [];

  const arcLength = ONE_LAP / partCount;
  for (let i = 0; i < partCount; i++) {
    const a1 = arcLength * i;
    const a2 = arcLength * (i + 1);
    const part = {
      a1,
      a2,
      color: colors[i]
    };

    parts.push(part);
  }

  const indicator = {
    x: size * 0.95,
    y: size * 0.25
  };

  return (
    <>
      <svg width={size} height={size} onClick={toggle}>
        {parts.map(({ a1, a2, color }, i) => {
          const p1x = center + Math.cos(startRad + currentRad + a1) * radius;
          const p1y = center + Math.sin(startRad + currentRad + a1) * radius;

          const p2x = center + Math.cos(startRad + currentRad + a2) * radius;
          const p2y = center + Math.sin(startRad + currentRad + a2) * radius;


          const textPos = {
            x:
              center +
              Math.cos(startRad + currentRad + a1 + arcLength / 2) *
                radius *
                0.3,
            y:
              center +
              Math.sin(startRad + currentRad + a1 + arcLength / 2) *
                radius *
                0.3
          };
          const textRad = startRad + currentRad + a1 + arcLength / 2;
          return (
            <React.Fragment key={i}>
              <path
                stroke={color}
                strokeWidth="0.5"
                fill={color}
                d={`
                M${center},${center} ${p1x},${p1y}
                A${radius},${radius} 0 0,1 ${p2x},${p2y}Z
                `}
              />
              <text
                x={textPos.x}
                y={textPos.y}
                fontFamily="'Lucida Grande', sans-serif"
                fontSize="32"
                transform={`rotate(${(textRad * 180) / Math.PI}, ${
                  textPos.x
                }, ${textPos.y})`}
              >
                {color}
              </text>
            </React.Fragment>
          );
        })}

        <circle cx={indicator.x} cy={indicator.y} r="10" fill={picked?.color} />
      </svg>
    </>
  );
};

export default Wheel;
