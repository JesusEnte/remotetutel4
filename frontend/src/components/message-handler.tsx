import { useEffect, useContext } from "react"
import { WebsocketContext } from "../contexts/websocket"
import { TurtlesContext } from "../contexts/turtles"
import { BlocksContext, type Blocks } from "../contexts/blocks"

export default function MessageHandler(){

    const websocket = useContext(WebsocketContext)
    const [turtles, setTurtles] = useContext(TurtlesContext)
    const [blocks, setBlocks] = useContext(BlocksContext)

    function websocket_message_handler(ev: MessageEvent){
        const message = JSON.parse(ev.data)
        switch (message.type) {
            case 'turtles':
                setTurtles(Object.assign(structuredClone(turtles), message.turtles))
                break
            case 'blocks':
                const clone = structuredClone(blocks)
                for (const [key, block] of Object.entries(message.blocks as Blocks)) {
                    if (block.name == null){
                        delete clone[key]
                    } else {
                        clone[key] = block
                    }
                }
                setBlocks(clone)
                break
            case 'inventories':
                console.log(message.inventories)
        }
    }

    websocket.onmessage = websocket_message_handler

    useEffect(() => {
        websocket.send(JSON.stringify({type: 'get turtles'}))
        websocket.send(JSON.stringify({type: 'get blocks'}))
    }, [websocket])

    return null
}