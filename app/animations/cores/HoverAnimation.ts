import { BaseAnimation } from './BaseAnimation'

import type { AnimationElement, BaseAnimationConfig } from './BaseAnimation'

interface HoverAnimationElement extends AnimationElement {
  enter: gsap.TweenVars
  leave: gsap.TweenVars
}

interface HoverAnimationConfig<T extends HoverAnimationElement> extends BaseAnimationConfig<T> {
  trigger: gsap.DOMTarget
  enter: T['enter']
  leave: T['leave']
}

export class HoverAnimation<
  T extends HoverAnimationElement = HoverAnimationElement
> extends BaseAnimation<T> {
  private exitTime: number = 0
  private readonly enter: T['enter']
  private readonly leave: T['leave']
  private readonly trigger: gsap.DOMTarget
  private readonly EXIT_THRESHOLD: number = 0.85 // Seuil à 85%

  private onEnterHandler: () => void
  private onLeaveHandler: () => void
  constructor(config: HoverAnimationConfig<T>) {
    super(config)

    this.trigger = config.trigger || this.element
    this.enter = config.enter
    this.leave = config.leave

    this.onEnterHandler = this.handleMouseEnter.bind(this)
    this.onLeaveHandler = this.handleMouseLeave.bind(this)
    this.initAnimation()
    this.addListeners()
  }

  public initAnimation(): void {
    this.tl.to(this.element, this.enter)
    this.tl.addPause()
    this.exitTime = this.tl.duration()
    this.tl.to(this.element, this.leave)
  }

  public addListeners(): void {
    const elements = Array.isArray(this.trigger) ? this.trigger : [this.trigger]

    elements.forEach((element) => {
      element.addEventListener('mouseenter', this.onEnterHandler)
      element.addEventListener('mouseleave', this.onLeaveHandler)
    })
  }

  protected removeListeners(el: EventTarget): void {
    el.removeEventListener('mouseenter', this.onEnterHandler)
    el.removeEventListener('mouseleave', this.onLeaveHandler)
  }

  private handleMouseEnter(): void {
    if (!this.tl) return
    const currentTime = this.tl.time()
    if (currentTime < this.exitTime) {
      this.tl.play()
    } else {
      this.tl.restart()
    }
  }

  private handleMouseLeave(): void {
    if (!this.tl) return
    const currentTime = this.tl.time()
    if (currentTime < this.exitTime) {
      this.tl.reverse()
    } else {
      this.tl.play()
    }
  }
}
