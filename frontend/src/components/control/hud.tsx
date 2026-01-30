interface HudProps {
    style: React.CSSProperties
}

export default function Hud(props: HudProps){
    return <div style={props.style}>
        <button>test</button>
    </div> 
}