import Renderer from './control/renderer'
import type { ThreeRefCurrent } from './control/renderer'
import Hud from './control/hud'
import { useRef, useEffect } from 'react'


interface ControlPageProps {
    websocket: WebSocket
}

export default function ControlPage(props: ControlPageProps){
    const websocket = props.websocket
    const threeRef = useRef<ThreeRefCurrent>(null!)

    function websocket_message_handler(ev: MessageEvent){
        const message = JSON.parse(ev.data)
        switch (message.type) {
            case 'turtles':
                threeRef.current.funcs.setTurtles(message.turtles)
                break
            case 'blocks':
                threeRef.current.funcs.setBlocks(message.blocks)
                break
        }
    }

    useEffect(() => {
        websocket.onmessage = websocket_message_handler
        websocket.send(JSON.stringify({type: 'get turtles'}))
        websocket.send(JSON.stringify({type: 'get blocks'}))
    }, [websocket])
    
    return (<>
        <Renderer 
            threeRef={threeRef}
            style={{
                position: 'absolute', 
                width: '100svw', 
                height: '100svh',
                left: 0,
                top: 0,
                zIndex: 1
            }}
        />
        <Hud 
            style={{
                position: 'absolute', 
                left: 0,
                top: 0,
                zIndex: 2
            }}
        />
    </>)
}