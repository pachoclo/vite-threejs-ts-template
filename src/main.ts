import './style.css'
import * as THREE from 'three'
import { resizeRendererToDisplaySize } from './helpers/responsiveness'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const CANVAS_ID = 'main'
const MESH_INIT_POSITION = [0, 0.5, 0] as const

function main() {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshLambertMaterial({ color: 'magenta' })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(...MESH_INIT_POSITION)

  const grid = new THREE.GridHelper(20, 20, 'teal', 'darkgray')

  const ambientLight = new THREE.AmbientLight('white', 0.4)
  const pointLight = new THREE.PointLight(0xff0000, 1.5, 100)
  pointLight.position.set(-5, 3, 3)

  const camera = new THREE.PerspectiveCamera(50, 2, 0.1, 200)
  camera.position.set(5.5, 5, 7.5)

  const scene = new THREE.Scene()
  scene.add(grid)
  scene.add(mesh)
  scene.add(ambientLight)
  scene.add(pointLight)

  const canvas: HTMLElement = document.querySelector(`canvas#${CANVAS_ID}`)!

  const controls = new OrbitControls(camera, canvas)
  const { x: ctrlTargetX, y: ctrlTargetY, z: ctrlTargetZ } = mesh.position
  controls.target.set(ctrlTargetX, ctrlTargetY, ctrlTargetZ)
  controls.update()

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })

  function renderLoop(time: DOMHighResTimeStamp) {
    time *= 0.001 // to secs

    // animation goes here
    console.log('camera: ', camera.position)

    // responsiveness
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    renderer.render(scene, camera)
    requestAnimationFrame(renderLoop)
  }
  requestAnimationFrame(renderLoop)

  registerMeshControls(mesh)
}

function registerMeshControls(mesh: THREE.Mesh) {
  document.addEventListener('keydown', (event: KeyboardEvent) => {
    const stepSize = 1
    switch (event.key) {
      case 'ArrowLeft': {
        const currentPosition = mesh.position
        mesh.position.set(currentPosition.x - stepSize, currentPosition.y, currentPosition.z)
        break
      }
      case 'ArrowRight': {
        const currentPosition = mesh.position
        mesh.position.set(currentPosition.x + stepSize, currentPosition.y, currentPosition.z)
        break
      }
      case 'ArrowUp': {
        const currentPosition = mesh.position
        mesh.position.set(currentPosition.x, currentPosition.y, currentPosition.z - stepSize)
        break
      }
      case 'ArrowDown': {
        const currentPosition = mesh.position
        mesh.position.set(currentPosition.x, currentPosition.y, currentPosition.z + stepSize)
        break
      }
      case 'r': {
        mesh.position.set(...MESH_INIT_POSITION)
        break
      }
      default:
        break
    }
  })
}

main()
