import { useEffect, useRef } from "react"

export interface TooltipProps {
    x: number
    y: number
    time: number
    text: string
}

export default function Tooltip(props: TooltipProps | null){
    if (props == null) return null
    
    const ref = useRef<HTMLParagraphElement>(null!)
    useEffect(() => {
        const timeout = setTimeout(() => {
            ref.current.style.visibility = 'hidden'
        }, props.time)
        return () => {
            clearTimeout(timeout)
        }
    })

    return <p
        key={`${props.x} ${props.y} ${props.text}`}
        ref={ref}
        style={{
            position: 'absolute',
            left: `${props.x}px`,
            top: `${props.y - 15}px`,
            paddingInline: '0.5ch',
            backgroundColor: 'rgb(70, 70, 70)',
            borderRadius: '5px',
            transform: 'translate(-50%, -50%)',
            zIndex: 2
        }}
    >
        {props.text}
    </p>
}