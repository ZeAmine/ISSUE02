import { eventEmitter } from '@/utils/EventEmitter'
import type { IViewportState } from '@types'
// import { debounce } from '@/vendor/debounce'

function getDeviceType(width: number): IViewportState['device'] {
  if (width <= 480) return 'mobile'
  if (width <= 768) return 'tablet'
  if (width <= 1024) return 'laptop'
  return 'desktop'
}

export default defineNuxtPlugin(() => {
  const { $ScrollTrigger: ScrollTrigger } = useNuxtApp()
  const { setViewportState } = useViewportStore()
  const { setWindowSize } = useAppStore()

  const getViewportState = (): IViewportState => ({
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight,
    orientation: window.innerWidth >= window.innerHeight ? 'landscape' : 'portrait',
    device: getDeviceType(window.innerWidth),
    isTouch:
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0
  })

  const handleResize = () => {
    const state = getViewportState()
    setViewportState(state)
    setWindowSize({ width: state.width, height: state.height })
    document.documentElement.style.setProperty('--vh', `${state.height}px`)
    ScrollTrigger?.update()
    eventEmitter.emit('WINDOW:RESIZE', state)
  }

  const handleOrientationChange = () => {
    const state = getViewportState()
    setViewportState(state)
    ScrollTrigger?.refresh()
    eventEmitter.emit('WINDOW:ORIENTATION_CHANGE')
  }

  handleResize()
  handleOrientationChange()

  window.addEventListener('resize', handleResize)
  window.addEventListener('orientationchange', handleOrientationChange)
  // window.addEventListener('visibilitychange', () => {
  //   if (document.visibilityState === 'visible') handleResize()
  // })
})
