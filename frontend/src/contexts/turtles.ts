import { createContext } from "react"

export interface Turtle {
    id: string
    x: number
    y: number
    z: number
    dir: number
    fuel: number
    status: string
}

export type Turtles = Record<string, Turtle>

export const TurtlesContext = createContext<[Turtles, (turtles: Turtles) => void]>(null!)