import { createContext } from 'react'

export const BlockFilterContext = createContext<[string, (filter: string) => void]>(null!)