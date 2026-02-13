import { createContext } from "react"

export const TurtleIdContext = createContext<[string | null, (id: string) => void]>(null!)