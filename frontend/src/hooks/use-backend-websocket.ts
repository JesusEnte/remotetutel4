export default function useBackendWebsocket(password: string, setWebsocket: (ws: WebSocket | null) => void, setError: (error: string) => void){
  let has_connected = false
  const ws = new WebSocket(`${window.location}ws/frontends`)
  ws.onmessage = (ev: MessageEvent) => {
    const msg = JSON.parse(ev.data)
    if (msg.type! == 'authentication' && msg.status! == 'success'){
      setWebsocket(ws)
      setError('')
    }
    else if (msg.type! == 'authentication' && msg.status == 'wrong password'){
      setError('Incorrect Password')
    }
    else {
      setError('Unknown Error')
    }
  }

  ws.onclose = () => {
    setWebsocket(null)
    setError(has_connected ? 'Disconnected' : 'Server is offline')
  }

  ws.onopen = () => {
    has_connected = true
    ws!.send(JSON.stringify({type: 'authentication', password: password}))
  }
}