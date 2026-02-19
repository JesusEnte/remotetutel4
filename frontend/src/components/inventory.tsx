import { InventoryContext } from "../contexts/intentory"
import { useContext, type CSSProperties} from "react"
import { TurtleIdContext } from "../contexts/turtleId"
import { WebsocketContext } from "../contexts/websocket"
import { InventoryActionCountContext } from "../contexts/inventory-action-count"
import { CameraDirectionContext } from "../contexts/camera-direction"
import craft_icon from '../assets/craft_icon.png'
import fuel_icon from '../assets/fuel_icon.png'
import drop_icon from '../assets/drop_icon.png'


function SlotContainer(props: any){
    return <div
    {...props}
    style={{
        width: '90%',
        aspectRatio: 1,
        textAlign: 'center',
        placeContent: 'center center',
        border: '2px solid black',
        borderRadius: '5px',
        ...props.style,
    }}
    >
        {props.children}
    </div>
}

interface ItemProps {
    name?: string
    count?: number
    color?: number
    slot: string
    selected: string
}
function Item(props: ItemProps){
    const websocket = useContext(WebsocketContext)
    const [turtleId, _setTurtleId] = useContext(TurtleIdContext)
    const [count, _setCount]= useContext(InventoryActionCountContext)

    return <SlotContainer
        onClick={() => {
            websocket.send(JSON.stringify({type: 'set selected', slot: props.slot, id: turtleId}))
        }}
        style={{
            ...(props.color != undefined) && {backgroundColor: `rgba(${(props.color >> 16 & 255)}, ${props.color >> 8 & 255}, ${props.color & 255}, 0.8)`},
            ...(props.slot == props.selected && {border: '2px solid white'})
        }}
        title={`${props.slot}: ${props.name || 'empty'}`}
        draggable

        onDragStart={(event: React.DragEvent) => {
            event.dataTransfer.setData('text', `Slot ${props.slot}`)
        }}
        onDragOver={(event: React.DragEvent) => {
            event.preventDefault()
        }}
        onDrop={(event: React.DragEvent) => {
            const start = event.dataTransfer.getData('text')
            if (start.includes('Slot')){
                const from = start.slice(start.indexOf('Slot') + 5)
                const to = props.slot
                websocket.send(JSON.stringify({type: 'transferTo', from: from, to: to, count: count, id: turtleId}))
            }
        }}
    >
        <p style={{userSelect: 'none'}}>{props.count || 0}</p>
    </SlotContainer>
}


function ActionCount(){
    const [count, setCount] = useContext(InventoryActionCountContext)
    return <SlotContainer
        style={{backgroundColor: 'rgba(255, 255, 255, 0.8)'}}
        onClick={() => {
            setCount((count * 2) % 127)
        }}
    >
        <p style={{userSelect: 'none', color: 'black'}}>{count}</p>
    </SlotContainer>
}


function Craft(){
    const [count, _setCount] = useContext(InventoryActionCountContext)
    const websocket = useContext(WebsocketContext)
    const [turtleId, _setTurtleId] = useContext(TurtleIdContext)

    return <SlotContainer
        onClick={() => {
            websocket.send(JSON.stringify({type: 'craft', id: turtleId, count: count}))
        }}
    >
        <img src={craft_icon} style={{width: '70%', height: '70%'}}/>
    </SlotContainer>
}

function Fuel(){
    const [count, _setCount] = useContext(InventoryActionCountContext)
    const websocket = useContext(WebsocketContext)
    const [turtleId, _setTurtleId] = useContext(TurtleIdContext)

    return <SlotContainer
        onDragOver={(event: React.DragEvent) => {
            event.preventDefault()
        }}
        onDrop={(event: React.DragEvent) => {
            const start = event.dataTransfer.getData('text')
            if (start.includes('Slot')){
                const slot = start.slice(start.indexOf('Slot') + 5)
                websocket.send(JSON.stringify({type: 'refuel', slot: slot, count: count, id: turtleId}))
            }
        }}
    >
       <img src={fuel_icon} style={{width: '70%', height: '70%'}}/>
    </SlotContainer>
}

function Drop(){
    const [count, _setCount] = useContext(InventoryActionCountContext)
    const websocket = useContext(WebsocketContext)
    const [turtleId, _setTurtleId] = useContext(TurtleIdContext)
    const [getCameraDirection, _setCameraDirectionGetter] = useContext(CameraDirectionContext)

    return <SlotContainer
        onDragOver={(event: React.DragEvent) => {
            event.preventDefault()
        }}
        onDrop={(event: React.DragEvent) => {
            const start = event.dataTransfer.getData('text')
            if (start.includes('Slot')){
                const slot = start.slice(start.indexOf('Slot') + 5)
                websocket.send(JSON.stringify({type: 'drop', slot: slot, count: count, id: turtleId, direction: getCameraDirection(3)}))
            }
        }}
    >
        <img src={drop_icon} style={{width: '70%', height: '70%'}}/>
    </SlotContainer>
}

export default function Inventory({style}: {style?: CSSProperties}){
    const [inventory, _setInventory] = useContext(InventoryContext)
    if (!inventory) return null

    return <div
        style={{
            height: '100%',
            display: 'grid',
            gridTemplateRows: '90% 10%',
            borderRadius: '5px',
            ...style
        }}
    >
        <div
            style={{
                display: 'grid',
                gridTemplate: 'repeat(4, 1fr) / repeat(5, 1fr)',
                placeItems: 'center center',
                aspectRatio: 5 / 4,
                height: '100%',
                maxWidth: '100%',
            }}
        >
            <ActionCount/>
            {[...Array(4)].map((_v, i) => {
                const slot = inventory[i + 1]
                return <Item slot={(i + 1).toString()} {...slot} selected={inventory.selected} key={i + 1}/>
            })}
            <Craft/>
            {[...Array(4)].map((_v, i) => {
                const slot = inventory[i + 5]
                return <Item slot={(i + 5).toString()} {...slot} selected={inventory.selected} key={i + 1}/>
            })}
            <Fuel/>
            {[...Array(4)].map((_v, i) => {
                const slot = inventory[i + 9]
                return <Item slot={(i + 9).toString()} {...slot} selected={inventory.selected} key={i + 1}/>
            })}
            <Drop/>
            {[...Array(4)].map((_v, i) => {
                const slot = inventory[i + 13]
                return <Item slot={(i + 13).toString()} {...slot} selected={inventory.selected} key={i + 1}/>
            })}
        </div>
        <p style={{justifySelf: 'flex-end', lineBreak: 'anywhere'}}>{inventory.selected}: {inventory[inventory.selected].name || 'empty'}</p>
    </div>
    
}