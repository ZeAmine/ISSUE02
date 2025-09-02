import type { OrthographicCamera, PerspectiveCamera, Scene } from 'three'

export interface SceneInterface extends Scene {
  setup(...args: any[]): void
  destroy(): void
  get camera(): PerspectiveCamera | OrthographicCamera
}

export class SceneManager {
  public name!: string
  public scene!: SceneInterface

  public setup<C extends SceneInterface>(scene: new (...args: any[]) => C): C {
    const instance = new scene()

    this.name = scene.constructor.name
    this.scene = instance

    return instance
  }

  public clear() {
    this.scene.destroy()
  }
}
