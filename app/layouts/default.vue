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
    <div class="overlay" />
    <slot />
  </main>
  <ClientOnly>
    <Sketch />
  </ClientOnly>
  <!-- <Cursor /> -->
  <Preloader />
</template>
