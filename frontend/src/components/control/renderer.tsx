import { useRef, useEffect } from "react"
import * as THREE from 'three'
import { OrbitControls, GLTFLoader } from 'three/addons'
import type { Shared, Turtles } from "../control"

import turtleglb from './assets/turtle/turtle.glb'

interface RendererProps {
    sharedRef: React.RefObject<Shared>
    style: React.CSSProperties
}

interface Block {
    x: number
    y: number
    z: number
    name: string | null
}
type Blocks = Record<string, Block>

export interface ThreeFunctions {
    updateBlocks(blocks: Blocks): void
    updateTurtles(turtles: Turtles): void
    setTarget(turtle_id: string): void
    getCameraDirection(n: number): string
}


export default function Renderer(props: RendererProps){
    const canvasRef = useRef<HTMLCanvasElement>(null!)
    const shared = props.sharedRef.current

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
        function setTarget(turtle_id: string): void {
            const new_model = scene.getObjectByName(`turtle ${turtle_id}`)
            const old_pos = controls.target.clone()
            const new_pos = new_model!.position.clone()
            const diff = new THREE.Vector3(new_pos.x - old_pos.x, new_pos.y - old_pos.y, new_pos.z - old_pos.z)
            controls.target = new_model!.position
            camera.position.add(diff)
        }
        function updateBlocks(blocks: Blocks): void {
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
        function updateTurtles(turtles: Turtles): void {
            for (const [id, turtle] of Object.entries(turtles)) {
                let model = scene.getObjectByName(`turtle ${id}`)
                if (model) {
                    if (turtle.status == 'unknown position'){
                        scene.remove(model)
                        return
                    }
                    if (turtle.id == shared.selectedTurtleId){
                        //move camera along
                        const old_pos = model.position.clone()
                        const new_pos = new THREE.Vector3(turtle.x, turtle.y, turtle.z)
                        const diff = new THREE.Vector3(new_pos.x - old_pos.x, new_pos.y - old_pos.y, new_pos.z - old_pos.z)
                        camera.position.add(diff)
                    }
                    //move existing turtle
                    model.position.set(turtle.x, turtle.y, turtle.z)
                    model.rotation.y = -(0.5 * Math.PI * (turtle.dir - 3))
                } else {
                    //create new turtle
                    loader.load(turtleglb, (glb) => {
                        model = glb.scene.children[0]
                        model.name = `turtle ${id}`
                        model.position.set(turtle.x, turtle.y, turtle.z)
                        model.rotation.y = -(0.5 * Math.PI * (turtle.dir - 3))
                        scene.add(model)
                    })
                }
            }
        }
        function getCameraDirection(n: 2 | 3): string {
            const pitch = camera.getWorldDirection(new THREE.Vector3()).y
            if (n == 2){
                return pitch < 0 ? 'down' : 'up'
            } else {
                if (pitch < -0.7) return 'down'
                if (pitch > 0.4) return 'up'
                return 'normal'
            }
        }
        
        //pass stuff to control component
        shared.scene = scene
        shared.camera = camera
        shared.renderer = renderer
        shared.controls = controls
        shared.threeFuncs = {updateBlocks, updateTurtles, setTarget, getCameraDirection}
    }, [])

    return <canvas style={props.style} ref={canvasRef}/>
}