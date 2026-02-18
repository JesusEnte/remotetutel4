import { useEffect, useContext } from "react"
import { WebsocketContext } from "../contexts/websocket"
import { TurtlesContext } from "../contexts/turtles"
import { BlocksContext, type Blocks } from "../contexts/blocks"
import { TurtleIdContext } from "../contexts/turtleId"
import { InventoryContext } from "../contexts/intentory"
import { ChestContext } from "../contexts/chest"

export default function MessageHandler(){

    const websocket = useContext(WebsocketContext)
    const [turtleId, _setTurtleId] = useContext(TurtleIdContext)
    const [turtles, setTurtles] = useContext(TurtlesContext)
    const [blocks, setBlocks] = useContext(BlocksContext)
    const [_inventory, setInventory] = useContext(InventoryContext)
    const turtle = turtleId ? turtles[turtleId] : null
    const [_chest, setChest] = useContext(ChestContext)

    function websocket_message_handler(ev: MessageEvent){
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
            default:
                console.log(message)
        }
    }

    websocket.onmessage = websocket_message_handler

    useEffect(() => {
        websocket.send(JSON.stringify({type: 'get turtles'}))
        websocket.send(JSON.stringify({type: 'get blocks'}))
    }, [websocket])

    useEffect(() => {
        if (turtle?.status == 'online') websocket.send(JSON.stringify({type: 'get inventory', id: turtleId}))
    }, [turtleId])

    return null
}