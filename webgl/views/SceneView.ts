import { ROUTES } from '@/constants/routes'

import { Group } from 'three'

import { WorldController } from '@webgl/controllers/WorldController'

import { Home } from './Home/index'
import { Works } from './Works/index'

export class SceneView extends Group {
  private views: Map<string, Home | Works> = new Map()
  private currentView: Home | Works | null = null

  constructor() {
    super()

    this.initViews()
    this.initCurrentView()
  }

  private initViews(): void {
    this.views.set(ROUTES.HOME, new Home())
    this.views.set(ROUTES.WORKS, new Works())
  }

  private initCurrentView(): void {
    const currentRoute = window.location.pathname
    this.setupView(currentRoute).catch(console.error)
  }

  // METHODS
  public async setupView(path: string): Promise<void> {
    const view = this.views.get(path)
    if (!view) {
      console.warn(`WEBGL: Route non gérée: ${path}`)
      return
    }

    this.currentView = view
    this.add(view)
    view.init()
    // await view.ready()
    await view.animateIn()
    view.addListeners()
  }

  public async cleanView(path: string): Promise<void> {
    const view = this.views.get(path)
    if (!view) {
      console.warn(`WEBGL: Route non gérée: ${path}`)
      return
    }

    await view.animateOut()
    view.removeListeners()
    view.destroy()
    this.remove(view)
  }

  // RESIZE
  public resize = (width: number, height: number, dpr: number): void => {
    if (!this.currentView) return

    this.currentView?.resize(width, height, dpr)
  }

  // UPDATE
  public update = (time: number, delta: number, frame: number): void => {
    if (!this.currentView) return

    this.currentView?.update(time, delta, frame)
  }

  // DESTROY
  public destroy = (): void => {
    this.views.forEach((view) => view.destroy())
    this.views.clear()
    this.currentView = null
  }
}
