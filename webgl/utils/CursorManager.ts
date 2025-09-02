import { Vector2 } from 'three'

interface CursorVelocity extends Vector2 {
  needsUpdate?: boolean
}

export class CursorManager {
  static mouse: Vector2 = new Vector2(-1, -1)
  static normalized: Vector2 = new Vector2(-1, -1)
  static centered: Vector2 = new Vector2(-1, -1)
  static lastMouse: Vector2 = new Vector2()
  static velocity: CursorVelocity = new Vector2() as CursorVelocity
  static multiplier: number = 1
  static lastTime: number = 0
  static width: number = window.innerWidth
  static height: number = window.innerHeight

  public static init(): void {
    window.addEventListener('pointermove', this.onPointerMove)
  }

  private static onPointerMove = (event: PointerEvent): void => {
    const { clientX, clientY } = event

    this.mouse.set(clientX, clientY)

    // Normalised (0 à 1)
    const normalizedX = clientX / this.width
    const normalizedY = 1 - (clientY / this.height)
    this.normalized.set(normalizedX, normalizedY)

    // Centered (-1 à 1)
    const centeredX = (clientX / this.width) * 2 - 1
    const centeredY = 1 - (clientY / this.height) * 2
    this.centered.set(centeredX, centeredY)

    // Velocity
    if (!this.lastTime) {
      this.lastTime = performance.now()
      this.lastMouse.set(clientX, clientY)
    }

    const deltaX = clientX - this.lastMouse.x
    const deltaY = clientY - this.lastMouse.y

    this.lastMouse.set(clientX, clientY)

    const time = performance.now()
    const delta = Math.max(14, time - this.lastTime)
    this.lastTime = time

    this.velocity.x = (deltaX / delta) * this.multiplier
    this.velocity.y = (deltaY / delta) * this.multiplier
    this.velocity.needsUpdate = true
  }

  // RESIZE
  static resize(width: number, height: number): void {
    this.width = width
    this.height = height
    this.multiplier = width < 1000 ? 2 : 1
  }

  // DESTROY
  static destroy(): void {
    window.removeEventListener('pointermove', this.onPointerMove)
  }

  // GLOBAL HANDLERS
  static getMouse(): Vector2 {
    return this.mouse.clone()
  }

  static getNormalized(): Vector2 {
    return this.normalized.clone()
  }

  static getCentered(): Vector2 {
    return this.centered.clone()
  }

  static getVelocity(): Vector2 {
    if (!this.velocity.needsUpdate) {
      this.velocity.set(0, 0)
      this.lastTime = 0
    }
    this.velocity.needsUpdate = false
    return this.velocity.clone()
  }
}
