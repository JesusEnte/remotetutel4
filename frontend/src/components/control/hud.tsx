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

function ATJ(props: any){
    const defaultValue = props.defaultValue

    return <input
        type='text'
        style={{
            border: '0px',
            borderRadius: '5px',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            margin: 0,
            padding: 0,
            width: `${defaultValue.length + 1}ch`,
            textAlign: 'center'
        }}
        {...props}
        onInput={(ev: React.InputEvent<HTMLInputElement>) => {
            const target = ev.target as HTMLInputElement
            target.style.width = `${target.value.length + 1}ch`
            
        }}
    />
}

export default function Hud(props: HudProps){
    const shared = props.sharedRef.current
    const [selectedTurtleId, setSelectedTurtleId] = useState<string|null>(null)
    const [turtles, setTurtles] = useState<Turtles>({})
    const [inventory, setInventory] = useState<Inventory>({})
    console.log(inventory)
    shared.selectedTurtleId = selectedTurtleId
    shared.hudFuncs = {setTurtles, setSelectedTurtleId, setInventory}

    const selectedTurtle = selectedTurtleId ? turtles[selectedTurtleId] : null

    const infos = {x: '?', y: '?', z: '?', dir: '?', fuel: '?'}

    if (selectedTurtle){
        infos.x = selectedTurtle.x?.toString() || '?'
        infos.y = selectedTurtle.y?.toString() || '?'
        infos.z = selectedTurtle.z?.toString() || '?'
        infos.dir = ['n', 'e', 's', 'w'][selectedTurtle.dir] || '?'
        infos.fuel = selectedTurtle.fuel?.toString() || '?'
    }


    return <>
        <div style={{
            ...props.style,
            left: 0,
            top: 0,
        }}>
            <select
                style={{
                    width: '100%'
                }}
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
            {selectedTurtle ? <p>
                🌎&nbsp;
                <ATJ defaultValue={infos.x}/>
                &nbsp;<ATJ defaultValue={infos.y}/>
                &nbsp;<ATJ defaultValue={infos.z}/>
                &nbsp;🧭&nbsp;
                <ATJ defaultValue={infos.dir}/>
                &nbsp;⛽ {infos.fuel}
            </p> : null}
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