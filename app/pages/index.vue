<script setup lang="ts">
import type { HoverAnimation } from '@/animations/cores'

const { selectAll } = useTools()

// REFS
const mainRef = ref<HTMLElement | null>(null)

// ANIMATIONS

// LIFECYCLE
useSetup(() => {})

onBeforeUnmount(() => {})

// SEO
useMetadata({
  title: 'Home',
  description: 'This is the home page'
})
</script>

<template>
  <div id="home" ref="mainRef" class="page page-bg"></div>
</template>
