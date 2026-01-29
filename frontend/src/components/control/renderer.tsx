import {Canvas} from '@react-three/fiber' 

export default function Renderer(){
    return <Canvas>
        <mesh>
            <boxGeometry args={[1, ,1, 1]}/>
            <meshBasicMaterial color='red'/>
        </mesh>
    </Canvas>
}