import { createContext } from "react"

interface Item {
    name?: string
    count?: number
    color?: number
}

export type InventoryProps = Record<string, Item> & {
    left_hand: Item,
    right_hand: Item
}

export const InventoryContext = createContext<[InventoryProps | null, (i: InventoryProps) => void]>(null!)