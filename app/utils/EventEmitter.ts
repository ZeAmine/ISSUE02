type Callback = (...args: any[]) => void
type Events = {
  'WINDOW:RESIZE': (dimensions: { width: number; height: number }) => void
  'WINDOW:ORIENTATION_CHANGE': () => void
  'FONTS:LOADED': () => void
  'SCROLL_TRIGGER:REFRESH_INIT': () => void
  'SCROLL:UPDATE': (scrollState: IScrollState) => void
  'SCROLL_VIRTUAL:UPDATE': (scrollState: IVirtualScrollState) => void
  'MOUSE:MOVE': (position: { x: number; y: number }) => void
  'GSAP:VISIBILITY_CHANGE': () => void
  'PRELOADER:START': () => void
  'PRELOADER:COMPLETE': () => void
  'WEBGL_LOADER:START': () => void
  'WEBGL_LOADER:PROGRESS': (progress: number) => void
  'WEBGL_LOADER:COMPLETE': () => void
  'WEBGL_LOADER:ERROR': (error?: any) => void
  'TRANSITION:LEAVE': () => void
  'TRANSITION:BEFORE_ENTER': () => void
  'TRANSITION:ENTER': () => void
  'TRANSITION:AFTER_ENTER': () => void
}

export class EventEmitter {
  private readonly listeners: Map<keyof Events, Set<Callback>>

  constructor() {
    this.listeners = new Map()
  }

  public on<K extends keyof Events>(event: K, callback: Events[K]): void {
    if (typeof callback !== 'function') {
      throw new TypeError('Le callback doit être une fonction')
    }

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }

    this.listeners.get(event)!.add(callback)
  }

  public off<K extends keyof Events>(event: K, callback?: Events[K]): void {
    if (!this.listeners.has(event)) {
      return
    }

    const listeners = this.listeners.get(event)!

    if (callback) {
      listeners.delete(callback)

      if (listeners.size === 0) {
        this.listeners.delete(event)
      }
    } else {
      this.listeners.delete(event)
    }
  }

  public emit<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>): void {
    const listeners = this.listeners.get(event)

    if (!listeners?.size) {
      return
    }

    Array.from(listeners).forEach((callback: Callback) => {
      try {
        callback(...args)
      } catch (error) {
        console.error(`Erreur dans l'écouteur d'événement pour ${String(event)}:`, error)
      }
    })
  }

  public clear(): void {
    this.listeners.clear()
  }

  public hasListeners(event: keyof Events): boolean {
    return this.listeners.has(event) && this.listeners.get(event)!.size > 0
  }

  public getListenerCount(event: keyof Events): number {
    return this.listeners.get(event)?.size ?? 0
  }
}

export const eventEmitter = new EventEmitter()
