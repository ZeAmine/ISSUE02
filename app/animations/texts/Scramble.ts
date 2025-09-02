import { gsap } from 'gsap/gsap-core'
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin'

import { Observe } from '@/utils/Observe'

gsap.registerPlugin(ScrambleTextPlugin)

const chars1: string = '▎▌▊▉█'
const chars2: string = '▖▗ ▘ ▙ ▚ ▛ ▜ ▝ ▞ ▟'
const chars3: string = '▎▎▎▎▎▎'

export class Scramble extends Observe {
  private static readonly DEFAULT_ANIMATION: IAnimationConfig = {
    in: 1.4,
    out: 0.6,
    ease: '--o56',
    each: 0.1,
    from: 'start',
    delay: 0.1,
    delayParam: 0,
    once: true,
    noObserve: false
  }

  private anim: IAnimationConfig
  private animated: Element
  private animation!: gsap.core.Tween | null
  private scAnimation!: gsap.core.Tween | null
  private text: string
  private obs!: Observe

  constructor({ element }: { element: HTMLElement }) {
    super({
      element,
      config: {
        root: null,
        margin: '10px',
        threshold: 0.2
      }
    })

    this.animated = element
    this.text = element.textContent || ''

    this.anim = {
      in: 1.2,
      out: 0.6,
      ease: '--o56',
      each: 0.05,
      from: 'start',
      delay: 0.1,
      delayParam: 0,
      once: true,
      noObserve: false
    }

    this.setOut()
  }

  public show = (): void => {
    this.on('IN', this.isIn.bind(this))
    this.on('OUT', this.isOut.bind(this))
  }

  public override isIn(): void {
    this.animateIn()
    super.stop()
  }

  public override isOut(): void {
    this.setOut()
  }

  public animateIn(delay: number = 0.1): void {
    this.animation?.kill()

    this.animation = gsap.to(this.animated, {
      autoAlpha: 1,
      duration: this.anim.in,
      ease: this.anim.ease,
      delay: this.anim.delay,
      stagger: {
        each: this.anim.each,
        from: this.anim.from
      }
    })

    this.scAnimation?.kill()

    this.scAnimation = gsap.to(this.animated, {
      duration: 0.9 + Math.random() * 0.6 + this.text.length * 0.01,
      delay,
      scrambleText: {
        chars: chars1 + chars2 + chars3, // "lowerCase" for default
        revealDelay: 0,
        text: this.text,
        speed: 0.001,
        delimiter: '',
        rightToLeft: false
      }
    })
  }

  public setOut(): void {
    this.animation?.kill()

    gsap.set(this.animated, { autoAlpha: 0 })
  }

  public override destroy(): void {
    super.stop()
    if (this.animation) {
      this.animation.kill()
      this.animation = null
    }
  }
}
