import { useRef, useEffect } from "react"
import * as THREE from 'three'
import { OrbitControls } from 'three/addons'


interface RendererProps {
    threeRef: React.RefObject<ThreeRefCurrent>,
    style: React.CSSProperties,
}

interface Turtle {
    id: number,
    x: number,
    y: number
    z: number,
    dir: number,
    status: string
}
type Turtles = Record<string, Turtle>
interface Block {
    x: number,
    y: number,
    z: number,
    name: string | null
}
type Blocks = Record<string, Block>

interface ThreeFunctions {
    setBlocks(blocks: Blocks): void,
    setTurtles(turtles: Turtles): void
}

export interface ThreeRefCurrent {
    scene: THREE.Scene,
    camera: THREE.Camera,
    renderer: THREE.WebGLRenderer,
    controls: OrbitControls,
    funcs: ThreeFunctions
}

export default function Renderer(props: RendererProps){
    const canvasRef = useRef<HTMLCanvasElement>(null!)

    //threejs setup
    useEffect(() => {
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(109 / 255, 125 / 255, 168 / 255)
        const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer({canvas: canvasRef.current, antialias: true})
        renderer.setSize(window.innerWidth, window.innerHeight);
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enablePan = false
        controls.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
        }

        camera.position.set(5, 5, 5)
        
        renderer.setAnimationLoop(() => {
            controls.update()
            renderer.render(scene, camera)
        })

        //util
        function setBlocks(blocks: Blocks): void {
            for (const [key, block] of Object.entries(blocks)) {
                //delete old block if existing
                const old = scene.getObjectByName(`block ${key}`)
                if (old) scene.remove(old)
                //dont render new one if name is none
                if (block.name == null) return
                //color hashing
                var hash: number = 0;
                for (var i = 0; i < block.name.length; i++) {
                    hash = 31 * hash + block.name.charCodeAt(i);
                }
                hash & 0xFFFFFFFF
                const hue = hash % 359
                const color = new THREE.Color(`hsl(${hue}, 100%, 50%)`)
                const geometry = new THREE.BoxGeometry(1, 1, 1)
                const material = new THREE.MeshBasicMaterial({color: color})
                const cube = new THREE.Mesh(geometry, material)
                cube.position.set(block.x, block.y, block.z)
                cube.name = `block ${key}`
                scene.add(cube)
            }
        }
        function setTurtles(turtles: Turtles): void {
            for (const [id, turtle] of Object.entries(turtles)) {
                if (turtle.status == 'unknown position') return
                console.log(id, turtle)
            }
        }
        
        //pass stuff to control component
        props.threeRef.current = {
            scene: scene, 
            camera: camera, 
            renderer:renderer, 
            controls: controls,
            funcs: {
                setBlocks,
                setTurtles
            }
        }
    }, [])

    return <canvas style={props.style} ref={canvasRef}></canvas>
}