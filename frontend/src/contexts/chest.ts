import { createContext } from "react"

interface Item {
    name: string
    count: number
}

export interface ChestProps {
    name: string
    size: number
    inventory: Item[]
    direction: 'front' | 'top' | 'bottom'
} 

export const ChestContext = createContext<[ChestProps | null, (i: ChestProps | null) => void]>(null!)