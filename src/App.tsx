import produce from 'immer'
import { useCallback, useRef, useState } from 'react'

const numRows = 2
const numCols = 2

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
]

const setRows = () => {
  const rows = []
  for (let i = 0; i < numRows; i++)
    rows.push(Array.from(Array(numCols), () => false))
  return rows
}

export const App = () => {
  const [grid, setGrid] = useState(setRows())

  const [running, setRunning] = useState(false)

  const runningRef = useRef(false)
  runningRef.current = running
  console.log(grid)

  const runSimulation = useCallback(() => {
    if (!runningRef.current) return

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numCols; i++) {
          for (let j = 0; j < numRows; j++) {
            let neighborCount: number = 0
            operations.forEach((operation) => {
              // if (gridCopy.hasOwn)
              if (gridCopy[i + operation[0]]?.[j + operation[1]]) neighborCount++
            })

            if (neighborCount < 2 && gridCopy[i][j]) gridCopy[i][j] = false
          }
        }
        
      })
    })

    setTimeout(runSimulation, 1000)
  }, [])

  return (
    <>
      <button
        onClick={() => {
          setRunning(!running)
          if (!running) {
            runningRef.current = true
            runSimulation()
          }
        }}
      >
        {running ? 'Stop' : 'Start'}
      </button>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][k] = !gridCopy[i][k]
                })
                setGrid(newGrid)
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? 'pink' : undefined,
                border: 'solid 1px black',
              }}
            ></div>
          ))
        )}
      </div>
    </>
  )
}
