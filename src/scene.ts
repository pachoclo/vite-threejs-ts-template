import {
  AmbientLight,
  BoxGeometry,
  Clock,
  GridHelper,
  Mesh,
  MeshLambertMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as animations from './animations'
import { resizeRendererToDisplaySize } from './helpers/responsiveness'
import './style.css'

const CANVAS_ID = 'scene'

const cubeGeometry = new BoxGeometry(1, 1, 1)
const cubeMaterial = new MeshLambertMaterial({ color: 'magenta' })
const cube = new Mesh(cubeGeometry, cubeMaterial)

const planeGeometry = new PlaneGeometry(3, 3)
const planeMaterial = new MeshLambertMaterial({
  color: 'gray',
  emissive: 'teal',
  emissiveIntensity: 0.2,
  side: 2,
})
const plane = new Mesh(planeGeometry, planeMaterial)

const grid = new GridHelper(20, 20, 'teal', 'darkgray')

const ambientLight = new AmbientLight('white', 0.4)
const pointLight = new PointLight('#ffdca8', 1.2, 100)

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
  // position and rotation
  camera.position.set(3.5, 3, 5)
  plane.rotateX(Math.PI / 2)
  pointLight.position.set(-5, 3, 3)

  // shadows
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFSoftShadowMap
  pointLight.castShadow = true
  pointLight.shadow.radius = 4
  pointLight.shadow.camera.near = 0.1
  pointLight.shadow.mapSize.width = 5000
  pointLight.shadow.mapSize.height = 5000
  cube.castShadow = true
  plane.receiveShadow = true

  // add objects and lights to scene
  scene.add(grid)
  scene.add(plane)
  scene.add(cube)
  scene.add(ambientLight)
  scene.add(pointLight)

  // set the camera to look at the cube's starting position
  const { x: ctrlTargetX, y: ctrlTargetY, z: ctrlTargetZ } = cube.position
  cameraControls.target.set(ctrlTargetX, ctrlTargetY, ctrlTargetZ)
  cameraControls.update()
}

function animate() {
  requestAnimationFrame(animate)

  // animation
  animations.rotate(cube, clock, Math.PI / 3)
  animations.bounce(cube, clock, 1, 0.5, 0.5)

  // responsiveness
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
  }

  renderer.render(scene, camera)
}
