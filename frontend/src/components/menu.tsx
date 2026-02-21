import chest_icon from '../assets/chest_icon.png'
import filter_icon from '../assets/filter_icon.png'
import interpreter_icon from '../assets/interpreter_icon.png'
import { useContext, type CSSProperties } from 'react'
import { TurtlesContext } from '../contexts/turtles'
import { TurtleIdContext } from '../contexts/turtleId'
import { WebsocketContext } from '../contexts/websocket'
import { CameraDirectionContext } from '../contexts/camera-direction'

interface MenuProps {
    style?: CSSProperties
    menu: string | null
    setMenu: (menu: string | null) => void
}
export default function Menu(props: MenuProps){
    const [turtles, _setTurtles] = useContext(TurtlesContext)
    const [turtleId, _setTurtleId] = useContext(TurtleIdContext)
    const turtle = turtleId ? turtles[turtleId] : null
    const websocket = useContext(WebsocketContext)
    const [getTurtleDirection, _getTurtleDirectionSetter] = useContext(CameraDirectionContext)
    const [menu, setMenu] = [props.menu, props.setMenu]

    return <div style={{
        ...props.style
    }}>
        {turtle?.status != 'online' ? null :
            <img src={chest_icon} style={{height: '100%'}} onClick={() => {websocket.send(JSON.stringify({type: 'get chest', id: turtleId, direction: getTurtleDirection(3)}))}}/>
        }
        {turtle?.status != 'online' ? null :
            <img src={interpreter_icon} style={{height: '100%'}} onClick={() => {
                if (menu != 'interpreter') {
                    setMenu('interpreter')
                } else {
                    setMenu(null)
                }
            }}/>
        }
        <img src={filter_icon} style={{height: '100%'}} onClick={() => {
            if (menu != 'filter') {
                setMenu('filter')
            } else {
                setMenu(null)
            }
        }}/>
    </div>
}