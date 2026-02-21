import { useContext, type CSSProperties } from "react"
import { ChestContext } from "../contexts/chest"
import { TooltipContext } from "../contexts/tooltip-props"
import { InventoryActionCountContext } from "../contexts/inventory-action-count"
import { WebsocketContext } from "../contexts/websocket"
import { TurtleIdContext } from "../contexts/turtleId"
import { string_to_hue } from "../utils/colors"

export default function Chest({style}: {style?: CSSProperties}){
    const [chest, setChest] = useContext(ChestContext)
    const setTooltip = useContext(TooltipContext)
    const [actionCount, _setActionCount] = useContext(InventoryActionCountContext)
    const websocket = useContext(WebsocketContext)
    const [turtleId, _setTurtleId] = useContext(TurtleIdContext)

    return <div
        style={{
            display: 'grid',
            gridTemplateRows: '10% 90%',
            width: 'calc(100% - 10px)',
            height: 'calc(100% - 10px)',
            border: '3px solid white',
            borderRadius: '5px',
            ...style
        }}
    >
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'grid',
                gridTemplateColumns: '100% 0%',
                borderBottom: '2px solid white'
            }}
        >
            <p style={{placeSelf: 'center center'}}>{chest!.name} <span title="Limited Functionality due to in-game constraints, e.g. furnaces wont't work properly">🛈</span></p>
            <button 
                onClick = {() => {
                    setChest(null)
                }}
                style={{placeSelf: 'center flex-end', 
                    color: 'red', 
                    aspectRatio: 1, 
                    height: '100%', 
                    background: 'transparent',
                    borderLeft: '3px solid white',
                    borderTop: 'none', borderRight: 'none', borderBottom: 'none'
                }}
            >
                X
            </button>
        </div>

        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                maxWidth: '100%',
                maxHeight: '100%',
                gap: '2px',
                placeContent: 'flex-start flex-start',
                padding: '3px'
            }}
            onDragOver={(event: React.DragEvent) => {
                event.preventDefault()
            }}
            onDrop={(event: React.DragEvent) => {
                const start = event.dataTransfer.getData('text')
                if (start.includes('Slot ')){
                    const from = start.slice('Slot '.length)
                    websocket.send(JSON.stringify({type: 'push to chest', direction: chest!.direction, from: from, count: actionCount, id: turtleId}))
                }
            }}
        >
            {[...Array(chest!.size)].map((_v, i) => {
                const slot = i + 1
                const name = chest!.inventory.at(i) == undefined ? 'empty' : chest!.inventory.at(i)!.name
                const count = chest!.inventory.at(i) == undefined ? 0 : chest!.inventory.at(i)!.count
                const hue = name != 'empty' ? string_to_hue(name) : undefined
                return <p
                    key={slot}
                    style={{
                        ...(hue != undefined && {backgroundColor: `hsla(${hue}, 80%, 50%, 0.8)`}),
                        aspectRatio: 1,
                        height: '4ch',
                        textAlign: 'center',
                        placeContent: 'center center',
                        border: '2px solid white',
                        userSelect: 'none'
                    }}
                    title={`${slot}: ${name}`}
                    onClick={(event: React.MouseEvent<HTMLParagraphElement>) => {
                        setTooltip({x: event.clientX, y: event.clientY, time: 1500, text: `${slot}: ${name}`})
                    }}
                    draggable
                    onDragStart={(event: React.DragEvent) => {
                        event.dataTransfer.setData('text', `Chest ${slot}`)
                    }}
                    onDragOver={(event: React.DragEvent) => {
                        event.preventDefault()
                    }}
                    onDrop={(event: React.DragEvent) => {
                        const start = event.dataTransfer.getData('text')
                        if (start.includes('Slot ')){
                            const from = start.slice('Slot '.length)
                            websocket.send(JSON.stringify({type: 'push to chest', direction: chest!.direction, from: from, count: actionCount, id: turtleId}))
                        } else if (start.includes('Chest ')){
                            const from = start.slice('Chest '.length)
                            const to = slot
                            websocket.send(JSON.stringify({type: 'move in chest', direction: chest!.direction, from: from, count: actionCount, to: to, id: turtleId}))
                        }
                    }}
                >
                    {count}
                </p>
            })}
        </div>
    </div>
}