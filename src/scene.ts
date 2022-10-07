import './style.css'
import { resizeRendererToDisplaySize } from './helpers/responsiveness'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {
  AmbientLight,
  BoxGeometry,
  Clock,
  GridHelper,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer,
} from 'three'

const CANVAS_ID = 'scene'
const MESH_INIT_POSITION = [0, 0.5, 0] as const

const geometry = new BoxGeometry(1, 1, 1)
const material = new MeshLambertMaterial({ color: 'magenta' })
const mesh = new Mesh(geometry, material)

const grid = new GridHelper(20, 20, 'teal', 'darkgray')

const ambientLight = new AmbientLight('white', 0.4)
const pointLight = new PointLight(0xff0000, 1.5, 100)

const camera = new PerspectiveCamera(50, 2, 0.1, 200)

const canvas: HTMLElement = document.querySelector(`canvas#${CANVAS_ID}`)!

const cameraControls = new OrbitControls(camera, canvas)

const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
renderer.setPixelRatio(window.devicePixelRatio)

const clock = new Clock()

const scene = new Scene()

init()

animate()

function init() {
  mesh.position.set(...MESH_INIT_POSITION)
  pointLight.position.set(-5, 3, 3)
  camera.position.set(3.5, 3, 3)

  scene.add(grid)
  scene.add(mesh)
  scene.add(ambientLight)
  scene.add(pointLight)

  const { x: ctrlTargetX, y: ctrlTargetY, z: ctrlTargetZ } = mesh.position
  cameraControls.target.set(ctrlTargetX, ctrlTargetY, ctrlTargetZ)
  cameraControls.update()
}

function animate() {
  requestAnimationFrame(animate)

  // animation
  const rotationAngle = clock.getDelta() * (Math.PI / 2) // 90 degrees per second
  mesh.rotateY(rotationAngle)

  // responsiveness
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
  }

  renderer.render(scene, camera)
}
