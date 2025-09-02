import { Group } from 'three'

import { WorldController } from '../../controllers/WorldController'

import { Media } from './Media'

import { InputManager } from '@webgl/controllers/InputManager'

export class Works extends Group {
  private mediasEl: HTMLElement[] = []
  private works: Media[] = []

  constructor() {
    super()

    this.visible = true
  }

  public init = (): void => {
    this.initElements()
    this.initItems()
  }

  private initElements(): void {
    this.mediasEl = Array.from(document.querySelectorAll('.works-media'))
  }

  private initItems(): void {
    const { quad } = WorldController
    for (let i = 0; i < this.mediasEl.length; i++) {
      const media = new Media({
        index: i,
        geometry: quad,
        image: `texture-${i + 1}`,
        mediaElement: this.mediasEl[i]
      })
      this.add(media)
      this.works.push(media)
    }
  }

  // ANIMATIONS
  public animateIn = (): Promise<void> => {
    return new Promise((resolve) => {
      this.works.forEach((work: Media) => work.in(resolve))
    })
  }

  public animateOut = (): Promise<void> => {
    return new Promise((resolve) => {
      this.works.forEach((work: Media) => work.out(resolve))
    })
  }

  // LISTENERS
  public addListeners(): void {
    this.works.forEach((work: Media) => {
      InputManager.add(work.hitMesh)
    })
  }

  public removeListeners(): void {
    this.works.forEach((work: Media) => {
      InputManager.remove(work.hitMesh)
    })
  }

  // RESIZE
  public resize = (width: number, height: number, dpr: number): void => {
    this.works.forEach((work: Media) => {
      work.resize(width, height, dpr)
    })
  }

  // UPDATE
  public update = (time: number, delta: number, frame: number): void => {
    this.works.forEach((work: Media) => {
      work.update(time, delta, frame)
    })
  }

  // DESTROY
  public destroy = (): void => {
    InputManager.cleanup()
    this.works.forEach((work: Media) => {
      work.destroy()
      this.remove(work)
    })
    this.works = []
  }
}
