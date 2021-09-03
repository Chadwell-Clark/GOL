import React, { useState } from "react";
import produce from "immer";
import "./App.css";

const rowSize = 40;
const colSize = 80;

function App() {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < rowSize; i++) {
      rows.push(Array.from(Array(colSize), () => 0));
    }

    return rows;
  });

  const [isRunning, setIsRunning] = useState(false);

  return (
    <>
      <button>{isRunning ? "Stop" : "Start"}</button>
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
