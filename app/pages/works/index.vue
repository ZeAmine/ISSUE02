<script setup lang="ts">
const { container } = useThemeTrigger({
  headerTheme: 'light',
  hasLeaveCallback: true
})

const imagesData = Array.from({ length: 2 }, (_, index) => {
  const imageNumber = index + 1
  return {
    src: `/images/${imageNumber}.webp`,
    width: 1440,
    height: 1800
  }
})

// REFS
const mainRef = ref<HTMLElement | null>(null)

// SEO
useMetadata({
  title: 'Works',
  description: 'This is the works page'
})
</script>

<template>
  <div id="works" ref="mainRef" class="page page-bg">
    <section v-for="(image, index) in imagesData" :key="index" class="works-content">
      <nuxt-link to="/works/one" class="works-link">
        <div class="works-media bg-loading">
          <BaseImage
            :data="{
              src: image.src,
              width: image.width,
              height: image.height
            }"
            :alt="`Image ${index + 1}`"
          />
        </div>
        <div class="works-description st-l">
          Shin Okuda was born in Fukuoka,Japan and now lives and works in LosAngeles, CA. He also
          collaborates on the concept space IKO IKO.For information about purchasing, commissions
          cacapipimdr,or press, please contact:
        </div>
      </nuxt-link>
    </section>
    <section ref="container" class="works-content">
      <nuxt-link to="/works/two" class="works-link">
        <div class="works-media bg-loading">
          <BaseVideo
            :data="{
              src: '/videos/1.mp4',
              width: 1920,
              height: 1080
            }"
            alt="Video 1"
          />
        </div>
        <div class="works-description st-l">
          Shin Okuda was born in Fukuoka,Japan and now lives and works in LosAngeles, CA. He also
          collaborates on the concept space IKO IKO.For information about purchasing, commissions
          cacapipimdr,or press, please contact:
        </div>
      </nuxt-link>
    </section>
    <section ref="container" class="works-content">
      <nuxt-link to="/works/one" class="works-link">
        <div class="works-media bg-loading">
          <BaseImage
            :data="{
              src: imagesData[0].src,
              width: imagesData[0].width,
              height: imagesData[0].height
            }"
            alt="Image 3"
          />
        </div>
        <div class="works-description st-l">
          Shin Okuda was born in Fukuoka,Japan and now lives and works in LosAngeles, CA. He also
          collaborates on the concept space IKO IKO.For information about purchasing, commissions
          cacapipimdr,or press, please contact:
        </div>
      </nuxt-link>
    </section>
    <section v-for="(image, index) in imagesData" :key="index" class="works-content">
      <nuxt-link to="/works/two" class="works-link">
        <div class="works-media bg-loading">
          <BaseImage
            :data="{
              src: image.src,
              width: image.width,
              height: image.height
            }"
            :alt="`Image ${3 + index + 1}`"
          />
        </div>
        <div class="works-description st-l">
          Shin Okuda was born in Fukuoka,Japan and now lives and works in LosAngeles, CA. He also
          collaborates on the concept space IKO IKO.For information about purchasing, commissions
          cacapipimdr,or press, please contact:
        </div>
      </nuxt-link>
    </section>
  </div>
</template>
