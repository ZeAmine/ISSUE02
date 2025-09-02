import { type Camera, Group, type Mesh, type Object3D, Raycaster, Vector2 } from 'three'

import { Stage } from '../utils/Stage'

interface InteractiveObject extends Mesh {
  onHover: (event: { type: 'over' | 'out'; target?: InteractiveObject }) => void
  onClick: (event: { target: InteractiveObject }) => void
  parent: Group | Object3D
}

export const isMobile = !!navigator.maxTouchPoints
export const isTablet = isMobile && Math.max(window.innerWidth, window.innerHeight) > 1000

export class InputManager {
  private static camera: Camera
  private static raycaster: Raycaster
  private static objects: InteractiveObject[]
  private static mouse: Vector2
  private static delta: Vector2
  private static coords: Vector2
  private static hover: InteractiveObject | null
  private static click: InteractiveObject | null
  private static lastTime: number
  private static lastMouse: Vector2
  private static raycastInterval: number
  private static lastRaycast: number
  private static enabled: boolean

  static init(camera: Camera): void {
    this.camera = camera
    this.raycaster = new Raycaster()
    this.objects = []
    this.mouse = new Vector2(-1, -1)
    this.delta = new Vector2()
    this.coords = new Vector2(-2, 2)
    this.hover = null
    this.click = null
    this.lastTime = 0
    this.lastMouse = new Vector2()
    this.raycastInterval = 1 / 10 // 10 frames per second
    this.lastRaycast = 0
    this.enabled = true

    this.addListeners()
  }

  // METHODS
  static add = (...objects: InteractiveObject[]): void => {
    this.objects.push(...objects)
  }

  static remove = (...objects: InteractiveObject[]): void => {
    objects.forEach((object: InteractiveObject) => {
      const index = this.objects.indexOf(object)

      if (~index) {
        this.objects.splice(index, 1)
      }

      if (object.parent instanceof Group) {
        object = object.parent as unknown as InteractiveObject
      }

      if (object === this.hover) {
        this.hover.onHover({ type: 'out' })
        this.hover = null
        Stage.css({ cursor: '' })
      }
    })
  }

  static cleanup(): void {
    this.objects = []
    this.hover = null
    this.click = null
    this.mouse.set(-1, -1)
    this.delta.set(0, 0)
    this.coords.set(-2, 2)
    this.lastTime = 0
    this.lastMouse.set(0, 0)
    this.lastRaycast = 0
  }

  // EVENTS
  private static onPointerDown = (e: PointerEvent): void => {
    if (!this.enabled) return

    this.lastTime = performance.now()
    this.lastMouse.set(e.clientX, e.clientY)

    this.onPointerMove(e)

    if (this.hover) {
      this.click = this.hover
    }
  }

  private static onPointerMove = (e?: PointerEvent): void => {
    if (!this.enabled) return

    if (e) {
      this.mouse.x = e.clientX
      this.mouse.y = e.clientY
      this.coords.x = (this.mouse.x / document.documentElement.clientWidth) * 2 - 1
      this.coords.y = 1 - (this.mouse.y / document.documentElement.clientHeight) * 2
    }

    this.raycaster.setFromCamera(this.coords, this.camera)

    const intersection = this.raycaster.intersectObjects(this.objects)

    if (intersection.length) {
      let object = intersection[0].object as InteractiveObject

      if (object.parent instanceof Group) {
        object = object.parent as Object3D as InteractiveObject
      }

      if (!this.hover) {
        this.hover = object
        this.hover.onHover({ type: 'over', target: object })
        Stage.css({ cursor: 'pointer' })
      } else if (this.hover !== object) {
        this.hover.onHover({ type: 'out' })
        this.hover = object
        this.hover.onHover({ type: 'over', target: object })
        Stage.css({ cursor: 'pointer' })
      }
    } else if (this.hover) {
      this.hover.onHover({ type: 'out' })
      this.hover = null
      Stage.css({ cursor: '' })
    }

    this.delta.subVectors(this.mouse, this.lastMouse)
  }

  private static onPointerUp = (): void => {
    if (!this.enabled) {
      return
    }

    if (performance.now() - this.lastTime > 250 || this.delta.length() > 50) {
      this.click = null
      return
    }

    if (this.click && this.click === this.hover) {
      this.click.onClick({ target: this.click })
    }

    this.click = null
  }

  // LISTENERS
  static addListeners(): void {
    window.addEventListener('pointerdown', this.onPointerDown)
    window.addEventListener('pointermove', this.onPointerMove)
    window.addEventListener('pointerup', this.onPointerUp)
  }

  static removeListeners(): void {
    window.removeEventListener('pointerdown', this.onPointerDown)
    window.removeEventListener('pointermove', this.onPointerMove)
    window.removeEventListener('pointerup', this.onPointerUp)
  }

  // UPDATE
  static update = (time: number): void => {
    if (!isMobile && time - this.lastRaycast > this.raycastInterval) {
      this.onPointerMove()
      this.lastRaycast = time
    }
  }
}
