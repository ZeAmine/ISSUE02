import Lenis from 'lenis'
import type { IScrollState, IVirtualScrollState } from '@types'
import { eventEmitter } from '@/utils/EventEmitter'

export default defineNuxtPlugin(() => {
  const { $gsap: gsap, $ScrollTrigger: ScrollTrigger } = useNuxtApp()
  const { isMobile } = storeToRefs(useViewportStore())

  const lenis = ref<Lenis | null>(null)
  const stableIsMobile: boolean = isMobile.value
  let wrapperEl: HTMLElement | undefined = undefined

  if (stableIsMobile) {
    const root = document.querySelector('.main') as HTMLElement
    if (root) {
      wrapperEl = root
    }
  }

  lenis.value = new Lenis({
    wrapper: wrapperEl,
    duration: stableIsMobile ? 0 : 0.8,
    easing: stableIsMobile ? (t: number) => 1 - Math.pow(1 - t, 3) : undefined,
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1,
    syncTouch: !!stableIsMobile,
    infinite: false
  })

  window.scrollTo(0, 0)
  lenis.value?.scrollTo(0, { immediate: true })

  const handleScroll = (e: any) => {
    const scrollState: IScrollState = {
      progress: e.progress,
      limit: e.limit,
      velocity: e.velocity,
      direction: e.direction === 1 ? 'down' : 'up',
      currentElements: e.currentElements || []
    }
    ScrollTrigger.update()
    eventEmitter.emit('SCROLL:UPDATE', scrollState)
  }

  const handleVirtualScroll = (e: any) => {
    const virtualScrollState: IVirtualScrollState = {
      deltaX: e.deltaX,
      deltaY: e.deltaY
    }
    eventEmitter.emit('SCROLL_VIRTUAL:UPDATE', virtualScrollState)
  }

  lenis.value?.on('scroll', handleScroll)
  lenis.value?.on('virtual-scroll', handleVirtualScroll)

  const raf = (time: number) => {
    lenis.value?.raf(time * 1000)
  }

  gsap.ticker.add(raf)

  const scrollControls = {
    start: () => {
      lenis.value?.start()
    },
    stop: () => {
      lenis.value?.stop()
    },
    refresh: () => {
      lenis.value?.resize()
    },
    scrollZero: () => {
      lenis.value?.scrollTo(0, { immediate: true })
    },
    scrollToTarget: (target: number, center = true, duration = 2) => {
      lenis.value?.scrollTo(target, {
        offset: center ? -window.innerHeight / 2 : 0,
        duration
      })
    },
    scrollToAnchor: (anchorId: string, center = true, duration = 1.2) => {
      const targetId = anchorId.substring(1)
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        lenis.value?.scrollTo(targetElement, {
          offset: center ? -window.innerHeight / 2 : 0,
          duration
        })
      }
    },
    destroy: () => {
      gsap.ticker.remove(raf)
      lenis.value?.destroy()
      lenis.value = null
    }
  }

  return {
    provide: {
      lenisScroll: lenis.value,
      lenisControls: scrollControls
    }
  }
})
