import { InventoryContext } from "../contexts/intentory"
import { useContext, useState } from "react"
import { TurtlesContext } from "../contexts/turtles"
import { TurtleIdContext } from "../contexts/turtleId"
import { WebsocketContext } from "../contexts/websocket"


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

    let bg = 'unset'
    if (props.color != undefined) bg = `rgba(${(props.color >> 16 & 255)}, ${props.color >> 8 & 255}, ${props.color & 255}, 0.8)`

    let border = '1px solid white'
    if (props.slot == props.selected) border = '3px solid white'
    return <SlotContainer
        onClick={() => {
            websocket.send(JSON.stringify({type: 'set selected', slot: props.slot, id: turtleId}))
        }}
        draggable='true'
        style={{
            backgroundColor: bg,
            border: border
        }}
        title={`${props.slot}: ${props.name || 'empty'}`}
    >
        <p style={{userSelect: 'none'}}>{props.count || 0}</p>
    </SlotContainer>
}

interface ActionCountProps {
    count: number,
    setCount: (n: number) => void
}
function ActionCount(props: ActionCountProps){
    return <SlotContainer
        style={{
            backgroundColor: `hsl(${(props.count * 100) % 360}, 100%, 40%)`
        }}
        onClick={() => {
            props.setCount((props.count * 2) % 127)
        }}
    >
        <p style={{userSelect: 'none'}}>Count<br/>{props.count}</p>
    </SlotContainer>
}


export default function Inventory(){
    const [inventory, _setInventory] = useContext(InventoryContext)
    const [turtles, _setTurtles] = useContext(TurtlesContext)
    const [turtleId, _setTurtleId] = useContext(TurtleIdContext)
    const [count, setCount] = useState<number>(1)
    const turtle = turtleId ? turtles[turtleId] : null

    if (inventory == null || turtle == null || turtle.status == 'offline') return null
    return <div
        style={{
            display: 'grid',
            gridTemplateRows: 'repeat(4, 1fr)',
            gridTemplateColumns: 'repeat(5, 1fr)',
            aspectRatio: 5 / 4,
            gap: '2px',
            height: '25svh'
        }}
    >
        <ActionCount count={count} setCount={setCount}/>
        {[...Array(4)].map((_v, i) => {
            const slot = inventory[i + 1]
            return <Item slot={(i + 1).toString()} {...slot} selected={inventory.selected}/>
        })}
        <div/>
        {[...Array(4)].map((_v, i) => {
            const slot = inventory[i + 5]
            return <Item slot={(i + 5).toString()} {...slot} selected={inventory.selected}/>
        })}
        <div/>
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
    
}