import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    windowSize: {
      width: 0,
      height: 0
    },
    isNavOpen: false,
    isTouch: false,
    isTransitioning: false,
    isFontLoaded: false,
    triggerThreshold: 'top 70%',
    headerTheme: 'dark',
    currentRoute: null,
    previousRoute: null,
    isPreloaderStarted: false,
    isPreloaderProgress: false,
    isPreloaderDone: false,
    isPreloaderComplete: false
  }),

  actions: {
    setWindowSize({ width, height }: WindowSize) {
      this.windowSize = { width, height }
    },
    setIsTouch(isTouch: boolean) {
      this.isTouch = isTouch
    },
    setIsNavOpen() {
      this.isNavOpen = !this.isNavOpen
    },
    setIsFontLoaded() {
      this.isFontLoaded = true
    },
    setHeaderTheme(theme = 'light') {
      this.headerTheme = theme
    },
    setCurrentRoute(route: string) {
      this.currentRoute = route
    },
    setPreviousRoute(route: string) {
      this.previousRoute = route
    },
    setIsTransitioning() {
      this.isTransitioning = !this.isTransitioning
    },
    setIsPreloaderStarted() {
      this.isPreloaderStarted = true
    },
    setIsPreloaderProgress() {
      this.isPreloaderProgress = true
    },
    setIsPreloaderDone() {
      this.isPreloaderDone = true
    },
    setIsPreloaderComplete() {
      this.isPreloaderComplete = true
    },
    clear() {
      this.$reset()
    }
  }
})
