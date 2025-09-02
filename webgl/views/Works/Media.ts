import gsap from 'gsap'
import { Group, Mesh, type Object3D, type PlaneGeometry, Vector2 } from 'three'

import { WorldController } from '@webgl/controllers/WorldController'
import { WorksMaterial } from '@webgl/materials/works'
import { DOMPosition, DOMScale, type DOMVector2, DOMViewport } from '@webgl/utils/Utils3D'
import { DOMElement3D } from '@webgl/utils/DOMElement3D'

interface InteractiveObject extends Mesh {
  onHover: (event: { type: 'over' | 'out'; target?: InteractiveObject }) => void
  onClick: (event: { target: InteractiveObject }) => void
  parent: Group | Object3D
}

interface IWorkProps {
  index: number
  geometry: PlaneGeometry
  image: string
  mediaElement: HTMLElement
}

export class Media extends Group {
  private readonly index: number
  private readonly geometry: PlaneGeometry
  private material!: WorksMaterial
  private readonly image: string
  private readonly mediaElement: HTMLElement
  private mesh!: Mesh
  public hitMesh!: InteractiveObject
  private domElement!: DOMElement3D

  constructor({ index, geometry, image, mediaElement }: IWorkProps) {
    super()

    this.index = index
    this.geometry = geometry
    this.image = image
    this.mediaElement = mediaElement

    this.createMesh()
  }

  // SETUP
  private createMesh(): void {
    const { aspect, camera, getTexture } = WorldController
    const { texture, size } = getTexture(this.image)
    const viewport = DOMViewport(camera)

    this.material = new WorksMaterial({
      uTexture: texture,
      uResolution: new Vector2(size.width, size.height),
      uScale: new Vector2(1, 1),
      uViewport: new Vector2(viewport.x, viewport.y),
      uAspect: aspect.value,
      uAlpha: 0
    })
    this.mesh = new Mesh(this.geometry, this.material)

    const hitMesh = new Mesh(this.geometry)
    hitMesh.visible = false
    this.hitMesh = hitMesh as Mesh as InteractiveObject

    this.add(this.mesh)
    this.add(this.hitMesh)

    this.domElement = new DOMElement3D(
      this.mediaElement,
      this.mesh,
      this.hitMesh,
      0.01 * this.index
    )
  }

  // EVENTS
  public onHover = (event: { type: 'over' | 'out'; target?: InteractiveObject }): void => {
    console.log('Work hovered:', this.index, event.type)
  }

  public onClick = (): void => {
    console.log('Work clicked:', this.index)
  }

  // ANIMATIONS
  public in = (resolve: any): void => {
    const { uAlpha } = this.material.uniforms
    gsap.killTweensOf(uAlpha)
    gsap.fromTo(
      uAlpha,
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
  }

  public out = (resolve: any): void => {
    const { uAlpha } = this.material.uniforms
    gsap.killTweensOf(uAlpha)
    gsap.fromTo(
      uAlpha,
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
    this.remove(this.mesh)
    this.remove(this.hitMesh)
    this.material.dispose()
    this.geometry.dispose()
  }
}
