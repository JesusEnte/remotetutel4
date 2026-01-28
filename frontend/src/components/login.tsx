import logo from '/tutel.ico'


function connectWebsocketBackend(password: String, setWebsocket: (ws: WebSocket | null) => void, setError: (error: String) => void){
  let has_connected = false
  const ws = new WebSocket('http://127.0.0.1:5000/ws/frontends')

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
    setError(has_connected ? 'Disconnected' : 'Timeout')
  }

  ws.onopen = () => {
    has_connected = true
    ws!.send(JSON.stringify({type: 'authentication', password: password}))
  }
}

interface LoginPageProps {
  setWebsocket: (ws: WebSocket|null) => void,
  error: String,
  setError: (error: String) => void
}

export default function LoginPage(props: LoginPageProps){
  return (
  <div
    style={{
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    margin: '0',
    width: '80svw',
    height: '40svh',
    textAlign: 'center'
  }}>
    <h1 style={{alignContent: 'center'}}>Remotetutel4 <img src={logo} style={{height: '100%', margin: '0', padding: '0'}}></img></h1>
    <input 
    type='password' 
    placeholder='Password'
    onKeyDown={(ev) => {
      if (ev.key == 'Enter'){
        const target = ev.target as HTMLInputElement
        connectWebsocketBackend(target.value, props.setWebsocket, props.setError)
      }
    }}
    />
    <p
      style={{
        color: 'red'
      }}
    >{props.error}</p>
  </div>
  )
}