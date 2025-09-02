import { gsap } from 'gsap'

import { InputManager } from './controllers/InputManager'
import { RenderManager } from './controllers/RenderManager'
import { TransitionManager } from './controllers/TransitionManager'
import { WorldController } from './controllers/WorldController'
import { SceneView } from './views/SceneView'

import { eventEmitter } from '@/utils/EventEmitter'
import { CursorManager } from '@webgl/utils/CursorManager'

export class App {
  private readonly canvas!: HTMLCanvasElement
  public view: SceneView | null = null
  private isDestroyed: boolean = false

  constructor(canvas: HTMLCanvasElement) {
    if (!canvas) throw new Error('Canvas element not found')

    this.canvas = canvas

    this.init()
  }

  public init(): void {
    if (this.isDestroyed) return

    this.initWorld()
    this.initControllers()
  }

  // INIT
  public initWorld() {
    WorldController.init(this.canvas)
  }

  public initControllers() {
    const { renderer, scene, camera } = WorldController

    CursorManager.init()
    InputManager.init(camera)
    RenderManager.init(renderer, scene, camera)
  }

  public initViews(): void {
    this.view = new SceneView()
    WorldController.scene.add(this.view)
    TransitionManager.init(this.view)
  }

  // LISTENERS
  public addListeners(): void {
    eventEmitter.on('WINDOW:RESIZE', this.onResize)
    gsap.ticker.add(this.onUpdate)
  }

  // RESIZE
  public onResize = (): void => {
    if (this.isDestroyed) return

    const width = window.innerWidth
    const height = window.innerHeight
    const dpr = Math.min(window.devicePixelRatio, 2)

    CursorManager.resize(width, height)
    WorldController.resize(width, height, dpr)
    this.view?.resize(width, height, dpr)
    RenderManager.resize(width, height, dpr)
  }

  // UPDATE
  public onUpdate = (time: number, delta: number, frame: number): void => {
    if (this.isDestroyed) return

    WorldController.update(time, delta, frame)
    this.view?.update(time, delta, frame)
    InputManager.update(time)
    RenderManager.update(time, delta, frame)
  }

  // DESTROY
  public destroy = (): void => {
    if (this.isDestroyed) return
    this.isDestroyed = true

    eventEmitter.off('WINDOW:RESIZE', this.onResize)
    gsap.ticker.remove(this.onUpdate)

    if (this.view) {
      this.view.destroy()
      this.view = null
    }
    CursorManager.destroy()
    InputManager.removeListeners()
    InputManager.cleanup()
  }

  // PUBLIC
  public start = (): void => {
    this.initViews()

    this.addListeners()
    this.onResize()
  }
}
