import { Observe } from '@/utils/Observe'
import { SplitText } from '@/utils/SplitText'

interface TextProps {
  element: HTMLElement
  anim?: Partial<IAnimationConfig>
}

export class Blink extends Observe {
  private static readonly SINGLE_PARAM_REGEX = /^st-(\d+)$/
  private static readonly DOUBLE_PARAM_REGEX = /^st-(\d+)-(\d+)$/

  private readonly gsap = useNuxtApp().$gsap
  private target: HTMLElement | null = null
  private anim: IAnimationConfig
  private elements: HTMLElement[] = []
  private animation: gsap.core.Timeline | null = null
  private destroyed = false

  constructor({ element, anim = {} }: TextProps) {
    super({
      element,
      config: {
        root: null,
        margin: '10px',
        threshold: 0.1
      },
      shouldStart: false
    })

    this.anim = {
      in: 1.4,
      out: 0.6,
      ease: '--o56',
      each: 0.08,
      from: 'random',
      delay: 0.1,
      delayParam: 0,
      once: true,
      noObserve: false,
      ...anim
    }

    this.setupText(element)
  }

  public setupText(element: HTMLElement): void {
    if (this.destroyed) {
      console.warn('Attempting to initialize a destroyed Blink instance')
      return
    }

    this.target = element
    if (!this.target) {
      console.warn('Invalid Blink initialization: missing element')
      return
    }

    this.getDelayParam()
    this.elements = SplitText.split(element) as HTMLElement[]
  }

  public show = (): void => {
    if (!this.target || this.destroyed) return

    this.start()

    this.on('IN', this.isIn.bind(this))
    this.on('OUT', this.isOut.bind(this))
  }

  public override isIn(): void {
    if (!this.target || this.destroyed) return

    this.animateIn()
    this.stop()
  }

  public override isOut(): void {
    if (!this.target || this.destroyed) return

    this.setOut()
  }

  public animateIn(): void {
    if (!this.target || this.destroyed || !this.elements.length) return

    this.animation?.kill()
    this.animation = this.gsap.timeline()

    const baseDelay = this.anim.delay + this.anim.delayParam
    const elementIndices = this.getElementOrder()

    elementIndices.forEach(({ element, position }) => {
      const delay = baseDelay + position * this.anim.each
      const index = elementIndices.length - position - 1
      this.animation?.blinkIn(element, delay)
    })
  }

  public animateOut(): void {
    if (!this.target || this.destroyed) return

    this.animation?.kill()
  }

  public setIn(): void {
    if (!this.target) return

    this.gsap.set(this.elements, {
      opacity: 1
    })
  }

  public setOut(): void {
    if (!this.target) return

    this.gsap.set(this.elements, {
      opacity: 0
    })
  }

  private getDelayParam(): void {
    let delay = 0
    let stagger = 0
    for (const cls of this.target?.classList || []) {
      const singleMatch = cls.match(Blink.SINGLE_PARAM_REGEX)
      const doubleMatch = cls.match(Blink.DOUBLE_PARAM_REGEX)
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

  private getElementOrder(): Array<{ element: HTMLElement; position: number }> {
    if (this.anim.from !== 'random') {
      return this.elements.map((element, index) => ({
        element,
        position: index
      }))
    }
    const shuffledPositions = this.shuffledIndices(this.elements.length)
    return this.elements.map((element, originalIndex) => ({
      element,
      position: shuffledPositions[originalIndex]
    }))
  }

  private shuffledIndices(length: number): number[] {
    const indices = Array.from({ length }, (_, i) => i)
    for (let i = length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[indices[i], indices[j]] = [indices[j], indices[i]]
    }

    return indices
  }

  public override destroy(): void {
    this.destroyed = true
    super.stop()
    if (this.animation) {
      this.animation.kill()
      this.animation = null
    }
    this.target = null
  }
}
