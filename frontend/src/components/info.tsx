import { useContext, useEffect } from "react"
import { TurtlesContext } from "../contexts/turtles"
import { TurtleIdContext } from "../contexts/turtleId"
import { WebsocketContext } from "../contexts/websocket"


interface TextInputProps {
    defaultValue: string
    coordinate: 'x' | 'y' | 'z' | 'dir'
}
function PrettyInput(props: TextInputProps){
    const websocket = useContext(WebsocketContext)
    const [turtleId, _setTurtleId] = useContext(TurtleIdContext)
    
    return <input
        type='text'
        defaultValue={props.defaultValue}
        style={{
            border: '0px',
            borderRadius: '5px',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            margin: 0,
            padding: 0,
            width: `${props.defaultValue.length + 1}ch`,
            textAlign: 'center'
        }}
        onKeyDown={(event: React.KeyboardEvent) => {
            if (event.key != 'Enter') return
            const target = event.target as HTMLInputElement
            switch (props.coordinate){
                case 'x':
                case 'y':
                case 'z':
                    websocket.send(JSON.stringify({type: 'update info', id: turtleId, info: {[props.coordinate]: parseInt(target.value, 10)}}))
                    break
                case 'dir':
                    let dir: number | null = ['n', 'e', 's', 'w'].indexOf(target.value.toLowerCase())
                    if (dir == -1) dir = null
                    websocket.send(JSON.stringify({type: 'update info', id: turtleId, info: {dir: dir}}))
                    break
            }
        }}
    />
}

export default function Info(){
    const [turtleId, setTurtleId] = useContext(TurtleIdContext)
    const [turtles, _setTurtles] = useContext(TurtlesContext)
    const turtle = turtleId ? turtles[turtleId] : null
    const websocket = useContext(WebsocketContext)
    
    useEffect(() => {
        if (turtleId == null && Array.from(Object.keys(turtles)).length > 0){
            setTurtleId(Array.from(Object.keys(turtles))[0])
        } 
    }, [turtles])

    return <div
        style={{
            position: 'absolute',
            left: 0,
            top: 0
        }}
    >
        <select
            style={{width: '100%'}}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setTurtleId(e.target.value)
            }}
            onFocus={() => {
                websocket.send(JSON.stringify({type: 'get turtles'}))
            }}
        >
            {Array.from(Object.entries(turtles)).map(([id, turtle]) => {
                return <option key={`${id} ${turtle.status}`}value={id}>#{id}: {turtle.status}</option>
            })}
        </select>
        {turtle == null ? null : 
            <p key={`${turtle.x} ${turtle.y} ${turtle.z} ${turtle.dir} ${turtle.fuel}`}>
                🌎
                <PrettyInput coordinate='x' defaultValue={turtle.x?.toString() || '?'}/>
                <PrettyInput coordinate='y' defaultValue={turtle.y?.toString() || '?'}/>
                <PrettyInput coordinate='z' defaultValue={turtle.z?.toString() || '?'}/>
                🧭
                <PrettyInput coordinate='dir' defaultValue={['n', 'e', 's', 'w'][turtle?.dir] || '?' }/>
                ⛽{turtle.fuel || '?'}
            </p>
        }
    </div>
}