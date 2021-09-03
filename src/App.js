import React, { useCallback, useRef, useState } from "react";
import produce, { castDraft } from "immer";
import "./App.css";

const rowSize = 40;
const colSize = 80;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [1, 1],
  [1, 0],
  [-1, 1],
  [-1, -1],
  [-1, 0],
];

const clearGrid = () => {
  const rows = [];
  for (let i = 0; i < rowSize; i++) {
    rows.push(Array.from(Array(colSize), () => 0));
  }
  return rows;
};

function App() {
  const [grid, setGrid] = useState(() => {
    return clearGrid();
  });

  const [isRunning, setIsRunning] = useState(false);

  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;

  const startGOL = useCallback(() => {
    if (!isRunningRef.current) {
      return;
    }
    setGrid((g) => {
      return produce(g, (draft) => {
        for (let i = 0; i < rowSize; i++) {
          for (let j = 0; j < colSize; j++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < rowSize && newJ >= 0 && newJ < colSize) {
                neighbors += g[newI][newJ];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              draft[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              draft[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(startGOL, 200);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setIsRunning(!isRunning);
          if (!isRunning) {
            isRunningRef.current = true;
            startGOL();
          }
        }}
      >
        {isRunning ? "Stop" : "Start"}
      </button>
      <button
        onClick={() => {
          setGrid(clearGrid());
          setIsRunning(false);
        }}
      >
        Clear
      </button>
      <button
        onClick={() => {
          const rows = [];
          for (let i = 0; i < rowSize; i++) {
            rows.push(
              Array.from(Array(colSize), () => (Math.random() > 0.8 ? 1 : 0))
            );
          }
          setGrid(rows);
        }}
      >
        Random
      </button>
      <div
        className="grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${colSize}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => {
                const newGrid = produce(grid, (draft) => {
                  draft[i][j] = grid[i][j] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][j] ? "black" : undefined,
                border: "solid 1px #c0c0c0",
              }}
            />
          ))
        )}
      </div>
    </>
  );
}

export default App;
