import { Clock, Object3D } from 'three'

function rotate(object: Object3D, clock: Clock, radiansPerSecond: number = Math.PI * 2) {
  const rotationAngle = clock.getElapsedTime() * radiansPerSecond
  object.rotation.y = rotationAngle
}

function bounce(
  object: Object3D,
  clock: Clock,
  bounceSpeed: number = 1.5,
  amplitude: number = 0.4,
  yLowerBound: number = 0.5
) {
  const elapsed = clock.getElapsedTime()
  const yPos = Math.abs(Math.sin(elapsed * bounceSpeed) * amplitude)
  object.position.y = yPos + yLowerBound
}

export { rotate, bounce }
