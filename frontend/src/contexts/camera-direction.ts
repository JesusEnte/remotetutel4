import { createContext, type SetStateAction } from "react"

export const CameraDirectionContext = createContext<[(n: 2 | 3) => string, React.Dispatch<SetStateAction<(n: 2 | 3) => string>>]>(null!)