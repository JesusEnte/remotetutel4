import { useRef, useEffect } from "react"
import * as THREE from 'three'
import { OrbitControls } from 'three/addons'


interface RendererProps {
    threeRef: React.RefObject<ThreeRefCurrent>,
    style: React.CSSProperties,
}

export interface ThreeRefCurrent {
    scene: THREE.Scene,
    camera: THREE.Camera,
    renderer: THREE.WebGLRenderer,
    controls: OrbitControls
}

export default function Renderer(props: RendererProps){
    const canvasRef = useRef<HTMLCanvasElement>(null!)

    //threejs setup
    useEffect(() => {
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer({canvas: canvasRef.current, antialias: true})
        renderer.setSize(window.innerWidth, window.innerHeight);
        const controls = new OrbitControls(camera, renderer.domElement)

        
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const cube = new THREE.Mesh( geometry, material );
        scene.add( cube );

        camera.position.z = 5
        
        renderer.setAnimationLoop(() => {
            controls.update()
            renderer.render(scene, camera)
        })

        props.threeRef.current = {scene: scene, camera: camera, renderer:renderer, controls: controls}
    }, [])

    return <canvas style={props.style} ref={canvasRef}></canvas>
}