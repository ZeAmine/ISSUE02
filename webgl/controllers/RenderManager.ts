import {
  OrthographicCamera,
  Mesh,
  type PerspectiveCamera,
  type Scene,
  Vector2,
  type WebGLRenderer,
  WebGLRenderTarget
} from 'three'

import { Flowmap } from '../modules/Flowmap'

import { WorldController } from './WorldController.js'

import { FlowmapMaterial } from '@webgl/materials/flowmap'

interface Vector2WithUpdate extends Vector2 {
  needsUpdate?: boolean
}

export class RenderManager {
  private static renderer: WebGLRenderer
  private static scene: Scene
  private static camera: PerspectiveCamera
  private static width: number
  private static height: number
  private static mouse: Vector2
  private static velocity: Vector2WithUpdate
  private static lastTime: number
  private static lastMouse: Vector2
  private static multiplier: number
  private static aspect: Vector2
  private static screenCamera: OrthographicCamera
  private static screen: Mesh
  private static renderTarget: WebGLRenderTarget
  private static flowmap: Flowmap
  private static compositeMaterial: FlowmapMaterial

  static init(renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera): void {
    this.renderer = renderer
    this.scene = scene
    this.camera = camera

    this.width = 1
    this.height = 1

    // Flowmap
    this.mouse = new Vector2(-1, -1)
    this.velocity = new Vector2()
    this.lastTime = 0
    this.lastMouse = new Vector2()
    this.multiplier = 1

    this.initRenderer()

    this.addListeners()
  }

  private static initRenderer(): void {
    const { screenTriangle, aspect } = WorldController

    // Fullscreen triangle
    this.screenCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
    this.screen = new Mesh(screenTriangle)
    this.screen.frustumCulled = false

    // Render targets
    this.renderTarget = new WebGLRenderTarget(1, 1, {
      depthBuffer: false
    })

    // Flowmap
    this.flowmap = new Flowmap(this.renderer, {
      falloff: 0.098,
      alpha: 0.25,
      dissipation: 0.8
    })
    this.flowmap.material.uniforms.uAspect = aspect

    // Composite material
    this.compositeMaterial = new FlowmapMaterial({
      tFlow: this.flowmap.uniform.value
    })
  }

  disableInteractions(): void {
    // Disable interactions
  }

  // EVENTS
  static onPointerMove = ({ clientX, clientY }: { clientX: number; clientY: number }) => {
    const event = {
      x: clientX,
      y: clientY
    }

    const normalized = {
      x: event.x / this.width,
      y: 1 - event.y / this.height
    }

    // Get mouse value in 0 to 1 range, with Y flipped
    this.mouse.set(normalized.x, normalized.y)

    // First frame
    if (!this.lastTime) {
      this.lastTime = performance.now()
      this.lastMouse.copy(event)
    }

    const deltaX = event.x - this.lastMouse.x
    const deltaY = event.y - this.lastMouse.y

    this.lastMouse.copy(event)

    const time = performance.now()

    // Avoid dividing by 0
    const delta = Math.max(14, time - this.lastTime)
    this.lastTime = time

    // Calculate velocity
    this.velocity.x = (deltaX / delta) * this.multiplier
    this.velocity.y = (deltaY / delta) * this.multiplier

    // Flag update to prevent hanging velocity values when not moving
    this.velocity.needsUpdate = true
  }

  // LISTENERS
  static addListeners() {
    window.addEventListener('pointermove', this.onPointerMove)
  }

  // RESIZE
  static resize = (width: number, height: number, dpr: number): void => {
    this.width = width
    this.height = height

    if (width < 1000) {
      this.multiplier = 2
    } else {
      this.multiplier = 1
    }

    this.renderer.setPixelRatio(dpr)
    this.renderer.setSize(width, height)

    width = Math.round(width * dpr)
    height = Math.round(height * dpr)

    this.renderTarget.setSize(width, height)
  }

  // UPDATE
  static update = (time: number, delta: number, frame: number) => {
    const renderer = this.renderer
    const scene = this.scene
    const camera = this.camera

    const renderTarget = this.renderTarget

    // Reset velocity when mouse not moving
    if (!this.velocity.needsUpdate) {
      this.mouse.set(-1, -1)
      this.velocity.set(0, 0)
      this.lastTime = 0
    }
    this.velocity.needsUpdate = false

    // Update flowmap inputs
    this.flowmap.mouse.copy(this.mouse)

    // Ease velocity input, slower when fading out
    this.flowmap.velocity.lerp(this.velocity, this.velocity.length() ? 0.5 : 0.1)
    this.flowmap.update()

    // Scene pass
    renderer.setRenderTarget(renderTarget)
    renderer.render(scene, camera)

    // Composite pass (render to screen)
    this.compositeMaterial.tScene = renderTarget.texture
    this.screen.material = this.compositeMaterial
    renderer.setRenderTarget(null)
    renderer.render(this.screen, this.screenCamera)
  }
}
