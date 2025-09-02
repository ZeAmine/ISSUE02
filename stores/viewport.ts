import { defineStore } from 'pinia'

interface ViewportState {
  width: number
  height: number
  aspectRatio: number
  orientation: 'portrait' | 'landscape'
  device: 'mobile' | 'tablet' | 'laptop' | 'desktop'
  isTouch: boolean
}

export const useViewportStore = defineStore('viewport', {
  state: (): ViewportState => ({
    width: 0,
    height: 0,
    aspectRatio: 0,
    orientation: 'portrait',
    device: 'desktop',
    isTouch: false
  }),

  actions: {
    setViewportState(state: ViewportState) {
      this.width = state.width
      this.height = state.height
      this.aspectRatio = state.aspectRatio
      this.orientation = state.orientation
      this.device = state.device
      this.isTouch = state.isTouch
    }
  },

  getters: {
    isMobile: (state: ViewportState) => state.device === 'mobile',
    isTablet: (state: ViewportState) => state.device === 'tablet',
    isDesktop: (state: ViewportState) => state.device === 'desktop',
    isPortrait: (state: ViewportState) => state.orientation === 'portrait',
    isLandscape: (state: ViewportState) => state.orientation === 'landscape'
  }
})
