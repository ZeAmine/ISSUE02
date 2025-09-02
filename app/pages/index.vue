<script setup lang="ts">
import { HoverAnimation, slideUp } from '@/animations/cores'

const { selectAll } = useTools()
const { container } = useThemeTrigger({
  headerTheme: 'light',
  hasLeaveCallback: true
})

// REFS
const mainRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)

let hoverAnimation: HoverAnimation | null = null

// ANIMATIONS
const onHover = (target: HTMLElement[], trigger: HTMLElement | null) => {
  hoverAnimation = new HoverAnimation({
    element: target,
    trigger: trigger,
    ...slideUp
  })
}

// LIFECYCLE
useSetup(() => {
  const main = mainRef.value as HTMLElement
  const target = selectAll('.ho-info .l', main) as HTMLElement[]
  const trigger = triggerRef.value
  onHover(target, trigger)
})

onBeforeUnmount(() => {
  if (hoverAnimation) {
    hoverAnimation.destroy()
    hoverAnimation = null
  }
})

// SEO
useMetadata({
  title: 'Home',
  description: 'This is the home page'
})
</script>

<template>
  <div id="home" ref="mainRef" class="page page-bg">
    <div ref="triggerRef" class="ho-block" data-layer="top">
      <figure class="ho-media">
        <img src="/images/1.webp" alt="" />
      </figure>
      <div class="ho-info">
        <h2 class="ho-info-title st-t-l">Shin Okuda was born in Fukuoka</h2>
        <p class="ho-info-subtitle st-t-l">Collaboration</p>
      </div>
    </div>

    <div class="home-descriptions st-l">
      <span class="spacer-w">1.</span>
      Shin Okuda was born in Fukuoka,Japan and now lives and works in LosAngeles, CA. He also
      collaborates on the concept space IKO IKO. For information about purchasing, commissions
      cacapipimdr,or press, please contact:
      <br />
      <span class="spacer-h" />
      <span class="spacer-w">2.</span>
      Shin Okuda was born in Fukuoka,Japan and now lives and works in LosAngeles, CA. He also
      collaborates on the concept space IKO IKO. For information about purchasing, commissions
      cacapipimdr,or press, please contact:
    </div>

    <div class="home-icon">
      <svg width="37" height="37" viewBox="0 0 37 37" fill="none">
        <circle cx="18.5" cy="18.5" r="17.5" stroke="#C4C4C4" stroke-width="2" />
        <circle class="home-icon-cercle" cx="18.5" cy="18.5" r="17.5" stroke-width="2" />
        <path d="M14 19.3978L18.6022 24L23.2045 19.3978" stroke="#464646" stroke-width="2" />
        <path d="M18.6016 23.8633L18.6016 12.3577" stroke="#464646" stroke-width="2" />
      </svg>
    </div>
  </div>
</template>
