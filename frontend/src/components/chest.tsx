import { useContext, type CSSProperties } from "react"
import { ChestContext } from "../contexts/chest"
import { TooltipContext } from "../contexts/tooltip-props"

export default function Chest({style}: {style?: CSSProperties}){
    const [chest, setChest] = useContext(ChestContext)
    const setTooltip = useContext(TooltipContext)
    
    if (chest == null) return null

    return <div
        style={{
            display: 'grid',
            gridTemplateRows: '10% 90%',
            width: 'calc(100% - 10px)',
            height: 'calc(100% - 10px)',
            border: '3px solid white',
            borderRadius: '5px',
            ...style
        }}
    >
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'grid',
                gridTemplateColumns: '100% 0%',
                borderBottom: '2px solid white'
            }}
        >
            <h3 style={{placeSelf: 'center center'}}>{chest.name}</h3>
            <button 
                onClick = {() => {
                    setChest(null)
                }}
                style={{placeSelf: 'center flex-end', 
                    color: 'red', 
                    aspectRatio: 1, 
                    height: '100%', 
                    backgroundColor: 'rgba(100, 100, 100, 0.8)',
                    border: 'none'
                }}
            >
                X
            </button>
        </div>

        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                maxWidth: '100%',
                maxHeight: '100%',
                gap: '2px',
                alignContent: 'flex-start',
                padding: '3px'
            }}
        >
            {[...Array(chest.size)].map((_v, i) => {
                const name = chest.inventory.at(i + 1) == undefined ? 'empty' : chest.inventory.at(i + 1)!.name
                const count = chest.inventory.at(i + 1) == undefined ? 0 : chest.inventory.at(i + 1)!.count
                return <p
                    key={i + 1}
                    style={{
                        aspectRatio: 1,
                        height: '5ch',
                        textAlign: 'center',
                        placeContent: 'center center',
                        border: '2px solid white',
                        userSelect: 'none'
                    }}
                    title={name}
                    onClick={(event: React.MouseEvent<HTMLParagraphElement>) => {
                        console.log(event)
                        setTooltip({x: event.clientX, y: event.clientY, time: 1500, text: name})
                    }}
                >
                    {count}
                </p>
            })}
        </div>
    </div>
}