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
import { ChestContext, type ChestProps } from './contexts/chest.ts'
import Chest from './components/chest.tsx'

export default function App() {
  
  const [websocket, setWebsocket] = useState<WebSocket | null>(null)
  const [error, setError] = useState<string>('')

  const [turtles, setTurtles] = useState<Turtles>({})
  const [turtleId, setTurtleId] = useState<string | null>(null)
  const turtle = turtleId ? turtles[turtleId] : null
  const [blocks, setBlocks] = useState<Blocks>({})

  const [inventoryProps, setInventoryProps] = useState<InventoryProps | null>(null)
  const [inventoryActionCount, setInventoryActionCount] = useState<number>(1)
  const showInventory = inventoryProps != null && turtle?.status == 'online'

  const [chestProps, setChestProps] = useState<ChestProps | null>(null)

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
    <ChestContext value={[chestProps, setChestProps]}>



      <MessageHandler/>
      
      <World/>
      {tooltipProps ? <Tooltip {...tooltipProps}/> : null} 

      <div
        className="hud-container"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          display: 'grid',
          gridTemplate: '15% 15% 40% 15% 15% / 40% 20% 40%',
          gridTemplateAreas: `
          'tl tr tr'
          'tl tr tr'
          'bl bl mr'
          'bl bl br'
          'bl bl br'
          `,
          pointerEvents: 'none'
        }}
        >
        <Info style={{gridArea: 'tl'}}/>

        <Actions style={{gridArea: 'br', justifySelf: 'flex-end', alignSelf: 'flex-end'}}/>

        {showInventory ? <Inventory style={{gridArea: 'tr', justifySelf: 'flex-end'}}/> : null}

        <Menu style={{gridArea: showInventory ? 'mr' : 'tr', justifySelf: 'flex-end'}}/>

        <Chest style={{gridArea: 'bl', justifySelf: 'flex-end'}}/>
      </div>
      

    </ChestContext>
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
