interface BlockFilterProps {
    style?: React.CSSProperties
    setFilter: (f: string) => void
}

export default function BlockFilter(props: BlockFilterProps){
    const {style, setFilter} = props

    return <div
        style={{
            height: 'fit-content',
            width: 'fit-content',
            maxHeight: '100%',
            maxWidth: '100%',
            border: '2px solid white',
            borderRadius: '5px',
            padding: '5px',
            ...style
        }}
    >
        <p>Block filter</p>
        <input 
        placeholder="e.g. minecraft, ore, iron" 
        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key != 'Enter') return
            const target = event.target as HTMLInputElement
            const keyword = target.value.trim()
            setFilter(keyword)
        }}/>
    </div>
}