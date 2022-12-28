import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  Clock,
  GridHelper,
  Mesh,
  MeshLambertMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  PointLightHelper,
  Scene,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import * as animations from './animations'
import { resizeRendererToDisplaySize } from './helpers/responsiveness'
import './style.css'
import { toggleFullScreen } from './helpers/fullscreen'

const CANVAS_ID = 'scene'

let canvas: HTMLElement
let renderer: WebGLRenderer
let scene: Scene
let stats: Stats
let ambientLight: AmbientLight
let pointLight: PointLight
let cube: Mesh
let camera: PerspectiveCamera
let cameraControls: OrbitControls
let clock: Clock

let playAnimation = true

init()
animate()

function init() {
  // ===== 🖼️ CANVAS, RENDERER, & SCENE =====
  {
    canvas = document.querySelector(`canvas#${CANVAS_ID}`)!
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = PCFSoftShadowMap
    scene = new Scene()
  }

  // ===== 💡 LIGHTS =====
  {
    ambientLight = new AmbientLight('white', 0.4)
    pointLight = new PointLight('#ffdca8', 1.2, 100)
    pointLight.position.set(-5, 3, 3)
    pointLight.castShadow = true
    pointLight.shadow.radius = 4
    pointLight.shadow.camera.near = 0.5
    pointLight.shadow.camera.far = 4000
    pointLight.shadow.mapSize.width = 2048
    pointLight.shadow.mapSize.height = 2048
    scene.add(ambientLight)
    scene.add(pointLight)
  }

  // ===== 📦 OBJECTS =====
  {
    const sideLength = 1
    const cubeGeometry = new BoxGeometry(sideLength, sideLength, sideLength)
    const cubeMaterial = new MeshLambertMaterial({ color: 'magenta' })
    cube = new Mesh(cubeGeometry, cubeMaterial)
    cube.castShadow = true

    const planeGeometry = new PlaneGeometry(3, 3)
    const planeMaterial = new MeshLambertMaterial({
      color: 'gray',
      emissive: 'teal',
      emissiveIntensity: 0.2,
      side: 2,
    })
    const plane = new Mesh(planeGeometry, planeMaterial)
    plane.rotateX(Math.PI / 2)
    plane.receiveShadow = true

    scene.add(cube)
    scene.add(plane)
  }

  // ===== 🎥 CAMERA =====
  {
    camera = new PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
    camera.position.set(3.5, 3, 5)
  }

  // ===== 🕹️ CONTROLS =====
  {
    cameraControls = new OrbitControls(camera, canvas)
    cameraControls.target = cube.position.clone()
    cameraControls.enableDamping = true
    cameraControls.update()

    const dragControls = new DragControls([cube], camera, renderer.domElement)
    dragControls.addEventListener('dragstart', (event) => {
      event.object.material.emissive.set('yellow')
      cameraControls.enabled = false
      playAnimation = false
    })
    dragControls.addEventListener('hoveron', (event) => {
      event.object.material.emissive.set('orange')
    })
    dragControls.addEventListener('hoveroff', (event) => {
      event.object.material.emissive.set(0x000000)
    })
    dragControls.addEventListener('dragend', (event) => {
      event.object.material.emissive.set(0x000000)
      cameraControls.enabled = true
      playAnimation = true
    })

    // Full screen
    window.addEventListener('dblclick', (event) => {
      if (event.target === canvas) {
        toggleFullScreen(canvas)
      }
    })
  }

  // ===== 🪄 HELPERS =====
  {
    const axesHelper = new AxesHelper(4)
    const pointLightHelper = new PointLightHelper(pointLight, undefined, 'orange')
    const gridHelper = new GridHelper(20, 20, 'teal', 'darkgray')
    gridHelper.position.y = -0.01
    scene.add(axesHelper)
    scene.add(pointLightHelper)
    scene.add(gridHelper)
  }

  // ===== 📈 STATS & CLOCK =====
  {
    clock = new Clock()
    stats = Stats()
    document.body.appendChild(stats.dom)
  }
}

function animate() {
  requestAnimationFrame(animate)

  stats.update()

  // animation
  if (playAnimation) {
    animations.rotate(cube, clock, Math.PI / 3)
    animations.bounce(cube, clock, 1, 0.5, 0.5)
  }

  if (resizeRendererToDisplaySize(renderer)) {
    // responsiveness
    const canvas = renderer.domElement
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
  }

  cameraControls.update()

  renderer.render(scene, camera)
}
