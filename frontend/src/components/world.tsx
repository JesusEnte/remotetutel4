import { useContext, useEffect } from "react"
import { BlocksContext } from "../contexts/blocks"
import { TurtlesContext } from "../contexts/turtles"
import { TurtleIdContext } from "../contexts/turtleId"
import { Canvas, useThree, type ThreeEvent } from "@react-three/fiber"
import type { Block } from "../contexts/blocks"
import type { Turtle } from "../contexts/turtles"
import TutelGLB from '../assets/turtle/turtle.glb'
import { Gltf , OrbitControls } from "@react-three/drei"
import usePrevious from "../hooks/use-previous"
import { Vector3 } from "three"
import { CameraDirectionContext } from "../contexts/camera-direction"
import { TooltipContext } from "../contexts/tooltip-props"

function TurtleMesh(props: Turtle){
    const setTooltipProps = useContext(TooltipContext)
    return <Gltf
        onClick={(event: ThreeEvent<MouseEvent>) => {
            event.stopPropagation()
            setTooltipProps({x: event.x, y: event.y, time: 3000, text: `#${props.id}: ${props.status}`})
        }}
        src={TutelGLB} 
        position={[props.x, props.y, props.z]} 
        rotation={[0, -(0.5 * Math.PI * (props.dir - 3)), 0]}
    />
}

function BlockMesh(props: Block){
    const setTooltipProps = useContext(TooltipContext)

    const r = props.color >> 16 & 255
    const g = props.color >> 8 & 255
    const b = props.color & 255
    
    return <mesh 
        position={[props.x, props.y, props.z]}
        onClick={(event: ThreeEvent<MouseEvent>) => {
            event.stopPropagation()
            setTooltipProps({x: event.x, y: event.y, time: 3000, text: props.name!})
        }}
        >
            <boxGeometry/>
            <meshBasicMaterial color={`rgb(${r}, ${g}, ${b})`} transparent={true} opacity={0.8}
        />
    </mesh>
}

function CameraMover({target}: {target: Vector3}){
    const {camera} = useThree()
    const previousTarget = usePrevious(target) || new Vector3(0, 0, 0)

    const prevToCam = camera.position.clone().sub(previousTarget)
    const newCam = target.clone().add(prevToCam)

    useEffect(() => {
        camera.position.copy(newCam)
    })
    return null
}

function GetCameraDirectionSetter(){
    const {camera} = useThree()
    const [_getCameraDirection, setCameraDirectionGetter] = useContext(CameraDirectionContext)

    function getCameraDirection(n: 2 | 3){
        const pitch = camera.getWorldDirection(new Vector3()).y
        if (n == 2){
            return pitch < 0 ? 'down' : 'up'
        } else {
            if (pitch < -0.7) return 'down'
            if (pitch > 0.4) return 'up'
            return 'normal'
        }
    }

    useEffect(() => {
        setCameraDirectionGetter(() => getCameraDirection)
    }, [camera])

    return null
}

export default function World(){
    const [blocks, _setBlocks] = useContext(BlocksContext)
    const [turtles, _setTurtles] = useContext(TurtlesContext)
    const [turtleId, _setTurtleId] = useContext(TurtleIdContext)
    const turtle = turtleId ? turtles[turtleId] : null
    const setTooltipProps = useContext(TooltipContext)
    
    const target = (turtle == null || turtle.status == 'position unknown') ? new Vector3(0, 0, 0) : new Vector3(turtle.x, turtle.y, turtle.z)


    return <Canvas

        onPointerMissed={() => {
            setTooltipProps({x: 0, y:0, text: '', time: 0})
        }}

        camera={{position:[3, 3, 3]}}

        style={{
            position: 'absolute',
            width: '100svw',
            height: '100svh',
            top: 0,
            left: 0,
            zIndex: -1
        }}
        
    >
        <color 
            attach="background"
            args={['#4b8ab1']}
        />
        <OrbitControls
            target={target}
            enablePan={false}
            dampingFactor={0.1}
            touches={{
                ONE: 0, //Rotate
                TWO: 2  //Dolly Pan
            }}
        />
        {Array.from(Object.entries(turtles)).map(([id, turtle]) => {
            return turtle.status == 'unknown position' ? null : 
            <TurtleMesh
            key={`turtle ${turtle.x}/${turtle.y}/${turtle.z}/${turtle.dir} ${id}`}
            {...turtle}
            />
        })}
        {Array.from(Object.entries(blocks)).map(([id, block]) => {
            return <BlockMesh
            key={`block ${id} ${block.name}`}
            {...block}
            />
        })}
        <CameraMover target={target}/>
        <GetCameraDirectionSetter/>
    </Canvas>
}