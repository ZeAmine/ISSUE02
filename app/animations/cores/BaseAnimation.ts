import type { gsap } from 'gsap'
import type { Pane } from 'tweakpane'

export interface AnimationElement {
  element: HTMLElement | HTMLElement[] | (HTMLElement | HTMLElement[])[]
}

export interface BaseAnimationConfig<T extends AnimationElement> {
  element: T['element']
  debug?: boolean
  performance?: {
    useRAF?: boolean
    autoCleanup?: boolean
  }
  customDefaults?: gsap.TweenVars
}

export abstract class BaseAnimation<T extends AnimationElement = AnimationElement> {
  private readonly gsap = useNuxtApp().$gsap as typeof gsap

  protected debug: Pane | null = null
  protected tl: gsap.core.Timeline
  protected element: T['element']
  protected id!: string
  protected config: BaseAnimationConfig<T>

  // RAF utilities
  protected rafId?: number
  protected rafCallbacks: Map<string, () => void> = new Map()

  // State management
  protected state: 'idle' | 'running' | 'paused' | 'completed' = 'idle'
  protected isDestroyed = false

  protected constructor(config: BaseAnimationConfig<T>) {
    this.element = config.element
    this.config = config

    // Merge custom defaults with base defaults
    const defaults = {
      duration: 0.3,
      ease: '--o2',
      ...config.customDefaults
    }

    this.tl = this.gsap.timeline({
      defaults,
      paused: true,
      onStart: () => this.onAnimationStart(),
      onComplete: () => this.onAnimationComplete(),
      onUpdate: () => this.onAnimationUpdate()
    })

    // Setup debug if requested
    if (config.debug) {
      this.setupDebugMode()
    }
  }

  // Abstract methods that must be implemented
  abstract initAnimation(): void
  abstract addListeners(): void

  // Lifecycle hooks that can be overridden
  protected onAnimationStart(): void {
    this.state = 'running'
  }

  protected onAnimationComplete(): void {
    this.state = 'completed'
    if (this.config.performance?.autoCleanup) {
      this.cleanup()
    }
  }

  protected onAnimationUpdate(): void {
    // Override in child classes for custom update logic
  }

  // Enhanced animation controls with state management
  public play(): void {
    if (this.isDestroyed) return
    this.state = 'running'
    this.tl.play()
  }

  public pause(): void {
    if (this.isDestroyed) return
    this.state = 'paused'
    this.tl.pause()
  }

  public reverse(): void {
    if (this.isDestroyed) return
    this.state = 'running'
    this.tl.reverse()
  }

  public restart(): void {
    if (this.isDestroyed) return
    this.state = 'running'
    this.tl.restart()
  }

  public stop(): void {
    if (this.isDestroyed) return
    this.state = 'idle'
    this.tl.pause().progress(0)
  }

  // State getters
  public getState(): typeof this.state {
    return this.state
  }

  public isRunning(): boolean {
    return this.state === 'running'
  }

  public isPaused(): boolean {
    return this.state === 'paused'
  }

  public isCompleted(): boolean {
    return this.state === 'completed'
  }

  // RAF utilities
  protected createRAFHandler(key: string, callback: () => void): () => void {
    if (!this.config.performance?.useRAF) {
      return callback
    }

    return () => {
      if (this.rafCallbacks.has(key)) {
        const existingRafId = this.rafCallbacks.get(key)
        if (existingRafId && typeof existingRafId === 'function') {
          cancelAnimationFrame(this.rafId!)
        }
      }

      this.rafId = requestAnimationFrame(() => {
        if (!this.isDestroyed) {
          callback()
        }
        this.rafCallbacks.delete(key)
      })

      this.rafCallbacks.set(key, callback)
    }
  }

  protected cancelRAF(key?: string): void {
    if (key) {
      this.rafCallbacks.delete(key)
    } else {
      this.rafCallbacks.clear()
    }

    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = undefined
    }
  }

  // Element utilities
  protected getElementsArray(): HTMLElement[] {
    if (Array.isArray(this.element)) {
      return this.element.flat().filter((el): el is HTMLElement => el instanceof HTMLElement)
    }
    return [this.element as HTMLElement]
  }

  protected findElements(selector: string, root?: HTMLElement): HTMLElement[] {
    const elements = this.getElementsArray()
    const results: HTMLElement[] = []

    elements.forEach((el) => {
      const found = (root || el).querySelectorAll(selector)
      results.push(...(Array.from(found) as HTMLElement[]))
    })

    return results
  }

  // Cleanup method that can be called manually or automatically
  protected cleanup(): void {
    this.cancelRAF()
    // Override in child classes for custom cleanup
  }

  public destroy(): void {
    if (this.isDestroyed) return

    this.isDestroyed = true
    this.state = 'idle'

    this.tl.kill()
    this.cancelRAF()

    const elements = this.getElementsArray()
    elements.forEach((el) => this.removeListeners(el))

    this.cleanup()

    if (this.debug) {
      this.debug.dispose()
      this.debug = null
    }
  }

  protected abstract removeListeners(el: EventTarget): void

  // Enhanced debug mode
  protected setupDebugMode(): void {
    if (typeof window !== 'undefined') {
      console.log(`🎭 Animation Debug Mode: ${this.constructor.name}`)
    }
  }

  protected setDebug(debug: Pane): void {
    if (!this.debug && this.id) {
      this.debug = debug.addFolder({
        title: this.id,
        expanded: false
      }) as Pane

      // Enhanced debug controls
      const buttons = [
        { title: 'Play', action: () => this.play() },
        { title: 'Pause', action: () => this.pause() },
        { title: 'Stop', action: () => this.stop() },
        { title: 'Restart', action: () => this.restart() },
        { title: 'Reverse', action: () => this.reverse() }
      ]

      buttons.forEach(({ title, action }) => {
        this.debug?.addButton({ title }).on('click', action)
      })

      // State monitor
      this.debug.addMonitor(this, 'state', { readonly: true })

      // Timeline progress
      this.debug.addMonitor(this.tl, 'progress', { readonly: true })
    }
  }

  // Helper method to create timeline with common patterns
  protected createTimeline(options: gsap.TimelineVars = {}): gsap.core.Timeline {
    return this.gsap.timeline({
      ...options,
      onStart: () => {
        this.onAnimationStart()
        options.onStart?.()
      },
      onComplete: () => {
        this.onAnimationComplete()
        options.onComplete?.()
      },
      onUpdate: () => {
        this.onAnimationUpdate()
        options.onUpdate?.()
      }
    })
  }
}
