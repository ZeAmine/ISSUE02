import type { SceneView } from '@webgl/views/SceneView'

export class TransitionManager {
  private static sceneView: SceneView
  private static isTransitioning: boolean = false

  public static init(sceneView: SceneView) {
    if (!sceneView) {
      throw new Error('WEBGL: SceneView is not defined')
    }

    this.sceneView = sceneView
  }

  public static async onLeave({ element, path }: Partial<ITransitionParams>) {
    if (!element || !path) return

    this.isTransitioning = true

    try {
      await this.sceneView.cleanView(path.fromRoute)
    } catch (error: any) {
      throw new Error('Error during transition leave:', error)
    } finally {
      this.isTransitioning = false
    }
  }

  public static async onEnter({ element, path }: Partial<ITransitionParams>) {
    if (!element || !path) return

    try {
      await this.sceneView.setupView(path.toRoute)
    } catch (error: any) {
      throw new Error('Error during transition leave:', error)
    } finally {
      this.isTransitioning = false
    }
  }

  private static handlePopState = () => {
    if (this.isTransitioning) {
      window.history.go(1)
    }
  }

  private static addListeners(): void {
    window.addEventListener('popstate', this.handlePopState)
  }

  public static destroy(): void {
    window.removeEventListener('popstate', this.handlePopState)
  }
}
