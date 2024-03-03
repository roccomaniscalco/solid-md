import type * as Party from "partykit/server"

export default class Server implements Party.Server {
  messages: string[]

  constructor(readonly room: Party.Room) {
    this.messages = []
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.room.id}
  url: ${new URL(ctx.request.url).pathname}`,
    )

    // let's send messages to the connection
    for (const message of this.messages) {
      conn.send(message)
    }
  }

  onMessage(message: string, sender: Party.Connection) {
    // let's log the message
    console.log(`connection ${sender.id} sent message: ${message}`)
    // push it to the messages array
    this.messages.push(`${sender.id}: ${message}`)
    // as well as broadcast it to all the other connections in the room...
    this.room.broadcast(
      `${sender.id}: ${message}`,
      // ...except for the connection it came from
      [sender.id],
    )
  }
}

Server satisfies Party.Worker
