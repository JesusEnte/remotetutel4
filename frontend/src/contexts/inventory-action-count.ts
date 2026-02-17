import { createContext } from "react"

export const InventoryActionCountContext = createContext<[number, (n: number) => void]>(null!)