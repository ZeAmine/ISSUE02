<script setup lang="ts">
import { checkTween } from '@vendor/checkTween'
import { nextTick } from 'vue'

const { $gsap: gsap } = useNuxtApp()
const { selectAll, select } = useTools()

/* -------------------- Config -------------------- */
const ACTIVE_SLOT = 4
const SCROLL_SPEED = 0.004
const EASE = 0.1
const SNAP_DELAY = 120
const MIN_SNAP_DIST = 0.015
const IDLE_SNAP_DURATION = 0.45
const CLICK_SNAP_DURATION = 0.55

/* -------------------- Data -------------------- */
interface Project {
  id: number
  src: string
  title: string
  info: { category: string; year: string }
}
function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

const projects = ref<Project[]>([
  { id: 1, src: '/images/1.jpeg', title: 'Rabanne', info: { category: 'FEATURED', year: '2025' } },
  { id: 2, src: '/images/2.jpeg', title: 'Clarins', info: { category: 'FEATURED', year: '2025' } },
  { id: 3, src: '/images/3.jpeg', title: 'Kylie', info: { category: 'FEATURED', year: '2024' } },
  { id: 4, src: '/images/4.jpeg', title: 'Vogue', info: { category: '    ', year: '2024' } },
  { id: 5, src: '/images/5.jpeg', title: 'Marie', info: { category: 'COMMISSION', year: '2024' } },
  {
    id: 6,
    src: '/images/6.jpeg',
    title: 'Amica 04',
    info: { category: 'COMMISSION', year: '2024' }
  },
  {
    id: 7,
    src: '/images/7.jpeg',
    title: 'Blue Line',
    info: { category: 'COLLABORATION', year: '2023' }
  },
  {
    id: 8,
    src: '/images/8.jpeg',
    title: 'Flaire',
    info: { category: 'ADVERTISING', year: '2023' }
  },
  { id: 9, src: '/images/9.jpeg', title: 'SACAI', info: { category: 'ADVERTISING', year: '2023' } },
  {
    id: 10,
    src: '/images/10.jpeg',
    title: 'Chanel',
    info: { category: 'COMMISSION', year: '2023' }
  },
  { id: 11, src: '/images/11.jpeg', title: 'KENZO', info: { category: 'FEATURED', year: '2022' } },
  {
    id: 12,
    src: '/images/12.jpeg',
    title: 'ZUVI',
    info: { category: 'ADVERTISING', year: '2022' }
  },
  {
    id: 13,
    src: '/images/13.jpeg',
    title: 'LANKO',
    info: { category: 'ADVERTISING', year: '2022' }
  },
  {
    id: 14,
    src: '/images/14.jpeg',
    title: 'NANAMICA',
    info: { category: 'COMMISSION', year: '2021' }
  },
  { id: 15, src: '/images/15.jpeg', title: 'STUSSY', info: { category: 'FEATURED', year: '2021' } }
])

/* -------------------- Virtual Scroll -------------------- */
const scrollValue = ref(0)
let targetScroll = 0
let rafId: number | null = null

const total = computed(() => projects.value.length)
const orderingBase = computed(() => Math.floor(scrollValue.value))
const isSnapping = ref(false)

const activeBase = computed(() =>
  isSnapping.value ? Math.round(targetScroll) : Math.floor(scrollValue.value + 0.5)
)

const orderedProjects = computed(() => {
  const arr: Project[] = []
  const base = orderingBase.value
  for (let slot = 0; slot < total.value; slot++) {
    arr.push(projects.value[mod(base + slot, total.value)]!)
  }
  return arr
})

const activeProjectIndex = computed(() => mod(activeBase.value + ACTIVE_SLOT, total.value))
const activeSlot = computed(() => mod(activeProjectIndex.value - orderingBase.value, total.value))

/* -------------------- Entry Animation -------------------- */
const ENTRY_SPLIT_INDEX = 4
const entryAnimating = ref(true)
const entryDone = ref(false)

function animateBeforeEnter() {
  const items = selectAll('.home-item')
  if (!items.length) {
    entryAnimating.value = false
    return
  }
  const vh = window.innerHeight
  items.forEach((el: HTMLElement, i: number) => {
    const fromY = i < ENTRY_SPLIT_INDEX ? -vh : vh
    el.style.setProperty('--entry-shift', fromY + 'px')
  })

  // Polygon
  const crossArms = selectAll('polygon')
  gsap.set(crossArms[0]!, { attr: { points: '60 60.5 30 60.5 30 60 30 59.5 60 59.5' } })
  gsap.set(crossArms[1]!, { attr: { points: '60.5 60 60.5 90 60 90 59.5 90 59.5 60' } })
  gsap.set(crossArms[2]!, { attr: { points: '60 59.5 90 59.5 90 60 90 60.5 60 60.5' } })
  gsap.set(crossArms[3]!, { attr: { points: '59.5 60 59.5 30 60 30 60.5 30 60.5 60' } })
}

function selectInitialActive() {
  const idx = activeProjectIndex.value
  confirmedIndex.value = idx
  animateSelection(idx)
}

function animateEnter() {
  if (entryDone.value) return

  const items = selectAll('.home-item')
  if (!items.length) {
    entryAnimating.value = false
    return
  }

  const top = items.slice(0, ENTRY_SPLIT_INDEX)
  const bottom = items.slice(ENTRY_SPLIT_INDEX)

  gsap
    .timeline({
      defaults: {
        duration: 1.4,
        ease: '--o56'
      },
      delay: 0.2,
      onStart() {
        gsap.delayedCall(1.2, () => {
          requestAnimationFrame(() => {
            selectInitialActive()
          })
        })
      },
      onComplete() {
        entryDone.value = true
        entryAnimating.value = false
        items.forEach((el: HTMLElement) => el.style.removeProperty('--entry-shift'))
      }
    })
    .to(top, { '--entry-shift': '0px', stagger: { each: 0.06, from: 'end' } }, 0)
    .to(bottom, { '--entry-shift': '0px', stagger: { each: 0.06, from: 'start' } }, 0)

  // Polygon
  const crossArms = selectAll('polygon')
  gsap
    .timeline({
      defaults: {
        duration: 1.4,
        ease: '--o7',
        overwrite: true
      }
    })
    .to(crossArms[0]!, { attr: { points: '60 60.5 30 60.5 30 60 30 59.5 60 59.5' } }, 0)
    .to(crossArms[1]!, { attr: { points: '60.5 60 60.5 90 60 90 59.5 90 59.5 60' } }, 0)
    .to(crossArms[2]!, { attr: { points: '60 59.5 90 59.5 90 60 90 60.5 60 60.5' } }, 0)
    .to(crossArms[3]!, { attr: { points: '59.5 60 59.5 30 60 30 60.5 30 60.5 60' } }, 0)
}

/* -------------------- Confirmation / Animation State -------------------- */
const confirmedIndex = ref<number | null>(null)
let animation: gsap.core.Timeline | null = null

function resetVisualState() {
  checkTween(animation)
  const items = selectAll('.home-item')
  items.forEach((el: HTMLElement) => {
    const lines = selectAll('.l', el)
    gsap.to(el, {
      opacity: 1,
      duration: 0.4,
      ease: '--o2',
      overwrite: true
    })
    lines.forEach((l: HTMLElement) => {
      gsap.to(l, {
        y: '-110%',
        duration: 0.8,
        ease: '--o6',
        force3D: true,
        overwrite: true
      })
    })
  })
  // Figures
  const figs = selectAll('.home-preview-fig')
  const imgs = selectAll('.home-preview-fig img')
  gsap
    .timeline({
      defaults: {
        duration: 0.6,
        ease: '--o6',
        overwrite: true
      }
    })
    .to(figs, { opacity: 0, clipPath: 'inset(6%)' }, 0)
    .to(imgs, { scale: 1.1 }, 0)
  // Polygon
  const crossArms = selectAll('polygon')
  gsap
    .timeline({
      defaults: {
        duration: 0.6,
        ease: '--o7',
        overwrite: true
      },
      delay: 0.4
    })
    .to(crossArms[0]!, { attr: { points: '45 60.5 45 60.5 45 60 45 59.5 45 59.5' } }, 0)
    .to(crossArms[1]!, { attr: { points: '60.5 75 60.5 75 60 75 59.5 75 59.5 75' } }, 0)
    .to(crossArms[2]!, { attr: { points: '75 59.5 75 59.5 75 60 75 60.5 75 60.5' } }, 0)
    .to(crossArms[3]!, { attr: { points: '59.5 45 59.5 45 60 45 60.5 45 60.5 45' } }, 0)
}

function animateSelection(globalIndex: number) {
  const figures = selectAll('.home-preview-fig')
  const activeFig = figures[globalIndex]
  const activeImg = activeFig ? select('img', activeFig) : null
  if (!activeFig || !activeImg) return

  const items = selectAll('.home-item')
  const activeItem = items.find((el: HTMLElement) => {
    const slot = Number(el.style.getPropertyValue('--slot') || '0')
    return mod(orderingBase.value + slot, total.value) === globalIndex
  })
  if (!activeItem) return

  const siblings = items.filter((i) => i !== activeItem)
  const lines = selectAll('.l', activeItem)
  const crossArms = selectAll('polygon')

  checkTween(animation)
  animation = gsap.timeline()

  animation.to(
    siblings,
    {
      opacity: 0.4,
      duration: 0.5,
      ease: '--o2',
      overwrite: true
    },
    0
  )
  animation.fromTo(
    lines,
    { y: '-110%', force3D: true },
    {
      y: '0%',
      duration: 0.8,
      ease: '--o6',
      stagger: 0.04,
      force3D: true,
      overwrite: true
    },
    0
  )
  animation
    .fromTo(
      activeFig,
      {
        opacity: 0,
        clipPath: 'inset(6%)'
      },
      {
        opacity: 1,
        clipPath: 'inset(0%)',
        duration: 1,
        ease: '--o56',
        overwrite: true
      },
      0
    )
    .fromTo(
      activeImg,
      { scale: 1.2 },
      {
        scale: 1,
        duration: 1,
        ease: '--o56',
        overwrite: true
      },
      0
    )
  animation
    .to(
      crossArms[0]!,
      {
        attr: { points: '45 60.5 45 60.5 45 60 45 59.5 45 59.5' },
        duration: 1,
        ease: '--o7'
      },
      0
    )
    .to(
      crossArms[1]!,
      {
        attr: { points: '60.5 75 60.5 75 60 75 59.5 75 59.5 75' },
        duration: 1,
        ease: '--o7'
      },
      0
    )
    .to(
      crossArms[2]!,
      {
        attr: { points: '75 59.5 75 59.5 75 60 75 60.5 75 60.5' },
        duration: 1,
        ease: '--o7'
      },
      0
    )
    .to(
      crossArms[3]!,
      {
        attr: { points: '59.5 45 59.5 45 60 45 60.5 45 60.5 45' },
        duration: 1,
        ease: '--o7'
      },
      0
    )
}

/* -------------------- Snap Logic -------------------- */
let snapTimeout: number | null = null
let snapTween: gsap.core.Tween | null = null

function scheduleIdleSnap() {
  if (snapTimeout) clearTimeout(snapTimeout)
  snapTimeout = window.setTimeout(() => startSnapTo(), SNAP_DELAY)
}

function cancelPendingSnap() {
  if (snapTimeout) {
    clearTimeout(snapTimeout)
    snapTimeout = null
  }
  if (snapTween) {
    snapTween.kill()
    snapTween = null
  }
  if (isSnapping.value) isSnapping.value = false
  confirmedIndex.value = null
  resetVisualState()
}

function startSnapTo(targetBase?: number, duration?: number) {
  cancelPendingSnap()
  const current = targetScroll
  const nearestBase = targetBase !== undefined ? targetBase : Math.round(current)
  const dist = Math.abs(nearestBase - current)

  const futureGlobalIndex = mod(nearestBase + ACTIVE_SLOT, total.value)
  confirmedIndex.value = futureGlobalIndex
  animateSelection(futureGlobalIndex)

  if (dist < MIN_SNAP_DIST) {
    targetScroll = nearestBase
    return
  }

  isSnapping.value = true
  const proxy = { v: current }
  snapTween = gsap.to(proxy, {
    v: nearestBase,
    duration: duration ?? IDLE_SNAP_DURATION,
    ease: 'power3.out',
    overwrite: true,
    onUpdate: () => {
      targetScroll = proxy.v
    },
    onComplete: () => {
      isSnapping.value = false
      snapTween = null
    }
  })
}

/* -------------------- Input -------------------- */
function onWheel(e: WheelEvent) {
  if (entryAnimating.value) {
    e.preventDefault()
    return
  }
  e.preventDefault()
  cancelPendingSnap()
  targetScroll += e.deltaY * SCROLL_SPEED
  scheduleIdleSnap()
}

function onItemClick(slot: number) {
  if (entryAnimating.value) return
  const globalIndex = mod(orderingBase.value + slot, total.value)
  const neededBase = globalIndex - ACTIVE_SLOT
  if (Math.round(targetScroll) === neededBase && !isSnapping.value) {
    confirmedIndex.value = globalIndex
    animateSelection(globalIndex)
    return
  }
  startSnapTo(neededBase, CLICK_SNAP_DURATION)
}

/* -------------------- Center Shift -------------------- */
const listRef = ref<HTMLElement | null>(null)
const centerShift = ref(0)
function updateCenterShift() {
  const listEl = listRef.value
  if (!listEl) return
  const activeEl = listEl.querySelector('.home-item.is-active') as HTMLElement | null
  if (!activeEl) return
  const rect = activeEl.getBoundingClientRect()
  const desired = window.innerHeight / 2 - (rect.top + rect.height / 2)
  centerShift.value += (desired - centerShift.value) * 0.25
}

/* -------------------- RAF Loop -------------------- */
function loop() {
  scrollValue.value += (targetScroll - scrollValue.value) * EASE
  if (scrollValue.value > 1e6 || scrollValue.value < -1e6) {
    scrollValue.value = scrollValue.value % total.value
    targetScroll = targetScroll % total.value
  }
  updateCenterShift()
  rafId = requestAnimationFrame(loop)
}

/* -------------------- Theme Cycler -------------------- */
const themes = [
  { bg: '#C2FC07', fg: '#000000' },
  { bg: '#19001C', fg: '#D194D4' },
  { bg: '#001C07', fg: '#94D494' },
  { bg: '#1C0000', fg: '#D49494' },
  { bg: '#07001C', fg: '#9794D4' }
]

const themeIndex = ref(0)

function applyTheme(i: number) {
  const t = themes[i]
  if (!t) return
  const root = document.documentElement
  root.style.setProperty('--bg-color', t.bg)
  root.style.setProperty('--text-color', t.fg)
}

function cycleTheme() {
  themeIndex.value = (themeIndex.value + 1) % themes.length
  applyTheme(themeIndex.value)
}

/* -------------------- Lifecycle -------------------- */
function onResize() {
  updateCenterShift()
}

onMounted(() => {
  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('resize', onResize, { passive: true })
  window.addEventListener('click', cycleTheme, { passive: true })
  applyTheme(themeIndex.value)
  resetVisualState()
  animateBeforeEnter()
  loop()
})

useSetup(() => {
  animateEnter()
})

onBeforeUnmount(() => {
  window.removeEventListener('wheel', onWheel)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('click', cycleTheme)
  if (rafId) cancelAnimationFrame(rafId)
  cancelPendingSnap()
})

/* -------------------- SEO -------------------- */
useMetadata({
  title: 'Home',
  description: 'This is the home page'
})
</script>

<template>
  <div id="home" class="page page-bg">
    <!-- Preview -->
    <div class="home-preview">
      <div class="home-preview-icon">
        <svg viewBox="0 0 120 120">
          <polygon points="45 60.5 45 60.5 45 60 45 59.5 45 59.5"></polygon>
          <polygon points="60.5 75 60.5 75 60 75 59.5 75 59.5 75"></polygon>
          <polygon points="75 59.5 75 59.5 75 60 75 60.5 75 60.5"></polygon>
          <polygon points="59.5 45 59.5 45 60 45 60.5 45 60.5 45"></polygon>
        </svg>
      </div>
      <div class="home-preview-list">
        <figure v-for="p in projects" :key="p.id" class="home-preview-fig" :data-id="p.id">
          <BaseImage :data="{ src: p.src }" is-fit />
        </figure>
      </div>
    </div>

    <!-- Liste -->
    <ul
      ref="listRef"
      class="home-list"
      :style="{
        '--frac': (scrollValue - orderingBase).toString(),
        '--center-shift': centerShift + 'px'
      }"
    >
      <li
        v-for="(p, slot) in orderedProjects"
        :key="p.id"
        class="home-item"
        :class="{ 'is-active': slot === activeSlot }"
        :style="{ '--slot': slot }"
        @click="onItemClick(slot)"
      >
        <div class="home-item-badge">
          <span>{{ p.id }}</span>
        </div>
        <h2 class="home-item-title">{{ p.title }}</h2>
        <div class="home-item-info">
          <div class="l_">
            <div class="l">{{ p.info.category }}</div>
          </div>
          <div class="l_">
            <div class="l">({{ p.info.year }})</div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
