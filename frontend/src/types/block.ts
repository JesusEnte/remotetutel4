export interface Block {
    x: number
    y: number
    z: number
    name: string
    color: number
}

export type Blocks = Record<string, Block>