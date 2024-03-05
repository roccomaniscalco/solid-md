import { CursorMessage, TextMessage, messageSchema } from "@/party/schema"
import { TextField } from "@kobalte/core"
import { useParams, useSearchParams } from "@solidjs/router"
import PartySocket from "partysocket"
import {
  For,
  createEffect,
  createSignal,
  on,
  onCleanup,
  onMount,
} from "solid-js"

export default function Room() {
  const { roomId } = useParams()
  const [searchParams] = useSearchParams()

  if (!searchParams.user) throw new Error("No `user` in search params")

  const { texts, sendText, cursors } = createChatRoom({
    roomId,
    userId: searchParams.user,
  })
  let chatRef: HTMLDivElement | undefined

  createEffect(
    on([texts], () => {
      chatRef?.scrollTo({ top: chatRef?.scrollHeight })
    }),
  )

  return (
    <>
      <For each={cursors()}>
        {(cursor) => (
          <div
            class="absolute rounded-2xl rounded-tl-none bg-teal-800 px-3 py-1"
            style={{
              top: cursor.y + "%",
              left: cursor.x + "%",
            }}
          >
            {cursor.user}
          </div>
        )}
      </For>

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
            // clear the textarea after user presses enter
            // this is a fix to prevent the textarea from adding a newline
            onInput={(e) => {
              if (e.currentTarget.value === "\n") {
                e.currentTarget.value = ""
              }
            }}
          />
        </TextField.Root>
      </div>
    </>
  )
}

function createChatRoom({
  roomId,
  userId,
}: {
  roomId: string
  userId: string
}) {
  const [texts, setTexts] = createSignal<TextMessage[]>([])
  const [cursors, setCursors] = createSignal<CursorMessage[]>([])

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
      if (message.type === "cursor") {
        setCursors((prevCursors) => [
          ...prevCursors.filter((cursor) => cursor.user !== message.user),
          message,
        ])
        return
      }
    }
  })

  const sendCursor = (e: MouseEvent) => {
    ws.send(
      JSON.stringify({
        type: "cursor",
        user: userId,
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      } satisfies CursorMessage),
    )
  }
  onMount(() => window.addEventListener("mousemove", sendCursor))
  onCleanup(() => window.removeEventListener("mousemove", sendCursor))

  const sendText = (content: string) => {
    const message = { type: "add", user: userId, content } satisfies TextMessage
    setTexts((prevTexts) => [...prevTexts, message])
    ws.send(JSON.stringify(message))
  }

  return { texts, sendText, cursors }
}
