import { useContext } from 'react'
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

export default function Actions(){
    const websocket = useContext(WebsocketContext)
    const [turtles, _setTurtles] = useContext(TurtlesContext)
    const [turtleId, _setTurtleId] = useContext(TurtleIdContext)
    const [getCameraDirection, _setCameraDirectionGetter] = useContext(CameraDirectionContext)
    const turtle = turtleId ? turtles[turtleId] : null

    if (turtle == null || turtle.status != 'online') return null

    return <div
        style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            height: '25svh',
            aspectRatio: 1,
            display: 'grid',
            gridTemplateRows: '1fr 1fr 1fr',
            gridTemplateColumns: '1fr 1fr 1fr',
            justifyItems: 'center',
            alignItems: 'center'
        }}
    >
        <div/>
        <img style={{width: '100%'}} src={forward_icon} onClick={() => {websocket.send(JSON.stringify({type: 'go', direction: 'forward', id: turtleId}))}}/>
        <img style={{width: '60%'}} src={right_click_icon} onClick={() => {websocket.send(JSON.stringify({type: 'right click', direction: getCameraDirection(3), id: turtleId}))}}/>
        <img style={{width: '100%'}} src={left_icon} onClick={() => {websocket.send(JSON.stringify({type: 'go', direction: 'left', id: turtleId}))}}/>
        <img style={{width: '60%'}} src={vertical_icon} onClick={() => {websocket.send(JSON.stringify({type: 'go', direction: getCameraDirection(2), id: turtleId}))}}/>
        <img style={{width: '100%'}} src={right_icon} onClick={() => {websocket.send(JSON.stringify({type: 'go', direction: 'right', id: turtleId}))}}/>
        <img style={{width: '60%'}} src={left_click_icon} onClick={() => {websocket.send(JSON.stringify({type: 'left click', direction: getCameraDirection(3), id: turtleId}))}}/>
        <img style={{width: '100%'}} src={back_icon} onClick={() => {websocket.send(JSON.stringify({type: 'go', direction: 'back', id: turtleId}))}}/>
        <img style={{width: '60%'}} src={suck_icon} onClick={() => {websocket.send(JSON.stringify({type: 'suck', direction: 'all', id: turtleId}))}}/>
    </div>
}