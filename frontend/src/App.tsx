import './App.css'
import { useState } from 'react'
import Login from './components/login.tsx'
import { WebsocketContext } from './contexts/websocket.ts'
import { TurtlesContext } from './contexts/turtles.ts'
import type { Turtles } from './contexts/turtles.ts'
import MessageHandler from './components/message-handler.tsx'
import { BlocksContext } from './contexts/blocks.ts'
import type { Blocks } from './contexts/blocks.ts'
import World from './components/world.tsx'
import { TurtleIdContext } from './contexts/turtleId.ts'
import Info from './components/info.tsx'
import { CameraDirectionContext } from './contexts/camera-direction.ts'
import Actions from './components/actions.tsx'
import Tooltip from './components/tooltip.tsx'
import { type TooltipProps } from './components/tooltip.tsx'
import { SetTooltipContext } from './contexts/tooltip-props.ts'
import Menu from './components/menu.tsx'

export default function App() {
  
  const [websocket, setWebsocket] = useState<WebSocket | null>(null)
  const [error, setError] = useState<string>('')

  const [turtles, setTurtles] = useState<Turtles>({})
  const [turtleId, setTurtleId] = useState<string | null>(null)
  const [blocks, setBlocks] = useState<Blocks>({})

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
    <SetTooltipContext value={setTooltipProps}>

      <MessageHandler/>
      
      <World/>
      <Info/>
      <Actions/>
      <Menu/>
      {tooltipProps ? <Tooltip {...tooltipProps}/> : null} 
      

    </SetTooltipContext>
    </CameraDirectionContext>
    </TurtleIdContext>
    </BlocksContext>
    </TurtlesContext>
    </WebsocketContext>
  )

}
