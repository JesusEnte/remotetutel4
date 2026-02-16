import { createContext } from "react"

export interface TooltipProps {
    x: number
    y: number
    time: number
    text: string
}

export const TooltipContext = createContext<(props: TooltipProps) => void>(null!)