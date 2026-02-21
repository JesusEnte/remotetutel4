import { useContext, type CSSProperties } from 'react'
import { WebsocketContext } from '../contexts/websocket'
import { TurtlesContext } from '../contexts/turtles'
import { TurtleIdContext } from '../contexts/turtleId'
import forward_icon from '../assets/forward_icon.png'
import right_click_icon from '../assets/right_click_icon.png'
import left_icon from '../assets/left_icon.png'
import vertical_icon from '../assets/vertical_icon.png'
import right_icon from '../assets/right_icon.png'
import left_click_icon from '../assets/left_click_icon.png'
import back_icon from '../assets/back_icon.png'
import suck_icon from '../assets/suck_icon.png'
import { CameraDirectionContext } from '../contexts/camera-direction'

export default function Actions({style}: {style?: CSSProperties}){
    const websocket = useContext(WebsocketContext)
    const [turtles, _setTurtles] = useContext(TurtlesContext)
    const [turtleId, _setTurtleId] = useContext(TurtleIdContext)
    const [getCameraDirection, _setCameraDirectionGetter] = useContext(CameraDirectionContext)
    const turtle = turtleId ? turtles[turtleId] : null

    if (turtle == null || turtle.status != 'online') return null

    return <div
        className="hud-container"
        style={{
            aspectRatio: 1,
            display: 'grid',
            gridTemplate: 'repeat(3, 1fr) / repeat(3, 1fr)',
            justifyItems: 'center',
            alignItems: 'center',
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'max-content',
            height: 'max-content',
            ...style
        }}
    >
        <div/>
        <img style={{maxWidth: '100%', maxHeight: '100%'}} src={forward_icon} onClick={() => {websocket.send(JSON.stringify({type: 'go', direction: 'forward', id: turtleId}))}}/>
        <img style={{maxWidth: '60%', maxHeight: '60%'}} src={right_click_icon} onClick={() => {websocket.send(JSON.stringify({type: 'right click', direction: getCameraDirection(3), id: turtleId}))}}/>
        <img style={{maxWidth: '100%', maxHeight: '100%'}} src={left_icon} onClick={() => {websocket.send(JSON.stringify({type: 'go', direction: 'left', id: turtleId}))}}/>
        <img style={{maxWidth: '60%', maxHeight: '60%'}} src={vertical_icon} onClick={() => {websocket.send(JSON.stringify({type: 'go', direction: getCameraDirection(2), id: turtleId}))}}/>
        <img style={{maxWidth: '100%', maxHeight: '100%'}} src={right_icon} onClick={() => {websocket.send(JSON.stringify({type: 'go', direction: 'right', id: turtleId}))}}/>
        <img style={{maxWidth: '60%', maxHeight: '60%'}} src={left_click_icon} onClick={() => {websocket.send(JSON.stringify({type: 'left click', direction: getCameraDirection(3), id: turtleId}))}}/>
        <img style={{maxWidth: '100%', maxHeight: '100%'}} src={back_icon} onClick={() => {websocket.send(JSON.stringify({type: 'go', direction: 'back', id: turtleId}))}}/>
        <img style={{maxWidth: '60%', maxHeight: '60%'}} src={suck_icon} onClick={() => {websocket.send(JSON.stringify({type: 'suck', direction: 'all', id: turtleId}))}}/>
    </div>
}