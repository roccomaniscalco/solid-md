import Room from "@/room"
import { Route, Router } from "@solidjs/router"

export default function App() {
  return (
    <Router>
      <Route path="/room/:id" component={Room} />
    </Router>
  )
}
