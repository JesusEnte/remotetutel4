import logo from '/tutel.ico'
import useBackendWebsocket from '../hooks/use-backend-websocket'

interface LoginProps {
  setWebsocket: (ws: WebSocket|null) => void
  error: string
  setError: (error: string) => void
}

export default function Login(props: LoginProps){
  return (
  <div
    style={{
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    margin: '0',
    textAlign: 'center'
  }}>
    <h1>Remotetutel4 <img src={logo}></img></h1>
    <input
    type='password' 
    placeholder='Password'
    style={{margin: '30px'}}
    onKeyDown={(ev) => {
      if (ev.key == 'Enter'){
        const target = ev.target as HTMLInputElement
        useBackendWebsocket(target.value, props.setWebsocket, props.setError)
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