import { type Mesh, type PerspectiveCamera, Vector2 } from 'three'

import { WorldController } from '../controllers/WorldController'

import { DOMPosition, DOMScale, type DOMVector2, DOMViewport } from './Utils3D'

interface IBounds {
  width: number
  height: number
  x: number
  y: number
}

export class DOMElement3D {
  private readonly camera: PerspectiveCamera = WorldController.camera
  private readonly viewport: Vector2 = WorldController.viewport

  private element: HTMLElement
  private mesh: Mesh
  private hitMesh?: Mesh
  private bounds: IBounds
  private scale: DOMVector2 = { x: 0, y: 0 }
  private position: DOMVector2 = { x: 0, y: 0 }
  private zIndex: number

  constructor(element: HTMLElement, mesh: Mesh, hitMesh?: Mesh, zIndex: number = 0) {
    this.element = element
    this.mesh = mesh
    this.hitMesh = hitMesh
    this.zIndex = zIndex

    this.bounds = this.getBounds()

    this.updateTransform()
  }

  private getBounds(): IBounds {
    const rect = this.element.getBoundingClientRect()
    return {
      width: this.element.offsetWidth,
      height: this.element.offsetHeight,
      x: rect.x || (this.element.offsetParent?.getBoundingClientRect()?.x ?? 0),
      y: rect.y || (this.element.offsetParent?.getBoundingClientRect()?.y ?? 0)
    }
  }

  private updateScale(): void {
    const domSize = new Vector2(this.bounds.width, this.bounds.height)
    const viewportSize = new Vector2(this.viewport.width, this.viewport.height)

    this.scale = DOMScale(this.camera, domSize, viewportSize)

    this.mesh.scale.set(this.scale.x, this.scale.y, 1)
    if (this.hitMesh) {
      this.hitMesh.scale.copy(this.mesh.scale)
    }

    if ('material' in this.mesh && this.mesh.material && 'uScale' in this.mesh.material) {
      this.mesh.material.uScale = new Vector2(this.scale.x, this.scale.y)
    }
  }

  private updatePosition(): void {
    const domPos = new Vector2(this.bounds.x, this.bounds.y)
    const viewportSize = new Vector2(this.viewport.width, this.viewport.height)

    this.position = DOMPosition(this.camera, domPos, viewportSize, this.scale)

    this.mesh.position.set(this.position.x, this.position.y, this.zIndex)
    if (this.hitMesh) {
      this.hitMesh.position.copy(this.mesh.position)
    }
  }

  public updateTransform(): void {
    this.updateScale()
    this.updatePosition()
  }

  public resize(): void {
    this.bounds = this.getBounds()

    if ('material' in this.mesh && this.mesh.material && 'uViewport' in this.mesh.material) {
      const camera = DOMViewport(WorldController.camera)
      this.mesh.material.uViewport = new Vector2(camera.x, camera.y)
    }

    this.updateTransform()
  }

  public checkBounds(): boolean {
    const newBounds = this.getBounds()
    const boundsChanged =
      newBounds.width !== this.bounds.width ||
      newBounds.height !== this.bounds.height ||
      newBounds.x !== this.bounds.x ||
      newBounds.y !== this.bounds.y

    if (boundsChanged) {
      this.bounds = newBounds
      this.updateTransform()
    }

    return boundsChanged
  }
}
