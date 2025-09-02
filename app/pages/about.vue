<script setup lang="ts">
const { container } = useThemeTrigger({
  headerTheme: 'light',
  hasLeaveCallback: true
})

// REFS
const mainRef = ref<HTMLElement | null>(null)

// SEO
useMetadata({
  title: 'About',
  description: 'This is the about page'
})
</script>

<template>
  <div id="about" ref="mainRef" class="page page-bg">
    <div class="about-paragraph st-l">
      Shin Okuda was born in Fukuoka,Japan and now lives and works in LosAngeles, CA. He also
      collaborates on the concept space IKO IKO.For information about purchasing, commissions
      cacapipimdr,or press, please contact:
    </div>
    <div ref="container" class="about-paragraph st-l">
      Shin Okuda was born in Fukuoka,Japan and now lives and works in LosAngeles, CA. He also
      collaborates on the concept space IKO IKO.For information about purchasing, commissions
      cacapipimdr,or press, please contact:
    </div>
    <div class="about-paragraph st-l">
      Shin Okuda was born in Fukuoka,Japan and now lives and works in LosAngeles, CA. He also
      collaborates on the concept space IKO IKO.For information about purchasing, commissions
      cacapipimdr,or press, please contact:
    </div>
  </div>
</template>
