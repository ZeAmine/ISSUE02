import {
  type BufferGeometry,
  ColorManagement,
  LinearSRGBColorSpace,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  Texture,
  Vector2,
  VideoTexture,
  WebGLRenderer
} from 'three'

import { Interface } from '../utils/Interface'
import { ResourceManager } from '../utils/ResourceManager'
import { getFullscreenTriangle } from '../utils/Utils3D'

interface ITexture {
  texture: Texture
  size: Vector2
  video?: HTMLVideoElement
}

interface VideoResource {
  video: HTMLVideoElement
  texture: VideoTexture
}

export class WorldController {
  static element: Interface
  static renderer: WebGLRenderer
  static scene: Scene
  static camera: PerspectiveCamera
  static quad: PlaneGeometry
  static screenTriangle: BufferGeometry

  static viewport: Vector2
  static resolution: { value: Vector2 }
  static texelSize: { value: Vector2 }
  static aspect: { value: number }
  static time: { value: number }
  static frame: { value: number }

  static init(canvas: HTMLCanvasElement) {
    this.initWorld(canvas)

    this.addListeners()
  }

  static initWorld(canvas: HTMLCanvasElement) {
    this.scene = new Scene()

    const width = window.innerWidth
    const height = window.innerHeight
    const aspectRatio = width / height

    this.camera = new PerspectiveCamera(45, aspectRatio, 0.1, 500)
    this.camera.position.set(0, 0, 30)
    this.camera.lookAt(this.scene.position)

    this.renderer = new WebGLRenderer({
      canvas,
      powerPreference: 'high-performance',
      premultipliedAlpha: false,
      alpha: true,
      depth: true,
      stencil: false,
      antialias: true
    })

    // Output canvas
    this.element = new Interface(this.renderer.domElement)
    // this.element.css({ opacity: 0 })

    // Disable color management
    ColorManagement.enabled = false
    this.renderer.outputColorSpace = LinearSRGBColorSpace

    // Global geometries
    this.quad = new PlaneGeometry(1, 1, 20, 20)
    this.screenTriangle = getFullscreenTriangle()

    // Global uniforms
    this.viewport = new Vector2(width, height)

    this.resolution = { value: new Vector2() }
    this.texelSize = { value: new Vector2() }
    this.aspect = { value: 1 }
    this.time = { value: 0 }
    this.frame = { value: 0 }
  }

  // EVENTS
  static onTouchStart = (e: TouchEvent) => {
    console.log(e, 'touchstart')
    e.preventDefault()
  }

  // LISTENERS
  static addListeners() {
    this.renderer.domElement.addEventListener('touchstart', this.onTouchStart)
  }

  // RESIZE
  static resize = (width: number, height: number, dpr: number) => {
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    this.viewport.set(width, height)

    // Update renderer size with DPR
    width = Math.round(width * dpr)
    height = Math.round(height * dpr)

    this.resolution.value.set(width, height)
    this.texelSize.value.set(1 / width, 1 / height)
    this.aspect.value = width / height
  }

  // UPDATE
  static update = (time: number, delta: number, frame: number) => {
    this.time.value = time
    this.frame.value = frame
  }

  // GLOBAL HANDLERS
  static getAllTextures(type: string): ITexture[] {
    return ResourceManager.resources
      .filter((resource) => resource.type === type)
      .map((resource) => WorldController.getTexture(resource.name))
  }

  static getTexture(name: string): ITexture {
    const resource = ResourceManager.get(name)
    if (!resource?.data) {
      throw new Error(`Resource "${name}" not found or has no data`)
    }

    const { data, type } = resource

    return type === 'video'
      ? WorldController.createVideoTexture(name, data as unknown as VideoResource)
      : WorldController.createImageTexture(name, data as unknown as Texture)
  }

  private static createVideoTexture(name: string, videoData: VideoResource): ITexture {
    if (!videoData.video || !(videoData.video instanceof HTMLVideoElement)) {
      throw new Error(`Invalid video element in resource "${name}"`)
    }

    if (!videoData.texture || !(videoData.texture instanceof VideoTexture)) {
      throw new Error(`Invalid video texture in resource "${name}"`)
    }

    const size = new Vector2(videoData.video.videoWidth || 0, videoData.video.videoHeight || 0)

    if (size.x === 0 || size.y === 0) {
      console.warn(`Video dimensions not available yet for resource "${name}"`)
    }

    return {
      texture: videoData.texture,
      video: videoData.video,
      size
    }
  }

  private static createImageTexture(name: string, imageTexture: Texture): ITexture {
    if (!(imageTexture instanceof Texture)) {
      throw new Error(`Invalid image texture in resource "${name}"`)
    }

    if (!imageTexture.image) {
      throw new Error(`Texture image not loaded for resource "${name}"`)
    }

    const size = new Vector2(
      imageTexture.image instanceof HTMLImageElement
        ? imageTexture.image.naturalWidth || imageTexture.image.width
        : imageTexture.image.width || 0,
      imageTexture.image instanceof HTMLImageElement
        ? imageTexture.image.naturalHeight || imageTexture.image.height
        : imageTexture.image.height || 0
    )

    if (size.x === 0 || size.y === 0) {
      console.warn(`Image dimensions not available for resource "${name}"`)
    }

    return {
      texture: imageTexture,
      size
    }
  }
}
