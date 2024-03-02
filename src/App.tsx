import { Button } from "@kobalte/core"
import { createSignal } from "solid-js"

function App() {
  const [count, setCount] = createSignal(0)

  return (
    <>
      <div class="flex flex-col items-center gap-6 p-8">
        <h1>Vite + Solid</h1>
        <Button.Root
          onClick={() => setCount((count) => count + 1)}
          // disabled
          class="rounded-md bg-teal-700 px-4 py-2 text-white outline-none ring-offset-2 ring-offset-gray-950 hover:bg-teal-800 focus:ring-2 focus:ring-teal-400 kb-disabled:bg-gray-500 kb-disabled:text-gray-200"
        >
          count is <span class="tabular-nums">{count()}</span>
        </Button.Root>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <p>Click on the Vite and Solid logos to learn more</p>
      </div>
    </>
  )
}

export default App
