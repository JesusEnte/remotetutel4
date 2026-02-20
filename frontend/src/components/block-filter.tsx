import { useContext, type CSSProperties } from 'react'
import { BlockFilterContext } from '../contexts/block-filter'

export default function BlockFilter({style} : {style?: CSSProperties}){
    const [_filter, setFilter] = useContext(BlockFilterContext)
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