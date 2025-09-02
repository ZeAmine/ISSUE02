import { EventEmitter } from 'events'

interface ObserveConfig {
  root?: Element | null
  margin?: string
  threshold?: number
}

interface IObserveProps {
  element: Element
  config?: ObserveConfig
  addClass?: string
  shouldStart?: boolean
}

export class Observe extends EventEmitter {
  public element: Element
  private config: ObserveConfig
  private readonly addClass?: string
  private in: IntersectionObserver | null
  private out: IntersectionObserver | null

  constructor({ element, config, addClass, shouldStart = true }: IObserveProps) {
    super()

    this.element = element
    this.config = {
      root: config?.root || null,
      margin: config?.margin || '10px',
      threshold: config?.threshold || 0
    }

    if (addClass !== undefined) {
      this.addClass = addClass
    }

    this.in = null
    this.out = null

    this.init()

    if (shouldStart) this.start()
  }

  private init() {
    this.in = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          if (entry.isIntersecting) {
            this.isIn()
          }
        })
      },
      {
        // root: this.config.root,
        rootMargin: this.config.margin,
        threshold: this.config.threshold
      }
    )

    this.out = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          if (!entry.isIntersecting) {
            this.isOut()
          }
        })
      },
      {
        // root: document.querySelector('#scrollArea'),
        rootMargin: '000px',
        threshold: 0
      }
    )
  }

  public start() {
    this.in?.observe(this.element)
    this.out?.observe(this.element)
  }

  public stop() {
    this.in?.unobserve(this.element)
    this.out?.unobserve(this.element)
  }

  public destroy() {
    this.in?.disconnect()
    this.out?.disconnect()
  }

  public isIn() {
    if (this.addClass) {
      this.element.classList.add(this.addClass)
    }

    this.emit('IN')
  }

  public isOut() {
    if (this.addClass) {
      this.element.classList.remove(this.addClass)
    }

    this.emit('OUT')
  }
}
