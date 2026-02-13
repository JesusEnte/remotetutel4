import { type TooltipProps } from "../components/tooltip"
import { createContext } from "react"

export const SetTooltipContext = createContext<(props: TooltipProps) => void>(null!)