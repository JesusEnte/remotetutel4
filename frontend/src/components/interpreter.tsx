import { useContext, useRef, type CSSProperties } from 'react'
import { WebsocketContext } from '../contexts/websocket'
import { TurtleIdContext } from '../contexts/turtleId'

export default function Interpreter({style}: {style?: CSSProperties}){
    const websocket = useContext(WebsocketContext)
    const [turtleId, _setTurtleId] = useContext(TurtleIdContext)
    const codeRef = useRef(null)
    
    return <div
        style={{
            height: 'fit-content',
            width: 'fit-content',
            maxHeight: '100%',
            maxWidth: '100%',
            border: '2px solid white',
            borderRadius: '5px',
            padding: '5px',
            ...style
        }}
    >
        <p>Interpreter <span title="Code will be ran as if it was a function, so don't forget your return statement">🛈</span></p>
        <textarea
            ref={codeRef}
        />
        <br/>
        <button
            onClick={() => {
                const textarea = codeRef.current! as HTMLTextAreaElement
                const code = textarea.value
                websocket.send(JSON.stringify({type: 'interpreter', code: code, id: turtleId}))
            }}
        >Run</button>
    </div>
}