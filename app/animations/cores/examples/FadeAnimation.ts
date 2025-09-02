import { BaseAnimation } from '../BaseAnimation'

import type { AnimationElement, BaseAnimationConfig } from '../BaseAnimation'

interface FadeAnimationElement extends AnimationElement {
  element: HTMLElement | HTMLElement[]
}

interface FadeAnimationConfig<T extends FadeAnimationElement> extends BaseAnimationConfig<T> {
  trigger?: HTMLElement
  duration?: number
  direction?: 'in' | 'out' | 'toggle'
  stagger?: number
}

/**
 * Simple fade animation example using BaseAnimation
 * Demonstrates how to create clean, focused animations with the new base
 */
export class FadeAnimation<
  T extends FadeAnimationElement = FadeAnimationElement
> extends BaseAnimation<T> {
  private trigger?: HTMLElement
  private direction: 'in' | 'out' | 'toggle'
  private duration: number
  private stagger: number
  private currentOpacity = 1

  constructor(config: FadeAnimationConfig<T>) {
    super({
      ...config,
      performance: { useRAF: true, autoCleanup: true },
      customDefaults: {
        duration: config.duration || 0.5,
        ease: 'power2.out'
      }
    })

    this.trigger = config.trigger
    this.direction = config.direction || 'toggle'
    this.duration = config.duration || 0.5
    this.stagger = config.stagger || 0.1

    this.initAnimation()
    this.addListeners()
  }

  public initAnimation(): void {
    const elements = this.getElementsArray()

    // Set initial states
    if (this.direction === 'out') {
      gsap.set(elements, { opacity: 1 })
      this.currentOpacity = 1
    } else {
      gsap.set(elements, { opacity: 0 })
      this.currentOpacity = 0
    }

    // Create animation timeline
    this.tl.clear()

    const targetOpacity = this.direction === 'out' ? 0 : 1

    this.tl.to(elements, {
      opacity: targetOpacity,
      duration: this.duration,
      stagger: this.stagger
    })
  }

  public addListeners(): void {
    if (!this.trigger) return

    const handler = this.createRAFHandler('click', () => this.handleTrigger())
    this.trigger.addEventListener('click', handler)
  }

  protected removeListeners(el: EventTarget): void {
    // Remove all event listeners
    el.removeEventListener('click', this.handleTrigger)
  }

  private handleTrigger = (): void => {
    if (this.direction === 'toggle') {
      if (this.currentOpacity === 0) {
        this.fadeIn()
      } else {
        this.fadeOut()
      }
    } else {
      this.play()
    }
  }

  public fadeIn(): void {
    this.direction = 'in'
    this.currentOpacity = 1
    this.initAnimation()
    this.play()
  }

  public fadeOut(): void {
    this.direction = 'out'
    this.currentOpacity = 0
    this.initAnimation()
    this.play()
  }

  protected onAnimationComplete(): void {
    super.onAnimationComplete()
    console.log(`Fade animation completed: direction=${this.direction}`)
  }
}
