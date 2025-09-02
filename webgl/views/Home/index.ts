import gsap from 'gsap'
import {
  Group,
  Mesh,
  type Object3D,
  type PerspectiveCamera,
  type PlaneGeometry,
  Vector2
} from 'three'

import { InputManager } from '@webgl/controllers/InputManager'
import { WorldController } from '@webgl/controllers/WorldController'
import { HomeMaterial } from '@webgl/materials/home'
import { DOMElement3D } from '@webgl/utils/DOMElement3D'
import { type DOMVector2, DOMViewport } from '@webgl/utils/Utils3D'

interface InteractiveObject extends Mesh {
  onHover: (event: { type: 'over' | 'out'; target?: InteractiveObject }) => void
  onClick: (event: { target: InteractiveObject }) => void
  parent: Group | Object3D
}

export class Home extends Group {
  private readonly camera: PerspectiveCamera = WorldController.camera
  private readonly viewport: Vector2 = WorldController.viewport
  private readonly geometry: PlaneGeometry = WorldController.quad

  private material!: HomeMaterial
  private mesh!: Mesh
  public hitMesh!: InteractiveObject
  private mediaEl!: HTMLElement
  private domElement!: DOMElement3D

  constructor() {
    super()

    this.visible = true
  }

  public init = (): void => {
    this.initElements()
    this.initMesh()
  }

  private initElements(): void {
    this.mediaEl = document.querySelector('.ho-media') as HTMLElement
  }

  private initMesh(): void {
    const { aspect, getTexture } = WorldController

    const { texture, size } = getTexture('texture-1')
    const cameraVp = DOMViewport(this.camera) as DOMVector2

    this.material = new HomeMaterial({
      uTexture: texture,
      uResolution: new Vector2(size.width, size.height),
      uScale: new Vector2(1, 1),
      uViewport: new Vector2(cameraVp.x, cameraVp.y),
      uAspect: aspect.value,
      uProgressAlpha: 1
    })
    this.mesh = new Mesh(this.geometry, this.material)

    const hitMesh = new Mesh(this.geometry)
    hitMesh.visible = false
    this.hitMesh = hitMesh as Mesh as InteractiveObject

    this.domElement = new DOMElement3D(this.mediaEl, this.mesh, this.hitMesh, 0.01)

    this.add(this.mesh)
    this.add(this.hitMesh)
  }

  // ANIMATIONS
  public animateIn = (): Promise<void> => {
    return new Promise((resolve) => {
      const { uProgressAlpha } = this.material.uniforms
      gsap.killTweensOf(uProgressAlpha)
      gsap.fromTo(
        uProgressAlpha,
        {
          value: 0
        },
        {
          value: 1,
          duration: 1.4,
          ease: 'power4.out',
          delay: 0.3,
          onComplete: resolve
        }
      )
    })
  }

  public animateOut = (): Promise<void> => {
    return new Promise((resolve) => {
      const { uProgressAlpha } = this.material.uniforms
      gsap.killTweensOf(uProgressAlpha)
      gsap.fromTo(
        uProgressAlpha,
        {
          value: 1
        },
        {
          value: 0,
          duration: 0.4,
          ease: 'power2.out',
          onComplete: resolve
        }
      )
    })
  }

  // EVENTS
  public onHover = (event: { type: 'over' | 'out'; target?: InteractiveObject }): void => {
    //
  }

  public onClick = (): void => {
    //
  }

  // LISTENERS
  public addListeners(): void {
    InputManager.add(this.hitMesh)
  }

  public removeListeners(): void {
    InputManager.remove(this.hitMesh)
  }

  // RESIZE
  public resize = (width: number, height: number, dpr: number): void => {
    if (!this.mesh) return

    this.domElement.resize()
    this.material.needsUpdate = true
  }

  // UPDATE
  public update = (time: number, delta: number, frame: number): void => {
    if (!this.mesh) return

    this.material.uTime = time
    this.domElement.checkBounds()
  }

  // DESTROY
  public destroy = (): void => {
    InputManager.cleanup()
    this.remove(this.mesh)
    this.remove(this.hitMesh)
    this.material.dispose()
    this.geometry.dispose()
  }
}
