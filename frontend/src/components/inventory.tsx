import { InventoryContext } from "../contexts/intentory"
import { useContext, useState } from "react"


function SlotContainer(props: any){
    return <div
    {...props}
    style={{
        ...props.style,
        height: '90%',
        aspectRatio: 1,
        textAlign: 'center',
        alignContent: 'center',
        border: '1px solid white',
        borderRadius: '5px',
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
}
function Item(props: ItemProps){
    let bg = 'unset'
    if (props.color != undefined){
        bg = `rgba(${(props.color >> 16 & 255)}, ${props.color >> 8 & 255}, ${props.color & 255}, 0.8)`
    }
    return <SlotContainer
        draggable='true'
        style={{
            backgroundColor: bg
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
        onClick={() => {
            props.setCount((props.count * 2) % 127)
        }}
    >
        <p style={{userSelect: 'none'}}>{props.count}</p>
    </SlotContainer>
}


export default function Inventory(){
    const [inventory, _setInventory] = useContext(InventoryContext)
    const [count, setCount] = useState<number>(1)

    if (inventory == null) return null
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
            return <Item slot={(i + 1).toString()} {...slot}/>
        })}
        <div/>
        {[...Array(4)].map((_v, i) => {
            const slot = inventory[i + 5]
            return <Item slot={(i + 5).toString()} {...slot}/>
        })}
        <Item slot={'left_hand'} {...inventory.left_hand}/>
        {[...Array(4)].map((_v, i) => {
            const slot = inventory[i + 9]
            return <Item slot={(i + 5).toString()} {...slot}/>
        })}
        <Item slot={'left_hand'} {...inventory.right_hand}/>
        {[...Array(4)].map((_v, i) => {
            const slot = inventory[i + 13]
            return <Item slot={(i + 5).toString()} {...slot}/>
        })}
    </div>
    
}