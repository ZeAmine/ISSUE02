import { Observe } from '@/utils/Observe'

interface PictureConfig {
  element: HTMLElement
  aspect?: boolean
  animation?: Partial<IAnimationConfig>
}

type MediaElement = HTMLImageElement | HTMLVideoElement

export class Picture {
  private static readonly DELAY_PARAM_REGEX = /^pic-(\d+)$/
  private static readonly DEFAULT_ANIMATION: IAnimationConfig = {
    in: 1,
    out: 0.4,
    ease: '--o56',
    each: 0,
    from: 'start',
    delay: 0.5,
    delayParam: 0,
    once: true,
    noObserve: false
  }

  private readonly gsap: typeof gsap
  private target: HTMLElement | null = null
  private isVideo: boolean = false
  private mediaElement: MediaElement | null = null
  private animation: gsap.core.Tween | null = null
  private observer: Observe | null = null
  private config: IAnimationConfig
  private destroyed = false

  constructor() {
    const { $gsap: gsap } = useNuxtApp()
    this.gsap = gsap

    this.config = { ...Picture.DEFAULT_ANIMATION }
  }

  public init({ element, aspect, animation }: PictureConfig): void {
    if (this.destroyed) {
      console.warn('Attempting to initialize a destroyed Picture instance')
      return
    }

    this.target = element
    this.mediaElement = element.querySelector('img, video')
    this.isVideo = this.mediaElement?.tagName === 'VIDEO'

    if (!this.target || !this.mediaElement) {
      console.warn('Invalid Picture initialization: missing element or media')
      return
    }

    if (animation) {
      this.config = { ...this.config, ...animation }
    }

    // this.getDelayParam()
    // this.setOut()
    // this.animateIn()

    if (aspect) {
      this.setAspectRatio()
    }

    if (!this.config.noObserve) {
      this.initObserver()
    }
  }

  private initObserver(): void {
    if (!this.target) return

    this.observer = new Observe({
      element: this.target,
      config: {
        root: null,
        margin: '10px',
        threshold: 0.1
      }
    })

    this.observer.on('IN', this.isIn.bind(this))
    this.observer.on('OUT', this.isOut.bind(this))
  }

  private isIn(): void {
    if (!this.mediaElement || this.destroyed) return

    this.mediaElement.classList.add('on')

    if (this.observer && this.config.once) {
      this.observer.stop()
    }
  }

  private isOut(): void {
    if (!this.mediaElement || this.destroyed) return

    this.mediaElement.classList.remove('on')
  }

  public animateIn(): void {
    if (!this.target || this.destroyed) return

    if (this.animation) {
      this.animation.kill()
    }

    this.animation = this.gsap.to(this.target, {
      opacity: 1,
      duration: this.config.in,
      ease: this.config.ease,
      delay: this.config.delay + this.config.delayParam
    })
  }

  public animateOut(): void {
    if (!this.target || this.destroyed) return

    if (this.animation) {
      this.animation.kill()
    }

    this.animation = this.gsap.to(this.target, {
      opacity: 0,
      duration: this.config.out,
      ease: '--o3'
    })
  }

  private setIn(): void {
    if (!this.target) return

    this.gsap.set(this.target, {
      opacity: 1
    })
  }

  private setOut(): void {
    if (!this.target) return

    this.gsap.set(this.target, {
      opacity: 0
    })
  }

  // private getDelayParam(): void {
  //   if (!this.target) return
  //
  //   const delayClass = Array.from(this.target.classList)
  //     .find(cls => Picture.DELAY_PARAM_REGEX.test(cls))
  //
  //   if (delayClass) {
  //     const [, delay] = delayClass.match(Picture.DELAY_PARAM_REGEX) || []
  //     this.config.delayParam = (parseInt(delay, 10) * 100) / 1000
  //     console.log(this.config.delayParam)
  //   }
  // }

  private setAspectRatio(): void {
    if (!this.target || !this.mediaElement) return

    const aspectRatio = this.calculateAspectRatio()
    if (!aspectRatio) return

    if (aspectRatio < 1) {
      this.target.style.height = '100%'
    } else {
      this.target.style.width = '100%'
    }
    this.target.style.aspectRatio = `${aspectRatio}`
  }

  private calculateAspectRatio(): number | null {
    if (!this.mediaElement) return null

    if (this.isVideo) {
      const video = this.mediaElement as HTMLVideoElement
      return video.videoWidth / video.videoHeight || 16 / 9
    }

    const img = this.mediaElement as HTMLImageElement
    const width = img.naturalWidth
    const height = img.naturalHeight

    if (width && height) {
      img.setAttribute('width', width.toString())
      img.setAttribute('height', height.toString())
      return width / height
    }

    return 16 / 9
  }

  public destroy(): void {
    this.destroyed = true

    if (this.observer) {
      this.observer.stop()
      this.observer = null
    }

    if (this.animation) {
      this.animation.kill()
      this.animation = null
    }

    // if (this.isVideo && this.mediaElement) {
    //   ;(this.mediaElement as HTMLVideoElement).pause()
    //   ;(this.mediaElement as HTMLVideoElement).src = ''
    // }

    this.mediaElement = null
    this.target = null
  }
}
