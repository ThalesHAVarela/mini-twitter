import AuthPage from "./pages/AuthPage"
import FeedPage from "./pages/FeedPage"
import { BrowserRouter, Routes, Route} from "react-router-dom"

function App() {
  return (

  <BrowserRouter>
    <Routes>
      <Route path="/" element={<AuthPage/>} />
      <Route path="/feed" element={<FeedPage/>} />
    </Routes>
  </BrowserRouter>
  )
}

export default App