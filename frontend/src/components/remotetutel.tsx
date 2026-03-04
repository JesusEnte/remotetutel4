import '../App.css'

import { useState } from 'react'

import { WebsocketContext } from '../contexts/websocket.ts'
import { TurtlesContext, type Turtles } from '../contexts/turtles.ts'
import { TurtleIdContext } from '../contexts/turtleId.ts'
import { CameraDirectionContext } from '../contexts/camera-direction.ts'
import { InventoryActionCountContext } from '../contexts/inventory-action-count.ts'

import { type Blocks } from '../types/block.ts'
import { type ChestInfo } from '../types/chest.ts'
import type { InventoryInfo } from '../types/inventory.ts'
import type { TooltipProps } from '../components/tooltip.tsx'

import MessageHandler from '../components/message-handler.tsx'
import World from '../components/world.tsx'
import Info from '../components/info.tsx'
import Actions from '../components/actions.tsx'
import Tooltip from '../components/tooltip.tsx'
import Menu from '../components/menu.tsx'
import Inventory from '../components/inventory.tsx'
import Chest from '../components/chest.tsx'
import BlockFilter from '../components/block-filter.tsx'
import Interpreter from '../components/interpreter.tsx'
import KeyboardControls from '../components/keyboard-controls.tsx'

interface RemotetutelProps {
    websocket: WebSocket
}

export default function Remotetutel(props: RemotetutelProps) {
    
    const [turtles, setTurtles] = useState<Turtles>({})
    const [turtleId, setTurtleId] = useState<string | null>(null)
    const turtle = turtleId ? turtles[turtleId] : null

    const [blocks, setBlocks] = useState<Blocks>({})
    const [blockFilter, setBlockFilter] = useState<string>('')

    const [inventoryInfo, setInventoryInfo] = useState<InventoryInfo | null>(null)
    const [inventoryActionCount, setInventoryActionCount] = useState<number>(1)
    const showInventory = inventoryInfo != null && turtle?.status == 'online'

    const [chestInfo, setChestInfo] = useState<ChestInfo | null>(null)

    const [getCameraDirection, setCameraDirectionGetter] = useState<(n: 2 | 3) => string>(null!)
    const [tooltipProps, setTooltipProps] = useState<TooltipProps | null>(null)

    const [menu, setMenu]= useState<string | null>(null)

    
    return (
        <WebsocketContext value={props.websocket}>
        <TurtlesContext value={[turtles, setTurtles]}>
        <TurtleIdContext value={[turtleId, setTurtleId]}>
        <CameraDirectionContext value={[getCameraDirection, setCameraDirectionGetter]}>
        <InventoryActionCountContext value={[inventoryActionCount, setInventoryActionCount]}>

        <MessageHandler
            blocks={blocks}
            setBlocks={setBlocks}
            setChest={setChestInfo}
            setInventory={setInventoryInfo}
        />
        <KeyboardControls/>
        
        <World 
            blocks={blocks}
            blockFilter={blockFilter}
            setTooltip={setTooltipProps}
        />

        <Tooltip {...tooltipProps!}/>

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
            `
            }}
            >

            <Info style={{gridArea: 'tl'}}/>

            <Actions 
                style={{gridArea: 'br', justifySelf: 'flex-end', alignSelf: 'flex-end'}}
            />

            <Inventory 
                style={{gridArea: 'tr', justifySelf: 'flex-end'}}
                chestInfo={chestInfo}
                show={showInventory}
                inventory={inventoryInfo}
            />

            <Chest 
                style={{gridArea: 'bl', justifySelf: 'flex-end'}}
                info={chestInfo}
                setInfo={setChestInfo}
                setTooltip={setTooltipProps}
            />
            

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
            {menu != 'filter' ? null : <BlockFilter setFilter={setBlockFilter}/>}
            {menu != 'interpreter' ? null : <Interpreter/>}
            </div>

        </div>
        

        </InventoryActionCountContext>
        </CameraDirectionContext>
        </TurtleIdContext>
        </TurtlesContext>
        </WebsocketContext>
    )

}
