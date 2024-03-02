import { createSignal } from "solid-js"
import Button from "./ui/button"

function App() {
  const [count, setCount] = createSignal(0)

  return (
    <>
      <div class="flex flex-col items-center gap-6 p-8">
        <h1>Vite + Solid</h1>
        <Button onClick={() => setCount((count) => count + 1)}>
          count is <span class="tabular-nums">{count()}</span>
        </Button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <p>Click on the Vite and Solid logos to learn more</p>
      </div>
    </>
  )
}

export default App
