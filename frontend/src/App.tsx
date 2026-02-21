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
import { InventoryActionCountContext } from './contexts/inventory-action-count.ts'
import { ChestContext, type ChestProps } from './contexts/chest.ts'
import { BlockFilterContext } from './contexts/block-filter.ts'

import MessageHandler from './components/message-handler.tsx'
import World from './components/world.tsx'
import Info from './components/info.tsx'
import Actions from './components/actions.tsx'
import Tooltip from './components/tooltip.tsx'
import Menu from './components/menu.tsx'
import Inventory from './components/inventory.tsx'
import Chest from './components/chest.tsx'
import BlockFilter from './components/block-filter.tsx'
import Interpreter from './components/interpreter.tsx'

export default function App() {
  
  const [websocket, setWebsocket] = useState<WebSocket | null>(null)
  const [error, setError] = useState<string>('')

  const [turtles, setTurtles] = useState<Turtles>({})
  const [turtleId, setTurtleId] = useState<string | null>(null)
  const turtle = turtleId ? turtles[turtleId] : null

  const [blocks, setBlocks] = useState<Blocks>({})
  const [blockFilter, setBlockFilter] = useState<string>('')

  const [inventoryProps, setInventoryProps] = useState<InventoryProps | null>(null)
  const [inventoryActionCount, setInventoryActionCount] = useState<number>(1)
  const showInventory = inventoryProps != null && turtle?.status == 'online'

  const [chestProps, setChestProps] = useState<ChestProps | null>(null)

  const [getCameraDirection, setCameraDirectionGetter] = useState<(n: 2 | 3) => string>(null!)
  const [tooltipProps, setTooltipProps] = useState<TooltipProps | null>(null)

  const [menu, setMenu]= useState<string | null>(null)



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
    <BlockFilterContext value={[blockFilter, setBlockFilter]}>

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

        {chestProps == null ? <Actions style={{gridArea: 'br', justifySelf: 'flex-end', alignSelf: 'flex-end'}}/> : null}

        {showInventory ? <Inventory style={{gridArea: 'tr', justifySelf: 'flex-end'}}/> : null}

        {chestProps == null ? null : <Chest style={{gridArea: 'bl', justifySelf: 'flex-end'}}/>}
        

        <div
          className="hud-container" 
          style={{
            display: 'grid',
            gridTemplateRows: '5svh calc(100% - 5svh)',
            rowGap: '10px',
            gridArea: 'mr',
            justifyContent: 'flex-end',
            justifyItems: 'flex-end',
            pointerEvents: 'none'
          }}
        >
          <Menu menu={menu} setMenu={setMenu} style={{height: '5svh'}}/>
          {menu != 'filter' ? null : <BlockFilter/>}
          {menu != 'interpreter' ? null : <Interpreter/>}
        </div>


        
      </div>
      

    </BlockFilterContext>
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
