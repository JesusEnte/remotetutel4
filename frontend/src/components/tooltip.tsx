import { useEffect, useRef } from "react"
import { type TooltipProps } from "../contexts/tooltip-props"

export default function Tooltip(props: TooltipProps){
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
            backgroundColor: 'rgba(70, 70, 70, 0.5)',
            borderRadius: '5px',
            transform: 'translate(-50%, -50%)'
        }}
    >
        {props.text}
    </p>
}