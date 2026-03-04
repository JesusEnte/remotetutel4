interface Item {
    name: string
    count: number
}

export interface ChestInfo {
    name: string
    size: number
    inventory: Item[]
    direction: 'front' | 'top' | 'bottom'
}