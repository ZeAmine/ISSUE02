import { Observe } from '@/utils/Observe'
import { SplitText } from '@/utils/SplitText'

interface TextProps {
  element: HTMLElement
  anim?: Partial<IAnimationConfig>
}

export class Text extends Observe {
  private static readonly SINGLE_PARAM_REGEX = /^st-(\d+)$/
  private static readonly DOUBLE_PARAM_REGEX = /^st-(\d+)-(\d+)$/

  private readonly gsap = useNuxtApp().$gsap
  private target: HTMLElement | null = null
  private anim: IAnimationConfig
  private elements: HTMLElement[] = []
  private animation: gsap.core.Tween | null = null
  private destroyed = false

  constructor({ element, anim = {} }: TextProps) {
    super({
      element,
      config: {
        root: null,
        margin: '10px',
        threshold: 0.2
      },
      shouldStart: false
    })

    this.anim = {
      in: 1.4,
      out: 0.6,
      ease: '--o56',
      each: 0.1,
      from: 'start',
      delay: 0.1,
      delayParam: 0,
      once: true,
      instant: false,
      ...anim
    }

    this.setupText(element)
  }

  public setupText(element: HTMLElement): void {
    if (this.destroyed) {
      console.warn('Attempting to initialize a destroyed Text instance')
      return
    }

    this.target = element
    if (!this.target) {
      console.warn('Invalid Text initialization: missing element or media')
      return
    }

    this.getDelayParam()
    this.elements = SplitText.split(element) as HTMLElement[]
  }

  public show = (): void => {
    if (!this.target || this.destroyed) return

    if (this.anim.instant) {
      this.animateIn()
      return
    }

    this.start()

    this.on('IN', this.isIn.bind(this))
    this.on('OUT', this.isOut.bind(this))
  }

  public override isIn(): void {
    if (!this.target || this.destroyed) return

    this.animateIn()
    super.stop()
  }

  public override isOut(): void {
    if (!this.target || this.destroyed) return

    this.setOut()
  }

  public animateIn(): void {
    if (!this.target || this.destroyed) return

    if (this.animation) {
      this.animation.kill()
    }

    this.animation = this.gsap.to(this.elements, {
      y: '0%',
      duration: this.anim.in,
      ease: this.anim.ease,
      delay: this.anim.delay + this.anim.delayParam,
      stagger: {
        each: this.anim.each,
        from: this.anim.from
      }
    })
  }

  public animateOut(): void {
    if (!this.target || this.destroyed) return

    if (this.animation) {
      this.animation.kill()
    }

    this.animation = this.gsap.to(this.elements, {
      opacity: 0,
      duration: this.anim.out,
      ease: this.anim.ease,
      onComplete: () => {
        this.destroy()
      }
    })
  }

  public setIn(): void {
    if (!this.target) return

    this.gsap.set(this.elements, {
      opacity: 1,
      y: '0%',
      force3D: true
    })
  }

  public setOut(): void {
    if (!this.target) return

    this.gsap.set(this.elements, {
      opacity: 1,
      y: '110%',
      force3D: true
    })
  }

  private getDelayParam(): void {
    let delay = 0
    let stagger = 0
    for (const cls of this.target?.classList || []) {
      const singleMatch = cls.match(Text.SINGLE_PARAM_REGEX)
      const doubleMatch = cls.match(Text.DOUBLE_PARAM_REGEX)
      if (doubleMatch) {
        delay += Number.parseInt(doubleMatch[1]) * 100
        stagger += Number.parseInt(doubleMatch[2]) * 0.01
        continue
      }
      if (singleMatch) {
        delay += Number.parseInt(singleMatch[1]) * 100
      }
    }
    if (delay > 0) {
      this.anim.delayParam = delay / 1000
    }
    if (stagger > 0) {
      this.anim.each = stagger
    }
  }

  public override destroy(): void {
    this.destroyed = true
    this.removeAllListeners('IN')
    this.removeAllListeners('OUT')
    super.destroy()
    if (this.animation) {
      this.animation.kill()
      this.animation = null
    }
    this.target = null
  }
}
