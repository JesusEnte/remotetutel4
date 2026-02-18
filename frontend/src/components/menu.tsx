import menu_icon from '../assets/menu_icon.png'
import chest_icon from '../assets/chest_icon.png'
import { useContext, type CSSProperties } from 'react'
import { TurtlesContext } from '../contexts/turtles'
import { TurtleIdContext } from '../contexts/turtleId'


export default function Menu({style}: {style?: CSSProperties}){
    const [turtles, _setTurtles] = useContext(TurtlesContext)
    const [turtleId, _setTurtleId] = useContext(TurtleIdContext)
    const turtle = turtleId ? turtles[turtleId] : null

    return <div style={{
        position: 'absolute',
        height: '5svh',
        ...style
    }}>
        {turtle?.status != 'online' ? null :
            <img src={chest_icon} style={{height: '100%'}}/>
        }
        <img src={menu_icon} style={{height: '100%'}}/>
    </div>
}