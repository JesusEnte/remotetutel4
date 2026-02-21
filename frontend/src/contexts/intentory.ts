import { createContext } from "react"

interface Item {
    name: string
    count: number
}

export type InventoryProps = Record<string, Item> & {
    selected: string
}

export const InventoryContext = createContext<[InventoryProps | null, (i: InventoryProps) => void]>(null!)