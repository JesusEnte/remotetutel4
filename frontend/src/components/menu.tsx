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
        position: 'absolute',
        right: 0,
        top: 0,
        aspectRatio: 1/2,
        height: '10svh'
    }}>
        <img src={menu_icon} style={{width: '100%'}}/>
        {turtle?.status == 'online' ?
            <img src={chest_icon} style={{width: '100%'}}/>
        : null}
    </div>
}