import { BaseAnimation } from '../BaseAnimation'

import type { AnimationElement, BaseAnimationConfig } from '../BaseAnimation'

interface ParallaxAnimationElement extends AnimationElement {
  element: HTMLElement | HTMLElement[]
}

interface ParallaxAnimationConfig<T extends ParallaxAnimationElement>
  extends BaseAnimationConfig<T> {
  speed?: number
  direction?: 'vertical' | 'horizontal'
  bounds?: {
    start?: number
    end?: number
  }
}

/**
 * Parallax animation example using BaseAnimation
 * Demonstrates scroll-based animation with performance optimizations
 */
export class ParallaxAnimation<
  T extends ParallaxAnimationElement = ParallaxAnimationElement
> extends BaseAnimation<T> {
  private speed: number
  private direction: 'vertical' | 'horizontal'
  private bounds: { start: number; end: number }
  private lastScrollY = 0
  private ticking = false

  constructor(config: ParallaxAnimationConfig<T>) {
    super({
      ...config,
      performance: { useRAF: true, autoCleanup: true },
      customDefaults: {
        ease: 'none'
      }
    })

    this.speed = config.speed || 0.5
    this.direction = config.direction || 'vertical'
    this.bounds = {
      start: config.bounds?.start || 0,
      end: config.bounds?.end || window.innerHeight
    }

    this.initAnimation()
    this.addListeners()
  }

  public initAnimation(): void {
    const elements = this.getElementsArray()

    // Set initial positions
    gsap.set(elements, {
      y: 0,
      x: 0,
      force3D: true // Enable hardware acceleration
    })

    // Create the parallax timeline (we'll control it manually)
    this.tl.clear()
    this.tl.set(elements, { y: 0 }) // Base position
  }

  public addListeners(): void {
    const scrollHandler = this.createRAFHandler('scroll', () => this.handleScroll())
    window.addEventListener('scroll', scrollHandler, { passive: true })

    const resizeHandler = this.createRAFHandler('resize', () => this.handleResize())
    window.addEventListener('resize', resizeHandler, { passive: true })
  }

  protected removeListeners(): void {
    // RAF handler cleanup is handled by base class
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('resize', this.handleResize)
  }

  private handleScroll = (): void => {
    this.lastScrollY = window.scrollY

    if (!this.ticking) {
      this.updateParallax()
      this.ticking = true
    }
  }

  private handleResize = (): void => {
    this.bounds.end = window.innerHeight
    this.updateParallax()
  }

  private updateParallax(): void {
    const elements = this.getElementsArray()
    const scrollY = this.lastScrollY

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect()
      const elementTop = rect.top + scrollY
      const elementBottom = elementTop + rect.height

      // Check if element is in viewport bounds
      if (elementBottom >= this.bounds.start && elementTop <= this.bounds.end + scrollY) {
        const progress =
          (scrollY - elementTop + window.innerHeight) / (window.innerHeight + rect.height)
        const clampedProgress = Math.max(0, Math.min(1, progress))

        // Calculate parallax offset
        const offset = (clampedProgress - 0.5) * this.speed * 100

        if (this.direction === 'vertical') {
          gsap.set(element, { y: offset })
        } else {
          gsap.set(element, { x: offset })
        }
      }
    })

    this.ticking = false
  }

  // Public methods for dynamic control
  public setSpeed(speed: number): void {
    this.speed = speed
    this.updateParallax()
  }

  public setBounds(start: number, end: number): void {
    this.bounds = { start, end }
    this.updateParallax()
  }

  public override pause(): void {
    super.pause()
    this.removeListeners()
  }

  public override play(): void {
    super.play()
    this.addListeners()
  }

  protected override onAnimationUpdate(): void {
    super.onAnimationUpdate()
    // Could be used for additional per-frame updates
  }

  protected override cleanup(): void {
    super.cleanup()
    this.removeListeners()

    // Reset all transforms
    const elements = this.getElementsArray()
    gsap.set(elements, { clearProps: 'transform' })
  }
}
