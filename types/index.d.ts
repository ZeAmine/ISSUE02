declare global {
  interface Window {
    isMobile: boolean
    assets: any
  }

  interface WindowSize {
    width: number
    height: number
  }

  interface IPath {
    from: string | null
    to: string | null
  }

  interface AppState {
    windowSize: WindowSize
    isNavOpen: boolean
    isTouch: boolean
    isTransitioning: boolean
    isFontLoaded: boolean
    triggerThreshold: string
    headerTheme: string
    currentRoute: string | null
    previousRoute: string | null
    isPreloaderStarted: boolean
    isPreloaderProgress: boolean
    isPreloaderDone: boolean
    isPreloaderComplete: boolean
  }

  interface IViewportState {
    width: number
    height: number
    aspectRatio: number
    orientation: 'portrait' | 'landscape'
    device: 'mobile' | 'tablet' | 'laptop' | 'desktop'
    isTouch: boolean
  }

  interface ITransition {
    name: string
    mode: string
    css: boolean
    onLeave: (el: HTMLElement, done: () => void) => void
    onBeforeEnter: (el: HTMLElement) => void
    onEnter: (el: HTMLElement, done: () => void) => void
    onAfterEnter: (el: HTMLElement) => void
  }

  interface ITransitionProps {
    fromRoute: string
    toRoute: string
    theme: ITheme
  }

  interface ITransitionParams {
    element?: HTMLElement
    path: {
      fromRoute: string
      toRoute: string
    }
  }

  interface ITheme {
    text: string
    background: string
  }

  interface IPageTransition {
    leave: () => Promise<void>
    enter: () => Promise<void>
  }

  export interface IRouteParams {
    fromRoute: string
    toRoute: string
    fromPath: string
    toPath: string
  }

  interface IAnimationConfig {
    in: number
    out: number
    ease: string
    each: number
    from: number | 'start' | 'center' | 'end' | 'edges' | 'random' | [number, number]
    delay: number
    delayParam: number
    once: boolean
    instant: boolean
  }

  interface IScrollState {
    progress: number
    limit: number
    velocity: number
    direction: 'up' | 'down'
    currentElements: HTMLElement[]
  }

  interface IVirtualScrollState {
    deltaX: number
    deltaY: number
  }

  interface IBounds {
    width: number
    height: number
    x: number
    y: number
  }
}

export {
  WindowSize,
  IPath,
  AppState,
  IViewportState,
  ITransition,
  ITransitionProps,
  ITransitionParams,
  ITheme,
  IPageTransition,
  IRouteParams,
  IAnimationConfig,
  IScrollState,
  IVirtualScrollState,
  IBounds
}
