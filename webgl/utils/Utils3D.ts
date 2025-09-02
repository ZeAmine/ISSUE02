import {
  Box2,
  BoxGeometry,
  BufferGeometry,
  Float32BufferAttribute,
  MathUtils,
  Vector2,
  Vector3,
  WebGLRenderTarget,
  type PerspectiveCamera,
  type Camera,
  type Mesh,
  type RenderTargetOptions
} from 'three'

interface FrustumDimensions {
  width: number
  height: number
}

interface DoubleRenderTarget {
  read: WebGLRenderTarget
  write: WebGLRenderTarget
  swap: () => void
  setSize: (width: number, height: number) => void
  dispose: () => void
}

export type DOMVector2 = {
  x: number
  y: number
}

export function getFullscreenTriangle(): BufferGeometry {
  const geometry = new BufferGeometry()
  geometry.setAttribute(
    'position',
    new Float32BufferAttribute([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3)
  )
  geometry.setAttribute('uv', new Float32BufferAttribute([0, 2, 0, 0, 2, 0], 2))

  return geometry
}

export function getSphericalCube(radius: number, segments: number): BufferGeometry {
  const geometry = new BoxGeometry(radius, radius, radius, segments, segments, segments)
  const vertices = geometry.getAttribute('position')
  const normals = geometry.getAttribute('normal')

  for (let i = 0; i < vertices.count; i++) {
    const v = new Vector3().fromArray(vertices.array, i * 3)
    v.normalize()
    normals.setXYZ(i, v.x, v.y, v.z)
    v.setLength(radius)
    vertices.setXYZ(i, v.x, v.y, v.z)
  }

  return geometry
}

export function getScreenSpaceBox(mesh: Mesh, camera: Camera): Box2 {
  const vertices = mesh.geometry.getAttribute('position')
  const worldPosition = new Vector3()
  const screenSpacePosition = new Vector3()
  const min = new Vector3(1, 1, 1)
  const max = new Vector3(-1, -1, -1)

  for (let i = 0; i < vertices.count; i++) {
    worldPosition.fromArray(vertices.array, i * 3).applyMatrix4(mesh.matrixWorld)
    screenSpacePosition.copy(worldPosition).project(camera)
    min.min(screenSpacePosition)
    max.max(screenSpacePosition)
  }

  return new Box2(new Vector2(min.x, min.y), new Vector2(max.x, max.y))
}

export function getFrustum(
  camera: PerspectiveCamera,
  offsetZ: number = 0
): FrustumDimensions {
  const distance = camera.position.z - offsetZ
  const fov = MathUtils.degToRad(camera.fov)
  const height = 2 * Math.tan(fov / 2) * distance
  const width = height * camera.aspect

  return { width, height }
}

export function getFrustumFromHeight(
  camera: PerspectiveCamera,
  height: number,
  offsetZ: number = 0
): number {
  const distance = camera.position.z - offsetZ
  const fov = MathUtils.radToDeg(2 * Math.atan(height / (2 * distance)))

  return fov
}

export function lerpCameras(
  camera1: PerspectiveCamera,
  camera2: PerspectiveCamera,
  alpha: number
): void {
  if (camera1.fov !== camera2.fov || camera1.zoom !== camera2.zoom) {
    if (camera1.fov !== camera2.fov) {
      camera1.fov = MathUtils.lerp(camera1.fov, camera2.fov, alpha)
    }

    if (camera1.zoom !== camera2.zoom) {
      camera1.zoom = MathUtils.lerp(camera1.zoom, camera2.zoom, alpha)
    }

    camera1.updateProjectionMatrix()
  }

  camera1.position.lerp(camera2.position, alpha)
  camera1.quaternion.slerp(camera2.quaternion, alpha)
}

export function getDoubleRenderTarget(
  width: number,
  height: number,
  options: RenderTargetOptions = {}
): DoubleRenderTarget {
  const renderTarget: DoubleRenderTarget = {
    read: new WebGLRenderTarget(width, height, options),
    write: new WebGLRenderTarget(width, height, options),
    swap: () => {
      const temp = renderTarget.read
      renderTarget.read = renderTarget.write
      renderTarget.write = temp
    },
    setSize: (width: number, height: number) => {
      renderTarget.read.setSize(width, height)
      renderTarget.write.setSize(width, height)
    },
    dispose: () => {
      renderTarget.read.dispose()
      renderTarget.write.dispose()
    }
  }

  return renderTarget
}

export const DOMScale = (
  camera: PerspectiveCamera,
  size: DOMVector2 = { x: window.innerWidth, y: window.innerHeight },
  screen: DOMVector2 = { x: window.innerWidth, y: window.innerHeight }
): DOMVector2 => {
  const vp = DOMViewport(camera)

  const x = (size.x / screen.x) * vp.x
  const y = (size.y / screen.y) * vp.y

  return { x, y } as DOMVector2
}

export const DOMPosition = (
  camera: PerspectiveCamera,
  pos: DOMVector2 = { x: 0, y: 0 },
  screen: DOMVector2 = { x: window.innerWidth, y: window.innerHeight },
  scale: DOMVector2 = { x: 1, y: 1 }
): DOMVector2 => {
  const vp = DOMViewport(camera)

  const x = scale.x / 2 - vp.x / 2 + (pos.x / screen.x) * vp.x
  const y = -(scale.y / 2) + vp.y / 2 - (pos.y / screen.y) * vp.y

  return { x, y } as DOMVector2
}

export const DOMViewport = (camera: PerspectiveCamera): DOMVector2 => {
  const fov = camera.fov * (Math.PI / 180)
  const y = 2 * Math.tan(fov / 2) * camera.position.z
  const x = y * camera.aspect

  return { x, y } as DOMVector2
}
