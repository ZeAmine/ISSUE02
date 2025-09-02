import { Alpha, Blink, Text } from '@/animations/texts'
import { CLASSES } from '@/constants/classes'

interface IAnimationProps {
  element?: HTMLElement | null
  animConfig?: Partial<IAnimationConfig>
}

export class Dom {
  public texts: Text[] | null = null
  public alpha: Alpha[] | null = null
  public blink: Blink[] | null = null
  public trigs: Text[] | null = null

  public createText(container: HTMLElement, anim?: Partial<IAnimationConfig>) {
    const text = Array.from(container.querySelectorAll(CLASSES.TEXT)) as HTMLElement[]
    const alpha = Array.from(container.querySelectorAll(CLASSES.ALPHA)) as HTMLElement[]
    const blink = Array.from(container.querySelectorAll(CLASSES.BLINK)) as HTMLElement[]
    const trigger = Array.from(container.querySelectorAll(CLASSES.TRIGGER)) as HTMLElement[]

    if (text) {
      this.texts = text.map((e: HTMLElement) => new Text({ element: e, anim }))
    }
    if (alpha) {
      this.alpha = alpha.map((e: HTMLElement) => new Alpha({ element: e }))
    }
    if (blink) {
      this.blink = blink.map((e: HTMLElement) => new Blink({ element: e, anim }))
    }
    if (trigger) {
      this.trigs = trigger.map((e: HTMLElement) => new Text({ element: e, anim }))
    }
  }

  public show() {
    if (this.texts) this.texts.forEach((el: Text) => el.show())
    if (this.blink) this.blink.forEach((el: Blink) => el.show())
    if (this.alpha) this.alpha.forEach((el: Alpha) => el.show())
  }

  public destroy() {
    if (this.texts) this.texts.forEach((el: Text) => el.animateOut())
    if (this.blink) this.blink.forEach((el: Blink) => el.setOut())
    if (this.trigs) this.trigs.forEach((el: Text) => el.animateOut())

    this.texts = null
    this.alpha = null
    this.blink = null
    this.trigs = null
  }

  public init({ element, animConfig }: IAnimationProps = {}) {
    const container = element || (document.querySelector('main') as HTMLElement)
    this.createText(container, animConfig)
  }
}
