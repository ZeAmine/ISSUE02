export interface Resource {
  name: string
  type: string
  path: string
  namespace?: string | null
  preload?: boolean | null
  pathMobile?: string | null
  options?: []
  data?: []
}

export interface CubeResource extends Resource {
  path: string[]
}

export abstract class BaseLoader {
  abstract loader?: any

  abstract load(resource: Resource): Promise<any>
}

export type Loader<T extends BaseLoader> = T

export interface InteractiveObject extends Mesh {
  onHover: (event: { type: 'over' | 'out'; target: InteractiveObject }) => void
  onClick: (event: { target: InteractiveObject }) => void
  parent: Group | Object3D
}

export interface ITexture {
  texture: Texture
  size: Vector2
}
