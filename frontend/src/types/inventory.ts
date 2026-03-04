interface Item {
    name: string
    count: number
}

export type InventoryInfo = Record<string, Item> & {
    selected: string
}