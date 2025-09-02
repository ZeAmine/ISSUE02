import { eventEmitter, type EventEmitter } from '@/utils/EventEmitter'

// import { clearTween, tween } from '../tween/Tween.js'

// Types
type StyleProperties = {
  [key: string]: number | string
}

type TweenProps = {
  [key: string]: number
}

// Constants
const Transforms: string[] = [
  'x',
  'y',
  'z',
  'skewX',
  'skewY',
  'rotation',
  'rotationX',
  'rotationY',
  'rotationZ',
  'scale',
  'scaleX',
  'scaleY',
  'scaleZ'
]

const Filters: string[] = [
  'blur',
  'brightness',
  'contrast',
  'grayscale',
  'hue',
  'invert',
  'saturate',
  'sepia'
]

const Numeric: string[] = [
  'opacity',
  'zIndex',
  'fontWeight',
  'strokeWidth',
  'strokeDashoffset',
  'stopOpacity'
]

const Lacuna1: string[] = [
  'opacity',
  'brightness',
  'contrast',
  'saturate',
  'scale',
  'stopOpacity'
]

export class Interface {
  public events: EventEmitter
  public children: (Interface | Node)[]
  public style: StyleProperties
  public element: HTMLElement | SVGElement | SVGPathElement | null
  public parent?: Interface
  private isTransform: boolean
  private isFilter: boolean
  public progress?: number
  public start?: number
  public offset?: number

  constructor(
    name: string | HTMLElement | SVGElement | null,
    type: string | null = 'div',
    qualifiedName?: string
  ) {
    this.events = eventEmitter
    this.children = []
    this.style = {}
    this.isTransform = false
    this.isFilter = false
    this.element = null

    if (typeof name === 'object' && name !== null) {
      this.element = name
    } else if (type !== null) {
      if (type === 'svg') {
        this.element = document.createElementNS(
          'http://www.w3.org/2000/svg',
          qualifiedName || 'svg'
        ) as SVGElement
      } else {
        this.element = document.createElement(type)
      }

      if (typeof name === 'string') {
        if (name.startsWith('.')) {
          ;(this.element as HTMLElement).className = name.slice(1)
        } else {
          this.element.id = name
        }
      }
    }
  }

  add(child: Interface | Node): Interface | Node | undefined {
    if (!this.children) {
      return
    }

    this.children.push(child)

    if (child instanceof Interface) {
      child.parent = this
    }

    if (this.element) {
      if (child instanceof Interface && child.element) {
        this.element.appendChild(child.element)
      } else if (child instanceof Node) {
        this.element.appendChild(child)
      }
    }

    return child
  }

  remove(child: Interface | Node): void {
    if (!this.children) {
      return
    }

    if (child instanceof Interface && child.element?.parentNode) {
      child.element.parentNode.removeChild(child.element)
    } else if (child instanceof Node && child.parentNode) {
      child.parentNode.removeChild(child)
    }

    const index = this.children.indexOf(child)
    if (index !== -1) {
      this.children.splice(index, 1)
    }
  }

  replace(oldChild: Interface | Node, newChild: Interface | Node): void {
    if (!this.children) {
      return
    }

    const index = this.children.indexOf(oldChild)

    if (index !== -1) {
      this.children[index] = newChild
      if (newChild instanceof Interface) {
        newChild.parent = this
      }
    }

    if (oldChild instanceof Interface && oldChild.element?.parentNode) {
      if (newChild instanceof Interface && newChild.element) {
        oldChild.element.parentNode.replaceChild(newChild.element, oldChild.element)
      } else if (newChild instanceof Node) {
        oldChild.element.parentNode.replaceChild(newChild, oldChild.element)
      }
    } else if (oldChild instanceof Node && oldChild.parentNode) {
      if (newChild instanceof Interface && newChild.element) {
        oldChild.parentNode.replaceChild(newChild.element, oldChild)
      } else if (newChild instanceof Node) {
        oldChild.parentNode.replaceChild(newChild, oldChild)
      }
    }
  }

  clone(deep: boolean): Interface | undefined {
    if (!this.element) {
      return
    }

    return new Interface(this.element.cloneNode(deep) as HTMLElement)
  }

  empty(): this | undefined {
    if (!this.element) {
      return
    }

    for (let i = this.children.length - 1; i >= 0; i--) {
      const child = this.children[i]
      if (child instanceof Interface && child.destroy) {
        child.destroy()
      }
    }

    this.children.length = 0
    this.element.innerHTML = ''

    return this
  }

  attr(props: { [key: string]: string }): this | undefined {
    if (!this.element) {
      return
    }

    for (const key in props) {
      this.element.setAttribute(key, props[key])
    }

    return this
  }

  css(props: StyleProperties): this | undefined {
    if (!this.element) {
      return
    }

    const style = this.style

    for (const key in props) {
      if (Transforms.includes(key)) {
        style[key] = props[key]
        this.isTransform = true
        continue
      }

      if (Filters.includes(key)) {
        style[key] = props[key]
        this.isFilter = true
        continue
      }

      let val: string | number

      if (Numeric.includes(key)) {
        val = props[key]
        style[key] = val
      } else {
        val = typeof props[key] !== 'string' ? `${props[key]}px` : props[key]
      }

      if (this.element) {
        ;(this.element.style as any)[key as keyof CSSStyleDeclaration] = val
      }
    }

    if (this.isTransform) {
      let transform = ''

      if (style.x !== undefined || style.y !== undefined || style.z !== undefined) {
        const x = style.x !== undefined ? style.x : 0
        const y = style.y !== undefined ? style.y : 0
        const z = style.z !== undefined ? style.z : 0

        transform += `translate3d(${x}px, ${y}px, ${z}px)`
      }

      if (style.skewX !== undefined) {
        transform += `skewX(${style.skewX}deg)`
      }

      if (style.skewY !== undefined) {
        transform += `skewY(${style.skewY}deg)`
      }

      if (style.rotation !== undefined) {
        transform += `rotate(${style.rotation}deg)`
      }

      if (style.rotationX !== undefined) {
        transform += `rotateX(${style.rotationX}deg)`
      }

      if (style.rotationY !== undefined) {
        transform += `rotateY(${style.rotationY}deg)`
      }

      if (style.rotationZ !== undefined) {
        transform += `rotateZ(${style.rotationZ}deg)`
      }

      if (style.scale !== undefined) {
        transform += `scale(${style.scale})`
      }

      if (style.scaleX !== undefined) {
        transform += `scaleX(${style.scaleX})`
      }

      if (style.scaleY !== undefined) {
        transform += `scaleY(${style.scaleY})`
      }

      if (style.scaleZ !== undefined) {
        transform += `scaleZ(${style.scaleZ})`
      }

      this.element.style.transform = transform
    }

    if (this.isFilter) {
      let filter = ''

      if (style.blur !== undefined) {
        filter += `blur(${style.blur}px)`
      }

      if (style.brightness !== undefined) {
        filter += `brightness(${style.brightness})`
      }

      if (style.contrast !== undefined) {
        filter += `contrast(${style.contrast})`
      }

      if (style.grayscale !== undefined) {
        filter += `grayscale(${style.grayscale})`
      }

      if (style.hue !== undefined) {
        filter += `hue-rotate(${style.hue}deg)`
      }

      if (style.invert !== undefined) {
        filter += `invert(${style.invert})`
      }

      if (style.saturate !== undefined) {
        filter += `saturate(${style.saturate})`
      }

      if (style.sepia !== undefined) {
        filter += `sepia(${style.sepia})`
      }

      this.element.style.filter = filter
    }

    return this
  }

  text(string?: string): string | this {
    if (!this.element) {
      return ''
    }

    if (string === undefined) {
      return this.element.textContent || ''
    } else {
      this.element.textContent = string
      return this
    }
  }

  html(string?: string): string | this {
    if (!this.element) {
      return ''
    }

    if (string === undefined) {
      return this.element.innerHTML || ''
    } else {
      this.element.innerHTML = string
      return this
    }
  }

  hide(): this | undefined {
    return this.css({ display: 'none' })
  }

  show(): this | undefined {
    return this.css({ display: '' })
  }

  invisible(): this | undefined {
    return this.css({ visibility: 'hidden' })
  }

  visible(): this | undefined {
    return this.css({ visibility: '' })
  }

  drawLine(progress = this.progress || 0): this | undefined {
    const start = this.start || 0
    const offset = this.offset || 0

    const length = (this.element as SVGPathElement)?.getTotalLength()
    const dash = length * progress
    const gap = length - dash

    const style = {
      strokeDasharray: `${dash},${gap}`,
      strokeDashoffset: -length * (start + offset)
    }

    return this.css(style)
  }

  // tween(
  //   props: TweenProps,
  //   duration: number,
  //   ease: string,
  //   delay: number | (() => void) = 0,
  //   complete?: (() => void) | (() => void),
  //   update?: () => void
  // ): Promise<void> {
  //   if (!this.element) {
  //     return Promise.resolve()
  //   }

  //   if (typeof delay !== 'number') {
  //     update = complete
  //     complete = delay
  //     delay = 0
  //   }

  //   const style = getComputedStyle(this.element)

  //   for (const key in props) {
  //     let val: number | undefined

  //     if (this.style[key] !== undefined) {
  //       val = Number(this.style[key])
  //     } else if (Transforms.includes(key) || Filters.includes(key) || Numeric.includes(key)) {
  //       val = Lacuna1.includes(key) ? 1 : 0
  //     } else if (typeof style[key as keyof CSSStyleDeclaration] === 'string') {
  //       val = parseFloat(style[key as keyof CSSStyleDeclaration] as string)
  //     }

  //     if (!isNaN(val!)) {
  //       this.style[key] = val!
  //     }
  //   }

  //   return tween(this.style, props, duration, ease, delay, complete as () => void, () => {
  //     this.css(this.style)
  //     if (update) {
  //       update()
  //     }
  //   })
  // }

  // clearTween(): this | undefined {
  //   clearTween(this.style)

  //   return this
  // }

  destroy(): null {
    if (!this.children) {
      return null
    }

    if (this.parent?.remove) {
      this.parent.remove(this)
    }

    // this.clearTween()
    this.events.clear()

    for (let i = this.children.length - 1; i >= 0; i--) {
      const child = this.children[i]
      if (child instanceof Interface && child.destroy) {
        child.destroy()
      }
    }

    for (const prop in this) {
      ;(this as any)[prop] = null
    }

    return null
  }
}
