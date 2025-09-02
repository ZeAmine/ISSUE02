import gsap from 'gsap'

import type { Interface } from './Interface'

export class Magnetic {
  object: Interface
  threshold: number
  hoveredIn: boolean

  constructor(object: Interface, { threshold = 50 }: { threshold?: number } = {}) {
    this.object = object
    this.threshold = threshold
    this.hoveredIn = false

    this.init()
    this.enable()
  }

  init(): void {
    this.object.css({ willChange: 'transform' })
  }

  addListeners(): void {
    window.addEventListener('pointerdown', this.onPointerDown)
    window.addEventListener('pointermove', this.onPointerMove)
    window.addEventListener('pointerup', this.onPointerUp)
  }

  removeListeners(): void {
    window.removeEventListener('pointerdown', this.onPointerDown)
    window.removeEventListener('pointermove', this.onPointerMove)
    window.removeEventListener('pointerup', this.onPointerUp)
  }

  onPointerDown = (e: PointerEvent): void => {
    this.onPointerMove(e)
  }

  onPointerMove = ({ clientX, clientY }: PointerEvent): void => {
    const { left, top, width, height } = (
      this.object.element as HTMLElement
    ).getBoundingClientRect()

    const x: number = clientX - (left + width / 2)
    const y: number = clientY - (top + height / 2)
    const distance: number = Math.sqrt(x * x + y * y)

    if (distance < (width + height) / 2 + this.threshold) {
      this.onHover({ type: 'over', x, y })
    } else if (this.hoveredIn) {
      this.onHover({ type: 'out' })
    }
  }

  onPointerUp = (e: PointerEvent): void => {
    this.onPointerMove(e)
    this.onHover({ type: 'out' })
  }

  onHover = ({ type, x, y }: { type: string; x?: number; y?: number }): void => {
    gsap.killTweensOf(this.object.element)

    if (type === 'over') {
      gsap.to(this.object.element, {
        x: x! * 0.8,
        y: y! * 0.8,
        skewX: x! * 0.125,
        skewY: 0,
        rotation: x! * 0.05,
        scale: 1.1,
        duration: 0.5,
        ease: 'cubic.out'
      })

      this.hoveredIn = true
    } else {
      gsap.to(this.object.element, {
        x: 0,
        y: 0,
        skewX: 0,
        skewY: 0,
        rotation: 0,
        scale: 1,
        duration: 1,
        ease: 'elastic.out(1.2, 0.4)'
      })

      this.hoveredIn = false
    }
  }

  enable(): void {
    this.addListeners()
  }

  disable(): void {
    this.removeListeners()
  }

  destroy(): void {
    this.disable()
  }
}
