import menu_icon from '../assets/menu_icon.png'
import chest_icon from '../assets/chest_icon.png'
import { useContext } from 'react'
import { TurtlesContext } from '../contexts/turtles'
import { TurtleIdContext } from '../contexts/turtleId'


export default function Menu(){
    const [turtles, _setTurtles] = useContext(TurtlesContext)
    const [turtleId, _setTurtleId] = useContext(TurtleIdContext)
    const turtle = turtleId ? turtles[turtleId] : null

    return <div style={{
        height: '5svh',
        display: 'flex',
        justifyContent: 'right'
    }}>
        {turtle?.status != 'online' ? null :
            <img src={chest_icon} style={{height: '100%'}}/>
        }
        <img src={menu_icon} style={{height: '100%'}}/>
    </div>
}