import { useContext, useEffect } from "react";
import { WebsocketContext } from "../contexts/websocket";
import { TurtleIdContext } from "../contexts/turtleId";
import { CameraDirectionContext } from "../contexts/camera-direction";

export default function KeyboardControls(){
    const websocket = useContext(WebsocketContext)
    const [turtleId, _setTurtleId] = useContext(TurtleIdContext)
    const [getCameraDirection, _setCameraDirectionGetter] = useContext(CameraDirectionContext)

    useEffect(() => {
        window.onkeyup = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement
            if (target.nodeName.toLowerCase() != 'body') return
            if (turtleId == null) return
            
            switch (event.key) {
                case 'w':
                    websocket.send(JSON.stringify({type: 'go', direction: 'forward', id: turtleId}))
                    break
                case 'a':
                    websocket.send(JSON.stringify({type: 'go', direction: 'left', id: turtleId}))
                    break;
                case 's':
                    websocket.send(JSON.stringify({type: 'go', direction: 'back', id: turtleId}))
                    break
                case 'd':
                    websocket.send(JSON.stringify({type: 'go', direction: 'right', id: turtleId}))
                    break
                case 'Shift':
                    websocket.send(JSON.stringify({type: 'go', direction: 'up', id: turtleId}))
                    break
                case 'Control':
                    websocket.send(JSON.stringify({type: 'go', direction: 'down', id: turtleId}))
                    break
                case 'q':
                    websocket.send(JSON.stringify({type: 'left click', direction: getCameraDirection(3), id: turtleId}))
                    break
                case 'e':
                    websocket.send(JSON.stringify({type: 'right click', direction: getCameraDirection(3), id: turtleId}))
                    break
                case 'f':
                    websocket.send(JSON.stringify({type: 'suck', direction: 'all', id: turtleId}))
                    break
            }
        }
    }, [websocket, turtleId])

    return null
}