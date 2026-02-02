import type { Shared, Turtles } from "../control"
import { useState } from "react"
import forward_icon from './assets/forward_icon.png'
import right_click_icon from './assets/right_click_icon.png'
import left_icon from './assets/left_icon.png'
import vertical_icon from './assets/vertical_icon.png'
import right_icon from './assets/right_icon.png'
import left_click_icon from './assets/left_click_icon.png'
import back_icon from './assets/back_icon.png'
import suck_icon from './assets/suck_icon.png'

interface HudProps {
    sharedRef: React.RefObject<Shared>
    style: React.CSSProperties
}

export interface HudFuncs {
    updateTurtles(turtles: Turtles): void
    setSelectedTurtleId(id: string): void
    setInventory(inventory: Inventory): void
}

interface Slot {
    item: string
    amount: number 
}
type Inventory = Record<number, Slot>

function ATI(props: any){
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
    const [turtles, _setTurtles] = useState<Turtles>({})
    function updateTurtles(ts: Turtles){
        const clone = structuredClone(turtles)
        for (const [id, t] of Object.entries(ts)){
            clone[id] = t
        }
        _setTurtles(clone)
    }
    const [inventory, setInventory] = useState<Inventory>({})
    console.log(inventory)
    shared.selectedTurtleId = selectedTurtleId
    shared.hudFuncs = {updateTurtles, setSelectedTurtleId, setInventory}
    
    const ws = shared.websocket
    
    const selectedTurtle = selectedTurtleId ? turtles[selectedTurtleId] : null
    
    function onEnterATI(ev: React.KeyboardEvent<HTMLInputElement>, property: string){
        if (ev.key != 'Enter') return
        const target = ev.target as HTMLInputElement
        const value = target.value
        switch (property){
            case 'x':
            case 'y':
            case 'z':
                ws.send(JSON.stringify({type: 'update info', id: selectedTurtleId, info: {[property]: parseInt(value, 10)}}))
                break
            case 'dir':
                let dir: number | null = ['n', 'e', 's', 'w'].indexOf(value.toLowerCase())
                if (dir == -1) dir = null
                ws.send(JSON.stringify({type: 'update info', id: selectedTurtleId, info: {[property]: dir}}))
                break
        }
    }

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
                onClick={() => {
                    ws.send(JSON.stringify({type: 'get turtles'}))
                }}
            >
                {[<option disabled={selectedTurtleId != null} key=''>-- select a Tutel --</option>].concat(
                    Array.from(Object.entries(turtles)).map(([id, turtle]) => {
                        return <option key={id} value={id}>#{id}: {turtle.status}</option>
                    }))
                }
            </select>
            {selectedTurtle ? <p key={selectedTurtleId}>
                🌎
                <ATI defaultValue={infos.x} onKeyDown={(ev: React.KeyboardEvent<HTMLInputElement>) => {onEnterATI(ev, 'x')}}/>
                &nbsp;<ATI defaultValue={infos.y} onKeyDown={(ev: React.KeyboardEvent<HTMLInputElement>) => {onEnterATI(ev, 'y')}}/>
                &nbsp;<ATI defaultValue={infos.z} onKeyDown={(ev: React.KeyboardEvent<HTMLInputElement>) => {onEnterATI(ev, 'z')}}/>
                &nbsp;🧭
                <ATI defaultValue={infos.dir} onKeyDown={(ev: React.KeyboardEvent<HTMLInputElement>) => {onEnterATI(ev, 'dir')}}/>
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

        {selectedTurtle?.status == 'online' ? 
        <div style={{
            ...props.style,
            right: '1%',
            bottom: '1%',
            aspectRatio: 1/1,
            display: 'grid',
            gridTemplateRows: '1fr 1fr 1fr',
            gridTemplateColumns: '1fr 1fr 1fr',
            height: '30svh',
            justifyItems: 'center',
            alignItems: 'center'
        }}>
            <div/>
            <img style={{width: '100%'}} src={forward_icon}/>
            <img style={{width: '60%'}} src={right_click_icon}/>
            <img style={{width: '100%'}} src={left_icon}/>
            <img style={{width: '60%'}} src={vertical_icon}/>
            <img style={{width: '100%'}} src={right_icon}/>
            <img style={{width: '60%'}} src={left_click_icon}/>
            <img style={{width: '100%'}} src={back_icon}/>
            <img style={{width: '60%'}} src={suck_icon}/>
        </div> : null}
    </> 
}