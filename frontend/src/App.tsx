import './App.css'

import { useState } from 'react'

import Login from './components/login.tsx'
import Remotetutel from './components/remotetutel.tsx'

export default function App() {
    const [websocket, setWebsocket] = useState<WebSocket | null>(null)
    const [error, setError] = useState<string>('')

    if (websocket == null){  
        return <Login 
            setWebsocket={setWebsocket} 
            error={error}
            setError={setError}
        />
    } else {
        return <Remotetutel
            websocket={websocket}
        />
    }
}
