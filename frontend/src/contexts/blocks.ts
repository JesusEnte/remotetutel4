import { createContext } from "react"

export interface Block {
    x: number
    y: number
    z: number
    name: string
    color: number
}

export type Blocks = Record<string, Block>

export const BlocksContext = createContext<[Blocks, (blocks: Blocks) => void]>(null!)