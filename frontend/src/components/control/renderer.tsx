import { useRef, useEffect } from "react"
import * as THREE from 'three'
import { OrbitControls, GLTFLoader } from 'three/addons'

import turtleglb from './assets/turtle/turtle.glb'

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
        scene.background = new THREE.Color(40 / 255, 116 / 255, 178 / 255)

        const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.set(5, 5, 5)

        const renderer = new THREE.WebGLRenderer({canvas: canvasRef.current, antialias: true})
        renderer.setSize(window.innerWidth, window.innerHeight);

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enablePan = false
        controls.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
        }
        const loader = new GLTFLoader();

        
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
                const edges = new THREE.EdgesGeometry(geometry)
                const lines = new THREE.LineSegments(edges, new THREE.MeshBasicMaterial({color: 'black'}))
                const material = new THREE.MeshBasicMaterial({color: color})
                const cube = new THREE.Mesh(geometry, material)
                cube.add(lines)
                cube.position.set(block.x, block.y, block.z)
                cube.name = `block ${key}`
                
                scene.add(cube)
            }
        }
        function setTurtles(turtles: Turtles): void {
            for (const [id, turtle] of Object.entries(turtles)) {
                if (turtle.status == 'unknown position') return
                const old = scene.getObjectByName(`turtle ${id}`)
                if (old) {
                    old.position.set(turtle.x, turtle.y, turtle.z)
                    old.rotation.y = 0.5 * Math.PI * (turtle.dir - 2)
                } else {
                    loader.load(turtleglb, (glb) => {
                        const mesh = glb.scene.children[0]
                        mesh.name = `turtle ${id}`
                        mesh.position.set(turtle.x, turtle.y, turtle.z)
                        mesh.rotation.y = 0.5 * Math.PI * (turtle.dir - 2)
                        scene.add(mesh)
                    })
                }
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