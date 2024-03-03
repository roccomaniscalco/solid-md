import Button from "@/ui/button"
import { TextField } from "@kobalte/core"
import PartySocket from "partysocket"
import { For, createEffect, createSignal } from "solid-js"

function App() {
  const { messages, sendMessage } = createMessageRoom()
  const [draft, setDraft] = createSignal("")

  const submitDraft = () => {
    sendMessage(draft())
    setDraft("")
  }

  return (
    <>
      <div class="mx-auto flex max-w-2xl flex-col gap-6 p-10">
        <For each={messages()} fallback={<div>No messages</div>}>
          {(message) => <div>{message}</div>}
        </For>

        <TextField.Root class="flex flex-col gap-2">
          <TextField.TextArea
            class="w-full resize-none rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white outline-none ring-offset-2 ring-offset-gray-950 placeholder:text-gray-500 focus:ring-2 focus:ring-teal-400"
            onInput={(e) => setDraft(e.target.value)}
            value={draft()}
            placeholder="Type a message..."
            autoResize
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                submitDraft()
              }
            }}
          />
        </TextField.Root>
        <Button onClick={submitDraft} disabled={!draft()}>
          Send
        </Button>
      </div>
    </>
  )
}

function createMessageRoom() {
  const [messages, setMessages] = createSignal<string[]>([])

  const ws = new PartySocket({
    host: "localhost:1999",
    room: "my-room",
    party: "main",
  })

  createEffect(() => {
    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data])
      console.log(event.data)
    }
  })

  const sendMessage = (message: string) => {
    setMessages((prev) => [...prev, `me: ${message}`])
    ws.send(message)
  }

  return { messages, sendMessage }
}

export default App
