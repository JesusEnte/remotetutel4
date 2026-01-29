import Renderer from './control/renderer'
import Hud from './control/hud'

interface ControlPageProps {
    websocket: WebSocket
}

export default function ControlPage(props: ControlPageProps){
    return (<>
        <Renderer/>
        <Hud/>
    </>)
}