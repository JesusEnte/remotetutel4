import type { Shared, Turtles } from "../control"
import { useState } from "react"

interface HudProps {
    sharedRef: React.RefObject<Shared>,
    style: React.CSSProperties
}

export interface HudFuncs {
    setTurtles(turtles: Turtles): void,
    setSelectedTurtleId(id: string): void
    setInventory(inventory: Inventory): void
}

interface Slot {
    item: string,
    amount: number 
}
type Inventory = Record<number, Slot>

export default function Hud(props: HudProps){
    const shared = props.sharedRef.current
    const [selectedTurtleId, setSelectedTurtleId] = useState<string|null>(null)
    const [turtles, setTurtles] = useState<Turtles>({})
    const [inventory, setInventory] = useState<Inventory>({})
    
    shared.selectedTurtleId = selectedTurtleId
    shared.hudFuncs = {setTurtles, setSelectedTurtleId, setInventory}

    return <>
        <div style={{
            ...props.style,
            left: 0,
            top: 0,
            width: '10svw',
            height: '5svh',
            backgroundColor: 'red',
        }}>
            <select
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const id = e.target.value
                    setSelectedTurtleId(id)
                    shared.threeFuncs.setTarget(id)
                }}
            >
                {[<option disabled={selectedTurtleId != null} key=''>-- select a Tutel --</option>].concat(
                    Array.from(Object.entries(turtles)).map(([id, turtle]) => {
                        return <option key={id} value={id}>#{id}: {turtle.status}</option>
                    }))
                }
            </select>
        </div>

        <div style={{
            ...props.style,
            right: 0,
            top: 0,
        }}>
            <button>tr</button>
        </div>

        <div style={{
            ...props.style,
            right: 0,
            bottom: 0,
        }}>
            <button>br</button>
        </div>
    </> 
}