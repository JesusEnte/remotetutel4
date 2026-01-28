import { useState } from 'react'
import LoginPage from './components/login.tsx'
import './App.css'

export default function App() {

  const [websocket, setWebsocket] = useState<WebSocket | null>(null)
  const [error, setError] = useState<String>('')

  if (!(websocket instanceof(WebSocket))){
    return <LoginPage 
      setWebsocket={setWebsocket} 
      error={error}
      setError={setError}/>
  }
}
