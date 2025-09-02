import type { RouteLocationNormalized } from 'vue-router'

import { eventEmitter } from '@/utils/EventEmitter'
import { TransitionManager } from '@webgl/controllers/TransitionManager'

interface IRouteTransitionProps {
  to: RouteLocationNormalized
  from: RouteLocationNormalized
  previousRoute?: RouteLocationNormalized
  currentRoute?: RouteLocationNormalized
  transitionOut?: (params: ITransitionParams) => Promise<void>
  transitionIn?: (params: ITransitionParams) => Promise<void>
}

export default defineNuxtRouteMiddleware((to, from) => {
  const transitionType = useTransitionType()
  const { isProjectRoute } = useTransitionGuard()

  if (isProjectRoute(to, from)) {
    transitionType.value = 'case-next'
    return caseNextTransition({ to, from })
  }

  transitionType.value = 'page'
  return defaultTransition({ to, from })
})

function caseNextTransition({ to, from }: IRouteTransitionProps) {
  const {
    $dom: dom,
    $lenisControls: lenis,
    $gsap: gsap,
    $ScrollTrigger: ScrollTrigger
  } = useNuxtApp()
  const { setIsTransitioning } = useAppStore()

  const transition = {
    name: 'case-next',
    mode: 'out-in',
    css: false,
    onLeave: (element: HTMLElement, done: () => void) => {
      setIsTransitioning()
      eventEmitter.emit('TRANSITION:LEAVE')
      onLeave(element, done)
    },
    onBeforeEnter: () => {
      eventEmitter.emit('TRANSITION:BEFORE_ENTER')
      dom?.destroy()
    },
    onEnter: async (element: HTMLElement, done: () => void) => {
      eventEmitter.emit('TRANSITION:ENTER')
      await onEnter(element, done)
      lenis?.refresh()
      ScrollTrigger.refresh()
      setIsTransitioning()
    },
    onAfterEnter: () => {
      lenis?.start()
      eventEmitter.emit('TRANSITION:AFTER_ENTER')
    }
  }

  let footerFigure: HTMLElement | null = null

  const onLeave = (element: HTMLElement, done: () => void) => {
    const footer = element?.querySelector('.case-footer') as HTMLElement | null
    const footerInner = footer?.querySelector('.case-footer__inner') as HTMLElement | null
    footerFigure = footer?.querySelector('.case-footer__fig') as HTMLElement | null

    const footerRect = footerInner?.getBoundingClientRect() as DOMRect
    const timeline = gsap.timeline({
      onComplete: done
    })

    timeline.to(footerInner, {
      y: -footerRect.top,
      duration: 0.8,
      ease: 'expo.out',
      onComplete: () => {
        lenis?.scrollZero()
        lenis?.stop()
        gsap.set(footer, { visibility: 'hidden' })
        gsap.set(footerInner, {
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 100
        })
      }
    })
  }

  const onEnter = async (element: HTMLElement, done: () => void) => {
    const figureWrapper = element.querySelector('.case-hero__fig-wrapper') as HTMLElement | null
    if (footerFigure) figureWrapper?.appendChild(footerFigure)

    await nextTick()
    if (footerFigure) footerFigure.className = 'case-hero__fig'
    dom?.init({ element })
    dom?.show()

    done()
  }

  to.meta.pageTransition = transition as never
  from.meta.pageTransition = transition as never
}

function defaultTransition({ to, from }: IRouteTransitionProps) {
  const { $lenisControls: lenis, $ScrollTrigger: ScrollTrigger } = useNuxtApp()
  const { setIsTransitioning } = useAppStore()
  const { transitionOut, transitionIn } = usePageTransition()
  const { handleThemeTransition } = useThemePage()
  const { select } = useTools()

  const header = select('.header', document?.body) as HTMLElement
  const overlay = select('.overlay', document?.body) as HTMLElement

  const defaultTransition = {
    name: 'page',
    mode: 'in-out',
    css: true,
    onLeave: async (element: HTMLElement, done: () => void) => {
      lenis?.stop()
      setIsTransitioning()
      eventEmitter.emit('TRANSITION:LEAVE')
      TransitionManager.onLeave({
        element,
        path: { fromRoute: from.path, toRoute: to.path }
      }).catch((error) => {
        console.error('Three.js transition leave error:', error)
      })
      await transitionOut({
        element,
        path: { fromRoute: from.path, toRoute: to.path }
      })
      done()
    },
    onBeforeEnter: () => {
      eventEmitter.emit('TRANSITION:BEFORE_ENTER')
    },
    onEnter: async (element: HTMLElement, done: () => void) => {
      eventEmitter.emit('TRANSITION:ENTER')
      handleThemeTransition({
        to: to.path as string,
        from: from.path as string
      })
      TransitionManager.onEnter({
        element,
        path: { fromRoute: from.path, toRoute: to.path }
      }).catch((error) => {
        console.error('Three.js transition enter error:', error)
      })
      await transitionIn({
        element,
        path: { fromRoute: from.path, toRoute: to.path }
      })
      setIsTransitioning()
      done()
    },
    onAfterEnter: () => {
      lenis?.start()
      lenis?.scrollZero()
      lenis?.refresh()
      ScrollTrigger.refresh()
      eventEmitter.emit('TRANSITION:AFTER_ENTER')
      overlay?.removeAttribute('style')
      header?.removeAttribute('style')
    }
  }

  to.meta.pageTransition = defaultTransition as never
  from.meta.pageTransition = defaultTransition as never
}
