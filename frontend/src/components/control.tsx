import Renderer from './control/renderer'
import type { ThreeFunctions } from './control/renderer'
import type { Scene, Camera, WebGLRenderer } from 'three'
import type { OrbitControls } from 'three/addons'
import Hud from './control/hud'
import type { HudFuncs } from './control/hud'
import { useRef, useEffect } from 'react'


interface ControlPageProps {
    websocket: WebSocket
}

export interface Shared {
    scene: Scene,
    camera: Camera,
    renderer: WebGLRenderer,
    controls: OrbitControls,
    threeFuncs: ThreeFunctions,
    selectedTurtleId: string | null,
    hudFuncs: HudFuncs
}

export interface Turtle {
    id: string,
    x: number,
    y: number
    z: number,
    dir: number,
    fuel: number,
    status: string
}
export type Turtles = Record<string, Turtle>

export default function ControlPage(props: ControlPageProps){
    const websocket = props.websocket
    const sharedRef = useRef<Shared>({
        scene: null!,
        camera: null!,
        renderer: null!,
        controls: null!,
        threeFuncs: null!,
        selectedTurtleId: null!,
        hudFuncs: null!
    })
    const shared = sharedRef.current

    function websocket_message_handler(ev: MessageEvent){
        const message = JSON.parse(ev.data)
        switch (message.type) {
            case 'turtles':
                shared.threeFuncs.setTurtles(message.turtles)
                shared.hudFuncs.setTurtles(message.turtles)
                break
            case 'blocks':
                shared.threeFuncs.setBlocks(message.blocks)
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
            sharedRef={sharedRef}
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
            sharedRef={sharedRef} 
            style={{
                position: 'absolute',
                zIndex: 2
            }}
        />
    </>)
}