import { BaseAnimation } from '../BaseAnimation'

import type { AnimationElement, BaseAnimationConfig } from '../BaseAnimation'

interface ScrollAnimationElement extends AnimationElement {
  element: HTMLElement | HTMLElement[]
}

interface ScrollAnimationConfig<T extends ScrollAnimationElement> extends BaseAnimationConfig<T> {
  trigger?: HTMLElement
  threshold?: number
  offset?: string
  once?: boolean
}

/**
 * Scroll-triggered animation example using BaseAnimation
 * Demonstrates intersection observer integration with the base animation system
 */
export class ScrollTriggerAnimation<
  T extends ScrollAnimationElement = ScrollAnimationElement
> extends BaseAnimation<T> {
  private trigger?: HTMLElement
  private threshold: number
  private offset: string
  private once: boolean
  private observer?: IntersectionObserver
  private isVisible = false

  constructor(config: ScrollAnimationConfig<T>) {
    super({
      ...config,
      performance: { useRAF: true, autoCleanup: true },
      customDefaults: {
        duration: 0.8,
        ease: 'power2.out'
      }
    })

    this.trigger = config.trigger || this.getElementsArray()[0]
    this.threshold = config.threshold || 0.2
    this.offset = config.offset || '0px'
    this.once = config.once ?? true

    this.initAnimation()
    this.addListeners()
  }

  public initAnimation(): void {
    const elements = this.getElementsArray()

    // Set initial states - elements start hidden and transformed
    gsap.set(elements, {
      opacity: 0,
      y: 50,
      scale: 0.95
    })

    // Create enter animation
    this.tl.clear()
    this.tl.to(elements, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out'
    })
  }

  public addListeners(): void {
    if (!this.trigger) return

    // Create intersection observer for scroll detection
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.isVisible) {
            this.handleEnterView()
          } else if (!entry.isIntersecting && this.isVisible && !this.once) {
            this.handleLeaveView()
          }
        })
      },
      {
        threshold: this.threshold,
        rootMargin: this.offset
      }
    )

    this.observer.observe(this.trigger)
  }

  protected removeListeners(): void {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = undefined
    }
  }

  private handleEnterView(): void {
    this.isVisible = true
    this.play()

    if (this.config.debug) {
      console.log('🔍 Element entered viewport')
    }
  }

  private handleLeaveView(): void {
    if (this.once) return

    this.isVisible = false
    this.reverse()

    if (this.config.debug) {
      console.log('🔍 Element left viewport')
    }
  }

  // Public methods for manual control
  public triggerAnimation(): void {
    this.handleEnterView()
  }

  public resetAnimation(): void {
    this.isVisible = false
    this.stop()
    this.initAnimation()
  }

  protected override onAnimationStart(): void {
    super.onAnimationStart()
    if (this.config.debug) {
      console.log('🎬 Scroll animation started')
    }
  }

  protected override onAnimationComplete(): void {
    super.onAnimationComplete()
    if (this.config.debug) {
      console.log('✅ Scroll animation completed')
    }
  }

  protected override cleanup(): void {
    super.cleanup()
    this.removeListeners()
  }
}
