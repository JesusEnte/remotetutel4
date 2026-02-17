import './App.css'

import { useState } from 'react'

import Login from './components/login.tsx'

import { WebsocketContext } from './contexts/websocket.ts'
import { TurtlesContext, type Turtles } from './contexts/turtles.ts'
import { BlocksContext, type Blocks } from './contexts/blocks.ts'
import { TurtleIdContext } from './contexts/turtleId.ts'
import { CameraDirectionContext } from './contexts/camera-direction.ts'
import { TooltipContext, type TooltipProps } from './contexts/tooltip-props.ts'
import { InventoryContext, type InventoryProps } from './contexts/intentory.ts'

import MessageHandler from './components/message-handler.tsx'
import World from './components/world.tsx'
import Info from './components/info.tsx'
import Actions from './components/actions.tsx'
import Tooltip from './components/tooltip.tsx'
import Menu from './components/menu.tsx'
import Inventory from './components/inventory.tsx'
import { InventoryActionCountContext } from './contexts/inventory-action-count.ts'

export default function App() {
  
  const [websocket, setWebsocket] = useState<WebSocket | null>(null)
  const [error, setError] = useState<string>('')

  const [turtles, setTurtles] = useState<Turtles>({})
  const [turtleId, setTurtleId] = useState<string | null>(null)
  const [blocks, setBlocks] = useState<Blocks>({})

  const [inventoryProps, setInventoryProps] = useState<InventoryProps | null>(null)
  const [inventoryActionCount, setInventoryActionCount] = useState<number>(1)

  const [getCameraDirection, setCameraDirectionGetter] = useState<(n: 2 | 3) => string>(null!)
  const [tooltipProps, setTooltipProps] = useState<TooltipProps | null>(null)



  if (websocket == null){  
    return <Login 
      setWebsocket={setWebsocket} 
      error={error}
      setError={setError}
    />
  }

  
  return (
    <WebsocketContext value={websocket}>
    <TurtlesContext value={[turtles, setTurtles]}>
    <BlocksContext value={[blocks, setBlocks]}>
    <TurtleIdContext value={[turtleId, setTurtleId]}>
    <CameraDirectionContext value={[getCameraDirection, setCameraDirectionGetter]}>
    <TooltipContext value={setTooltipProps}>
    <InventoryContext value={[inventoryProps, setInventoryProps]}>
    <InventoryActionCountContext value={[inventoryActionCount, setInventoryActionCount]}>


      <MessageHandler/>
      
      <World/>
      {tooltipProps ? <Tooltip {...tooltipProps}/> : null} 

      <Info/>
      <Actions/>
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0
        }}
        >
        <Inventory/>
        <Menu/>
      </div>
      

    </InventoryActionCountContext>
    </InventoryContext>
    </TooltipContext>
    </CameraDirectionContext>
    </TurtleIdContext>
    </BlocksContext>
    </TurtlesContext>
    </WebsocketContext>
  )

}
