import { TextMessage, messageSchema } from "@/party/schema"
import { TextField } from "@kobalte/core"
import { useParams } from "@solidjs/router"
import PartySocket from "partysocket"
import { For, createEffect, createSignal, on } from "solid-js"

export default function Room() {
  const { roomId } = useParams()
  const { texts, sendText } = createChatRoom(roomId)
  let chatRef: HTMLDivElement | undefined

  createEffect(
    on([texts], () => {
      chatRef?.scrollTo({ top: chatRef?.scrollHeight })
    }),
  )

  return (
    <>
      <div class="mx-auto flex h-screen max-w-2xl flex-col gap-6 p-10">
        <div class="flex-1 overflow-auto" ref={chatRef}>
          <For each={texts()} fallback={<div>No messages</div>}>
            {(text) => (
              <div>
                {text.user}: {text.content}
              </div>
            )}
          </For>
        </div>

        <TextField.Root class="flex flex-col gap-2">
          <TextField.TextArea
            class="w-full resize-none rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white outline-none ring-offset-2 ring-offset-gray-950 placeholder:text-gray-500 focus:ring-2 focus:ring-teal-400"
            placeholder="Type a message..."
            autoResize
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                sendText(e.currentTarget.value)
                e.currentTarget.value = ""
              }
            }}
          />
        </TextField.Root>
      </div>
    </>
  )
}

function createChatRoom(roomId: string) {
  const [texts, setTexts] = createSignal<TextMessage[]>([])

  const ws = new PartySocket({
    host: "localhost:1999",
    room: roomId,
    party: "main",
  })

  createEffect(() => {
    ws.onmessage = (event) => {
      const message = messageSchema.parse(JSON.parse(event.data))
      if (message.type === "join") {
        setTexts(message.texts)
        return
      }
      if (message.type === "add") {
        setTexts((prevTexts) => [...prevTexts, message])
        return
      }
    }
  })

  const sendText = (content: string) => {
    const message = { type: "add", user: "me", content } satisfies TextMessage
    setTexts((prevTexts) => [...prevTexts, message])
    ws.send(JSON.stringify(message))
  }

  return { texts, sendText }
}
