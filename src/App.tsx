import { TextField } from "@kobalte/core"

function App() {
  return (
    <>
      <div class="mx-auto flex max-w-2xl flex-col gap-6 p-10">
        <TextField.Root class="flex flex-col gap-2">
          <TextField.Label class="w-fit text-sm font-semibold">
            Multiplayer Text Area
          </TextField.Label>
          <TextField.TextArea
            autoResize
            class="w-full resize-none rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white outline-none ring-offset-2 ring-offset-gray-950 focus:ring-2 focus:ring-teal-400"
          />
          <TextField.Description class="text-sm text-gray-400">
            Everyone can view and edit the content of this text area.
          </TextField.Description>
        </TextField.Root>
      </div>
    </>
  )
}

export default App
