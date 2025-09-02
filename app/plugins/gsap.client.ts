import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface BlinkEffect {
  effect: (targets: gsap.TweenTarget, vars: any) => gsap.core.Timeline
  extendTimeline: boolean
}

interface BlinkEffects {
  [key: string]: BlinkEffect
}

export default defineNuxtPlugin(() => {
  gsap.registerPlugin(CustomEase, ScrollTrigger, MorphSVGPlugin)
  const { isMobile } = storeToRefs(useViewportStore())

  ScrollTrigger.defaults({
    scroller: isMobile.value ? '.main' : document.body,
    fastScrollEnd: true,
    preventOverlaps: true
    // markers: process.env.NODE_ENV === 'development'
  })

  ScrollTrigger.addEventListener('refreshInit', () => {
    eventEmitter.emit('SCROLL_TRIGGER:REFRESH_INIT')
  })

  gsap.defaults({
    ease: 'power2.out',
    clearStyles: true
  })

  setupCustomEases()
  registerPlugins()

  return {
    provide: {
      gsap,
      ScrollTrigger
    }
  }
})

function setupCustomEases(): void {
  CustomEase.create('expoOut', '0.19, 1, 0.22, 1')
  CustomEase.create('pageOut', '0.44, 0.14, 0.28, 1')
  CustomEase.create('transitionOut', '0.641, 0.16, 0.1, 1.0')
  CustomEase.create('pathOut', '0.4, 0, 0.1, 1')
  CustomEase.create('loadingOut', 'M0,0 C0.2,0 0.2,1 1,1')

  CustomEase.create('--o1', '.65,1,.9,1')
  CustomEase.create('--o2', '.5,1,.89,1')
  CustomEase.create('--o3', '.33,1,.68,1')
  CustomEase.create('--o4', '.25,1,.5,1')
  CustomEase.create('--o5', '.22,1,.36,1')
  CustomEase.create('--o56', '.16,1,.3,1')
  CustomEase.create('--o6', '.19,1,.22,1')
  CustomEase.create('--o7', '.27,.92,.18,1')
  CustomEase.create('--io1', '.37,0,.63,1')
  CustomEase.create('--io2', '.45,0,.55,1')
  CustomEase.create('--io23', '.48,0,.52,1')
  CustomEase.create('--io3', '.65,0,.35,1')
  CustomEase.create('--io4', '.76,0,.24,1')
  CustomEase.create('--io5', '.83,0,.17,1')
  CustomEase.create('--io56', '.84,0,.16,1')
  CustomEase.create('--io6', '.87,0,.13,1')
  CustomEase.create('--io7', '.9,0,.1,1')
  CustomEase.create('--i1', '.12,0,.39,0')
  CustomEase.create('--i2', '.11,0,.5,0')
  CustomEase.create('--i3', '.32,0,.67,0')
  CustomEase.create('--i4', '.5,0,.75,0')
  CustomEase.create('--i5', '.64,0,.78,0')
  CustomEase.create('--i6', '.7,0,.84,0')
}

function registerPlugins(): void {
  gsap.registerPlugin({
    name: 'clearStyles',
    init(target: HTMLElement, vars: { properties: string[] }) {
      const properties = vars?.properties || ['translate', 'rotate', 'scale']
      properties.forEach((prop: string) => target.style?.removeProperty(prop))
    }
  })

  Object.entries(blinkEffects).forEach(([name, config]) => {
    gsap.registerEffect({
      name,
      effect: config.effect,
      extendTimeline: config.extendTimeline
    })
  })
}

const blinkEffects: BlinkEffects = {
  blink: {
    effect: (targets, vars) =>
      gsap
        .timeline()
        .set(targets, { opacity: 0 }, 0)
        .set(targets, { opacity: 1 }, 0.09)
        .set(targets, { opacity: 0 }, 0.15)
        .set(
          targets,
          {
            opacity: 1,
            clearProps: vars.hasClearProps ? 'opacity' : ''
          },
          0.21
        ),
    extendTimeline: true
  },
  blinkOnce: {
    effect: (targets, vars) =>
      gsap
        .timeline()
        .set(targets, { opacity: 0 }, 0)
        .set(
          targets,
          {
            opacity: 1,
            clearProps: vars.hasClearProps ? 'opacity' : ''
          },
          0.09
        ),
    extendTimeline: true
  },
  blinkIn: {
    effect: (targets, vars) =>
      gsap
        .timeline()
        .set(targets, { opacity: 0 }, 0)
        .set(targets, { opacity: 1 }, 0.09)
        .set(targets, { opacity: 0 }, 0.15)
        .set(
          targets,
          {
            opacity: 1,
            clearProps: vars.hasClearProps ? 'opacity' : ''
          },
          0.21
        ),
    extendTimeline: true
  },
  blinkOut: {
    effect: (targets, vars) =>
      gsap
        .timeline()
        .set(targets, { opacity: 0 }, 0)
        .set(targets, { opacity: 1 }, 0.09)
        .set(
          targets,
          {
            opacity: 0,
            clearProps: vars.hasClearProps ? 'opacity' : ''
          },
          0.15
        ),
    extendTimeline: true
  }
}
