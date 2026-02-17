import { InventoryContext } from "../contexts/intentory"
import { useContext } from "react"
import { TurtlesContext } from "../contexts/turtles"
import { TurtleIdContext } from "../contexts/turtleId"
import { WebsocketContext } from "../contexts/websocket"
import { InventoryActionCountContext } from "../contexts/inventory-action-count"


function SlotContainer(props: any){
    return <div
    {...props}
    style={{
        height: '90%',
        aspectRatio: 1,
        textAlign: 'center',
        alignContent: 'center',
        border: '1px solid white',
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

    let bg = 'unset'
    if (props.color != undefined) bg = `rgba(${(props.color >> 16 & 255)}, ${props.color >> 8 & 255}, ${props.color & 255}, 0.8)`

    let border = '1px solid white'
    if (props.slot == props.selected) border = '3px solid white'
    return <SlotContainer
        onClick={() => {
            websocket.send(JSON.stringify({type: 'set selected', slot: props.slot, id: turtleId}))
        }}
        style={{
            backgroundColor: bg,
            border: border
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
        style={{
            backgroundColor: `hsl(${(count * 100) % 360}, 100%, 40%)`
        }}
        onClick={() => {
            setCount((count * 2) % 127)
        }}
    >
        <p style={{userSelect: 'none'}}>Count<br/>{count}</p>
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
        <p style={{userSelect: 'none'}}>Craft</p>
    </SlotContainer>
}

function Refuel(){
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
        <p style={{userSelect: 'none'}}>Refuel</p>
    </SlotContainer>
}


export default function Inventory(){
    const [inventory, _setInventory] = useContext(InventoryContext)
    const [turtles, _setTurtles] = useContext(TurtlesContext)
    const [turtleId, _setTurtleId] = useContext(TurtleIdContext)
    const turtle = turtleId ? turtles[turtleId] : null

    if (inventory == null || turtle == null || turtle.status == 'offline') return null
    return <>
    <div
        style={{
            display: 'grid',
            gridTemplateRows: 'repeat(4, 1fr)',
            gridTemplateColumns: 'repeat(5, 1fr)',
            aspectRatio: 5 / 4,
            gap: '2px',
            height: '25svh'
        }}
    >
        <ActionCount/>
        {[...Array(4)].map((_v, i) => {
            const slot = inventory[i + 1]
            return <Item slot={(i + 1).toString()} {...slot} selected={inventory.selected}/>
        })}
        <Craft/>
        {[...Array(4)].map((_v, i) => {
            const slot = inventory[i + 5]
            return <Item slot={(i + 5).toString()} {...slot} selected={inventory.selected}/>
        })}
        <Refuel/>
        {[...Array(4)].map((_v, i) => {
            const slot = inventory[i + 9]
            return <Item slot={(i + 9).toString()} {...slot} selected={inventory.selected}/>
        })}
        <div/>
        {[...Array(4)].map((_v, i) => {
            const slot = inventory[i + 13]
            return <Item slot={(i + 13).toString()} {...slot} selected={inventory.selected}/>
        })}
    </div>
    <p style={{textAlign: 'right', marginRight: '1%'}}>{inventory.selected}: {inventory[inventory.selected].name || 'empty'}</p>
    </>
    
}