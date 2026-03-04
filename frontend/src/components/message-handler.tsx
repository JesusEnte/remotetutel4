import { useEffect, useContext } from "react"
import { WebsocketContext } from "../contexts/websocket"
import { TurtlesContext } from "../contexts/turtles"
import { type Blocks } from "../types/block"
import { TurtleIdContext } from "../contexts/turtleId"
import type { InventoryInfo } from "../types/inventory"
import type { ChestInfo } from "../types/chest"

interface MessageHandlerProps {
    blocks: Blocks
    setBlocks: (b: Blocks) => void
    setChest: (c: ChestInfo) => void
    setInventory: (i: InventoryInfo) => void
}

export default function MessageHandler(props: MessageHandlerProps){

    const {blocks, setBlocks, setChest, setInventory} = props
    const websocket = useContext(WebsocketContext)
    const [turtleId, _setTurtleId] = useContext(TurtleIdContext)
    const [turtles, setTurtles] = useContext(TurtlesContext)
    const turtle = turtleId ? turtles[turtleId] : null

    websocket.onmessage = (ev: MessageEvent) => {
        const message = JSON.parse(ev.data)
        switch (message.type) {
            case 'turtles':
                setTurtles(Object.assign(structuredClone(turtles), message.turtles))
                break
            case 'blocks':
                setBlocks(Object.fromEntries(Object.entries(Object.assign(structuredClone(blocks), message.blocks as Blocks)).filter(([_k, v]) => v.name != null)))
                break
            case 'inventory':
                setInventory(message.inventory)
                break
            case 'chest':
                setChest(message.chest)
                break
            case 'interpreter response':
                alert(`Interpreter response:\n${JSON.stringify(message.response)}`)
                break
            default:
                console.log(message)
        }
    }

    useEffect(() => {
        websocket.send(JSON.stringify({type: 'get turtles'}))
        websocket.send(JSON.stringify({type: 'get blocks'}))
    }, [])

    useEffect(() => {
        if (turtle?.status == 'online') websocket.send(JSON.stringify({type: 'get inventory', id: turtleId}))
    }, [turtleId, turtle?.status])

    return null
}