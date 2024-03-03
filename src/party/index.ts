import type { JoinMessage, TextMessage } from "@/party/schema"
import { textMessageSchema } from "@/party/schema"
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

  onMessage(message: string, sender: Party.Connection) {
    const textMessage = textMessageSchema.parse(JSON.parse(message))
    // let's log the message
    console.log(`user ${textMessage.user} sent message: ${textMessage.content}`)
    // push it to the messages array
    this.texts.push(textMessage)
    // as well as broadcast it to all the other connections in the room...
    this.room.broadcast(
      message,
      // ...except for the connection it came from
      [sender.id],
    )
  }
}

Server satisfies Party.Worker
