import menu_icon from '../assets/menu_icon.png'
import inventory_icon from '../assets/inventory_icon.png'
import { useContext } from 'react'
import { TurtlesContext } from '../contexts/turtles'
import { TurtleIdContext } from '../contexts/turtleId'
import { WebsocketContext } from '../contexts/websocket'
import { CameraDirectionContext } from '../contexts/camera-direction'


export default function Menu(){
    const [turtles, _setTurtles] = useContext(TurtlesContext)
    const [turtleId, _setTurtleId] = useContext(TurtleIdContext)
    const [getCameraDirection, _setCameraDirectionGetter] = useContext(CameraDirectionContext)
    const websocket = useContext(WebsocketContext)
    const turtle = turtleId ? turtles[turtleId] : null

    return <div style={{
        position: 'absolute',
        right: 0,
        top: 0,
        aspectRatio: 1/2,
        height: '10svh'
    }}>
        <img src={menu_icon} style={{width: '100%'}}/>
        {turtle?.status == 'online' ?
            <img src={inventory_icon} style={{width: '100%'}} onClick={() => {websocket.send(JSON.stringify({type: 'get inventories', direction: getCameraDirection(3), id: turtleId}))}}/>
        : null}
    </div>
}