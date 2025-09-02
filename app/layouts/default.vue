<script setup lang="ts">
const { isPreloaderDone } = storeToRefs(useAppStore())
const { isMobile } = storeToRefs(useViewportStore())

useMetadata({
  title: 'Title',
  description: 'Description'
})
</script>

<template>
  <Header />
  <main :class="['main', { lenis: isMobile }]">
    <slot />
  </main>
  <!-- <Sketch /> -->
  <!-- <Cursor /> -->
  <Preloader />
</template>
