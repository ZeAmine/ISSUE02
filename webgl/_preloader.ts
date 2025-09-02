import Assets from './_assets'
import { ResourceManager } from './utils/ResourceManager'
import {
  ThreeGLTFDracoLoader,
  ThreeTextureLoader,
  ThreeVideoLoader
} from './utils/RessourceLoader/index'
import { Stage } from './utils/Stage'

import type { Loader, Resource } from '@/types/three'

import { EventManager } from '@/utils/EventManager'

export const isAbsolutePath = (url: string): boolean => /^(?:[a-z]+:)?\/\//i.test(url)

export class Preloader extends EventManager {
  public static resources: Resource[] = []
  private static loaders: { [name: string]: Loader<any> } = {}
  private static pathDefault: string = ''

  private pending: Resource[] = []
  private progress = 0
  private loaded = 0

  declare onPreloadStart: (...args: any[]) => void
  declare onPreloadProgress: () => void
  declare onPreloadComplete: () => void
  declare onPreloadError: (error?: any) => void

  constructor() {
    super()

    window.assets = {}

    this.onPreloadStart = this.handlePreloadStart.bind(this)
    this.onPreloadProgress = this.handlePreloadProgress.bind(this)
    this.onPreloadComplete = this.handlePreloadComplete.bind(this)
    this.onPreloadError = this.handlePreloadError.bind(this)
  }

  public init() {
    this.initStage()
    this.initRegister()
    this.initLoader()
  }

  private initStage() {
    Stage.init()
  }

  private initRegister(): void {
    Preloader.register(ThreeTextureLoader, 'texture')
    Preloader.register(ThreeVideoLoader, 'video')
    Preloader.register(ThreeTextureLoader, 'font')
    Preloader.register(ThreeGLTFDracoLoader, 'gltf-draco', { decoder: '/vendor/draco/' })
  }

  private initLoader() {
    const promises = []
    const resources = [...Assets]

    this.onPreloadStart(resources)

    for (const resource of resources) {
      const promise = Preloader.load(resource)
      promises.push(promise)
      promise.then(this.onPreloadProgress)
    }

    return Promise.all(promises)
      .then(this.onPreloadComplete)
      .catch((error: any) => this.onPreloadError(error))
  }

  // METHODS
  static register(Loader: Loader<any>, type: string, options: any = {}) {
    this.loaders[type] = new Loader({ type, ...options })
  }

  static async load(resource: Resource) {
    if (!resource.name) {
      console.error('Resource name should be defined')
      return
    }

    if (!resource.path) {
      console.error(`Could not find resource path for "${resource.name}"`)
      return
    }

    const loader = this.loaders[resource.type]

    if (!loader) {
      console.error(`No loader found for resource type: ${resource.type}`)
      return
    }

    if (Preloader.hasResource(resource)) {
      console.warn(
        `Resource with same name or path has already been added for "${resource.name}". It will not be added.`
      )
      return
    } else {
      Preloader.resources.push(resource)
    }

    if (Preloader.has(resource.name)) {
      return Preloader.get(resource.name)
    }

    const path = Array.isArray(resource.path)
      ? resource.path.map((p: string) => Preloader.resolve(p))
      : Preloader.resolve(resource.path)

    try {
      const response = await loader.load({
        path,
        name: resource.name,
        type: resource.type,
        basePath: this.pathDefault,
        options: resource.options,
        preload: true
      })

      resource.data = response
      window.assets[resource.name] = response

      const name = resource.name
      const current = Preloader.resources.filter((r: Resource) => r.data).length
      const total = Preloader.resources.length
      console.log(`--- LOADED [${current} : ${total}]: ${name}`)

      if (!Preloader.has(resource.name)) {
        Preloader.add(resource)
      }

      return response
    } catch (error) {
      console.error(`Failed to load resource ${resource.name}:`, error)
      throw error
    }
  }

  public reset(): void {
    this.progress = 0
    this.pending = []
    this.loaded = 0
  }

  // EVENTS
  private handlePreloadStart(resources: Resource[]): void {
    this.pending = resources
    eventEmitter.emit('WEBGL_LOADER:START')
  }

  private handlePreloadProgress(): void {
    this.progress = ++this.loaded / this.pending.length
    eventEmitter.emit('WEBGL_LOADER:PROGRESS', this.progress)
  }

  private handlePreloadComplete(): void {
    eventEmitter.emit('WEBGL_LOADER:COMPLETE')
  }

  private handlePreloadError(error?: any): void {
    eventEmitter.emit('WEBGL_LOADER:ERROR', error)
  }

  // RESOURCE MANAGER
  public static add(resource: Resource): void {
    ResourceManager.add(resource)
  }

  public static get(name: string | string[]): any | any[] {
    if (Array.isArray(name)) {
      return name.map((n: string) => ResourceManager.get(n).data)
    } else return ResourceManager.get(name).data
  }

  public static has(name: string): boolean {
    return ResourceManager.has(name)
  }

  public static hasResource(resource: Resource): boolean {
    return !!Preloader.resources.find(
      (r: Resource) =>
        r.type === resource.type && (r.name === resource.name || r.path === resource.path)
    )
  }

  // UTILS
  static resolve(path: string): string {
    return isAbsolutePath(path) ? path : `${Preloader.pathDefault}${path}`
  }

  static clear(): void {
    Preloader.loaders = {}
    Preloader.resources = []
  }

  // DESTROY
  public destroy(): void {
    ResourceManager.clear()
    Preloader.clear()
    this.reset()
  }
}
