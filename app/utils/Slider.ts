import { checkTween } from '@vendor/checkTween'
import { debounce } from '@vendor/debounce'

interface SlideElements {
  slide: HTMLElement
  slideFigure: HTMLElement
  slideMedia: HTMLElement
  slideInfoTitle: HTMLElement[]
  slideInfoSubtitle: HTMLElement[]
  slideNumber: HTMLElement
  slideButton: HTMLElement
}

interface SliderOptions {
  container: string | HTMLElement
  slideSelector: string
  nextButton: string | HTMLElement
  prevButton: string | HTMLElement
  duration?: number
  ease?: string
  autoplay?: boolean
  autoplaySpeed?: number
  onSlideChange?: (index: number) => void
}

type SlideDirection = 'next' | 'previous'

export class Slider {
  private readonly gsap = useNuxtApp().$gsap
  private readonly selectAll = useTools().selectAll
  private readonly CL = useTools().CL

  private currentIndex: number = 0
  private slides: HTMLElement[] = []
  private totalSlides: number = 0
  private isAnimating: boolean = false
  private nextButton: HTMLElement
  private prevButton: HTMLElement
  private container: HTMLElement
  private options: SliderOptions
  private progressLine: HTMLElement | null = null

  private direction: SlideDirection = 'next'
  private autoplayInterval: number | null = null
  private animation: gsap.core.Timeline | null = null
  private progressAnimation: gsap.core.Timeline | null = null
  private progressResetAnimation: gsap.core.Timeline | null = null
  private elementsCache: Map<number, SlideElements> = new Map()
  private isTransitioning = false
  private isProgressResetting = false

  constructor(options: SliderOptions) {
    this.options = {
      duration: 1.1,
      ease: '--o7',
      autoplay: false,
      autoplaySpeed: 7000, // ms
      ...options
    }

    this.container =
      typeof options.container === 'string'
        ? (document.querySelector(options.container) as HTMLElement)
        : (options.container as HTMLElement)

    if (!this.container) {
      throw new Error('Slider: Container not found')
    }

    this.slides = Array.from(
      this.container.querySelectorAll(options.slideSelector)
    ) as HTMLElement[]

    this.totalSlides = this.slides.length
    if (this.totalSlides === 0) {
      throw new Error('Slider: No slides found')
    }

    this.nextButton =
      typeof options.nextButton === 'string'
        ? (document.querySelector(options.nextButton) as HTMLElement)
        : (options.nextButton as HTMLElement)

    this.prevButton =
      typeof options.prevButton === 'string'
        ? (document.querySelector(options.prevButton) as HTMLElement)
        : (options.prevButton as HTMLElement)

    if (!this.nextButton || !this.prevButton) {
      throw new Error('Slider: Navigation buttons not found')
    }

    this.progressLine = this.container.querySelector('.ho-progress-line')

    this.init()
  }

  /**
   * INIT
   */
  public init(): void {
    this.addListeners()
  }

  /**
   * LISTENERS
   */
  private addListeners(): void {
    this.nextButton.addEventListener('click', this.handleNextClick.bind(this))
    this.prevButton.addEventListener('click', this.handlePrevClick.bind(this))
  }

  private removeListeners(): void {
    this.nextButton.removeEventListener('click', this.handleNextClick.bind(this))
    this.prevButton.removeEventListener('click', this.handlePrevClick.bind(this))
  }

  /**
   * EVENTS
   */
  private handleNextClick = (e: Event): void => {
    e.preventDefault()
    if (this.isTransitioning) return

    if (this.options.autoplay) {
      this.resetProgressLine()
      this.pauseAutoplay()
    }
    this.nextSlide()
  }

  private handlePrevClick = (e: Event): void => {
    e.preventDefault()
    if (this.isTransitioning) return

    if (this.options.autoplay) {
      this.resetProgressLine()
      this.pauseAutoplay()
    }
    this.previousSlide()
  }

  /**
   * GET ELEMENTS
   */
  private getSlideElements(index: number): SlideElements {
    if (this.elementsCache.has(index)) {
      return this.elementsCache.get(index)!
    }

    const slide = this.slides[index]
    const slideInfo = this.selectAll('.ho-content-item', this.container)[index]
    const slideNumber = this.selectAll('.ho-content-number', this.container)[index]
    const slideButton = this.selectAll('.ho-slider-btns-item', this.container)[index]

    const slideFigure = slide.querySelector('figure') as HTMLElement
    const slideMedia = slide.querySelector('img, video') as HTMLElement
    const slideInfoTitle = this.selectAll('.ho-content-title .b', slideInfo)
    const slideInfoSubtitle = this.selectAll('.ho-content-subtitle .l', slideInfo)

    const elements: SlideElements = {
      slide,
      slideFigure,
      slideMedia,
      slideInfoTitle,
      slideInfoSubtitle,
      slideNumber,
      slideButton
    }

    this.elementsCache.set(index, elements)
    return elements
  }

  /**
   * ANIMATE PROGRESS LINE
   */
  private animateProgressLine(): void {
    if (!this.progressLine || !this.options.autoplay || this.isProgressResetting) return

    // checkTween(this.progressAnimation)

    this.progressAnimation = this.gsap.timeline({
      onComplete: () => {
        if (this.options.autoplay && !this.isTransitioning) {
          this.nextSlide()
        }
      }
    })

    const duration = this.options.autoplaySpeed ? this.options.autoplaySpeed / 1000 : 7

    this.progressAnimation.set(this.progressLine, {
      y: 0,
      height: '0%',
      force3D: true
    })
    this.progressAnimation.to(this.progressLine, {
      height: '100%',
      duration: duration - 0.1,
      ease: 'none',
      overwrite: true
    })
  }

  /**
   * RESET PROGRESS LINE
   */
  private resetProgressLine(): void {
    if (!this.progressLine || this.isProgressResetting) return

    this.isProgressResetting = true
    // checkTween(this.progressResetAnimation)

    this.progressResetAnimation = this.gsap.timeline({
      onComplete: () => {
        this.isProgressResetting = false
        this.gsap.set(this.progressLine, {
          y: 0,
          height: '0%'
        })
      }
    })

    this.progressResetAnimation.to(this.progressLine, {
      y: '100vh',
      force3D: true,
      duration: 1,
      ease: 'transitionOut'
    })
  }

  /**
   * SHOW SLIDE
   */
  public showSlide(index: number, type?: SlideDirection): gsap.core.Timeline {
    if (this.isTransitioning) return this.gsap.timeline()
    this.isTransitioning = true

    const elements = this.getSlideElements(index)
    const { slideFigure, slideMedia, slideInfoTitle, slideInfoSubtitle, slideNumber, slideButton } =
      elements

    const timeline = this.gsap.timeline({
      defaults: {
        duration: this.options.duration,
        ease: this.options.ease
      },
      onStart: () => {
        this.gsap.delayedCall(0.4, () => {
          this.isTransitioning = false
        })
        if (this.options.onSlideChange) {
          this.options.onSlideChange(index)
        }
      },
      onComplete: () => {
        if (this.options.autoplay) {
          this.gsap.delayedCall(0.1, () => {
            this.startAutoplay()
          })
        }
      }
    })

    timeline.add('start', 0)
    timeline.add(() => this.CL.a(slideButton, 'active'), 'start')
    timeline.fromTo(
      slideFigure,
      { clipPath: type === 'previous' ? 'inset(0px 100% 0px 0%)' : 'inset(0px 0% 0px 100%)' },
      { clipPath: 'inset(0px 0% 0px 0%)' },
      'start'
    )
    timeline.fromTo(
      slideMedia,
      {
        x: type === 'previous' ? '-30%' : '30%',
        scale: 1.2,
        force3D: true
      },
      {
        x: 0,
        scale: 1,
        force3D: true
      },
      'start'
    )
    timeline.fromTo(
      slideInfoTitle,
      { opacity: 0, filter: 'blur(100px)' },
      {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1,
        ease: '--io3',
        onUpdate: () => {
          const progress = timeline.progress()
          if (progress < 0.5) {
            const fraction = progress * 2
            this.gsap.set(slideInfoTitle, {
              opacity: Math.pow(fraction, 0.5),
              filter: `blur(${Math.min(8 / (fraction + 0.001) - 8, 100)}px)`,
              stagger: { each: 0.06, from: 'start' }
            })
          }
        }
      },
      'start+=0.1'
    )
    timeline.fromTo(
      slideInfoSubtitle,
      { y: type === 'previous' ? '-110%' : '110%' },
      {
        y: '0%',
        duration: 1.2,
        ease: '--o56'
      },
      'start+=0.3'
    )
    timeline.fromTo(
      slideNumber,
      { y: type === 'previous' ? '-170%' : '170%' },
      {
        y: '0%',
        duration: 1,
        ease: '--o56'
      },
      'start'
    )

    return timeline
  }

  /**
   * HIDE SLIDE
   */
  public hideSlide(index: number, type: SlideDirection): gsap.core.Timeline {
    const elements = this.getSlideElements(index)
    const { slideFigure, slideMedia, slideInfoTitle, slideInfoSubtitle, slideNumber, slideButton } =
      elements

    const timeline = this.gsap.timeline({
      defaults: {
        duration: this.options.duration,
        ease: this.options.ease
      }
    })

    timeline.add('start', 0.08)
    timeline.add(() => this.CL.r(slideButton, 'active'), 'start')
    timeline.to(
      slideFigure,
      { clipPath: type === 'next' ? 'inset(0px 100% 0px 0%)' : 'inset(0px 0% 0px 100%)' },
      'start'
    )
    timeline.to(
      slideMedia,
      {
        x: type === 'next' ? '-30%' : '30%',
        scale: 1.2,
        force3D: true
      },
      'start'
    )
    timeline.to(
      slideInfoTitle,
      {
        opacity: 0,
        filter: 'blur(100px)',
        duration: 1,
        ease: '--io3',
        overwrite: true,
        onUpdate: () => {
          const progress = timeline.progress()
          if (progress < 0.5) {
            const fraction = 1 - progress * 2
            this.gsap.set(slideInfoTitle, {
              opacity: Math.pow(fraction, 0.5),
              filter: `blur(${Math.min(8 / (fraction + 0.001) - 8, 100)}px)`,
              stagger: { each: 0.06, from: 'start' }
            })
          }
        }
      },
      'start+=0.1'
    )
    timeline.to(
      slideInfoSubtitle,
      {
        y: type === 'next' ? '-110%' : '110%',
        duration: 1,
        ease: '--o56',
        overwrite: true
      },
      'start'
    )
    timeline.to(
      slideNumber,
      {
        y: type === 'next' ? '-120%' : '120%',
        duration: 0.8,
        ease: '--o56',
        overwrite: true
      },
      'start'
    )

    return timeline
  }

  /**
   * NEXT SLIDE
   */
  public nextSlide(): void {
    if (this.isTransitioning) return

    this.resetProgressLine()
    this.direction = 'next'
    const currentIndex = this.currentIndex
    const nextIndex = (this.currentIndex + 1) % this.totalSlides

    this.hideSlide(currentIndex, 'next')
    this.currentIndex = nextIndex
    this.showSlide(nextIndex, 'next')
  }

  /**
   * PREVIOUS SLIDE
   */
  public previousSlide(): void {
    if (this.isTransitioning) return

    this.resetProgressLine()
    this.direction = 'previous'
    const currentIndex = this.currentIndex
    const prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides

    this.hideSlide(currentIndex, 'previous')
    this.currentIndex = prevIndex
    this.showSlide(prevIndex, 'previous')
  }

  /**
   * GO TO SLIDE
   */
  public goToSlide(index: number): void {
    if (
      index === this.currentIndex ||
      index >= this.totalSlides ||
      index < 0 ||
      this.isTransitioning
    )
      return

    if (this.options.autoplay) {
      this.pauseAutoplay()
      this.resetProgressLine()
    }

    const direction: SlideDirection = index > this.currentIndex ? 'next' : 'previous'

    this.hideSlide(this.currentIndex, direction)
    this.currentIndex = index
    this.showSlide(index, direction)
  }

  /**
   * START AUTOPLAY
   */
  public startAutoplay(): void {
    this.pauseAutoplay()

    if (this.isProgressResetting) {
      this.gsap.delayedCall(0.5, () => this.startAutoplay())
      return
    }

    this.animateProgressLine()
  }

  /**
   * PAUSE AUTOPLAY
   */
  public pauseAutoplay(): void {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval)
      this.autoplayInterval = null
    }

    checkTween(this.progressAnimation)
  }

  /**
   * DESTROY
   */
  public destroy(): void {
    this.pauseAutoplay()
    this.removeListeners()
    this.gsap.killTweensOf(this.slides)

    if (this.progressAnimation) {
      this.progressAnimation.kill()
    }

    if (this.progressResetAnimation) {
      this.progressResetAnimation.kill()
    }

    this.elementsCache.clear()
  }
}
