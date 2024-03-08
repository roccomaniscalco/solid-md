import type { JoinMessage, TextMessage } from "@/party/schema"
import { messageSchema } from "@/party/schema"
import type * as Party from "partykit/server"

export default class Server implements Party.Server {
  texts: TextMessage[]

  constructor(readonly room: Party.Room) {
    this.texts = []
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.room.id}
  url: ${new URL(ctx.request.url).pathname}`,
    )

    // let's get the new connection up to speed with sent messages
    const message = { type: "join", texts: this.texts } satisfies JoinMessage
    conn.send(JSON.stringify(message))
  }

  onMessage(stringifiedMessage: string, sender: Party.Connection) {
    const message = messageSchema.parse(JSON.parse(stringifiedMessage))

    if (message.type === "text") {
      this.texts.push(message)
      this.room.broadcast(stringifiedMessage, [sender.id])
      return
    }
    if (message.type === "cursor") {
      this.room.broadcast(stringifiedMessage, [sender.id])
      return
    }
  }
}

Server satisfies Party.Worker
